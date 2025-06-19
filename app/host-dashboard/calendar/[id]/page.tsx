'use client'
import { CaretDown } from '@phosphor-icons/react/dist/ssr/CaretDown'
import { CaretLeft } from '@phosphor-icons/react/dist/ssr/CaretLeft'
import { Gear } from '@phosphor-icons/react/dist/ssr/Gear'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { HandlePriceSettings } from '~/app/host-dashboard/calendar/components/Calendar'
import { CalendarAction } from '~/app/host-dashboard/calendar/components/CalendarAction'
import Month from '~/app/host-dashboard/calendar/components/Month'
import useSplitIntervalsByWeekends from '~/app/host-dashboard/calendar/hooks/useSplitIntervalsByWeekends'
import Button from '~/components/layout/Button'
import { useModal } from '~/components/modal/hooks/useModal'
import useCalendar from '~/hooks/calendar/useCalendar'
import { useDetectOutsideClick } from '~/hooks/useDetectOutsideClick'
import { getBookableListingDetails, getListing } from '~/queries/client/listing'
import { styles } from '~/styles/classes'

export type YearOptionTypes = {
  key: string
  label: React.ReactNode
  path?: string,
  onClick: () => void
}

const CalendarMobile = ({params}:{params: {id: string}}) => {
  const {splitIntervalsByWeekends} = useSplitIntervalsByWeekends()
  const { data: listing } = useQuery({queryKey: ['listing', params],queryFn: () => getListing({params})})
  const router = useRouter()
  const {selectedRange, inDragRange, isDragging, isPrevious, resetSelected, inSelectedRange, generateDataByYear, handleMouseDown, handleMouseEnter, handleTouch, handleMouseUp} = useCalendar()
  const [year, setYear] = useState(dayjs().get('year'))
  const [yearOptions, setYearOptions] = useState<YearOptionTypes[]>([])
  const [selectedBooking, setSelectedBooking] = useState<string | undefined>()
  const [priceSettings, setPriceSettings] = useState<boolean>(false)
  const [isYearModalOpen, handleYearModalOpen, handleYearModalClose] = useModal()
  const yearModalRef = useRef(null)
  useDetectOutsideClick (yearModalRef,handleYearModalClose , true)

  const handlePriceSettings:HandlePriceSettings = useCallback((value:boolean) => {
    return () => {
      setPriceSettings(value)
    }
  },[])

  const handleBackToCalendarListing = useCallback(() => {
    router.push('/host-dashboard/calendar-listings')
  },[router])

  const handleBookingSelect = useCallback((id:string) => () => {
    if(id) resetSelected()
    setSelectedBooking(id)
  }, [resetSelected])

  
  const calendarParams = useMemo(() => ({
    from_date: `${year}-01-01`,
    to_date: `${year}-12-31`,
    id: listing?.data?.id
  }), [listing, year])



  const { data: calendarData } = useQuery({
    queryKey: ['calendarData', calendarParams, listing?.data?.id],
    queryFn: () => getBookableListingDetails({params: calendarParams}),
  })

  const { refetch: refetchCalendarData } = useQuery({
    queryKey: ['calendarData', calendarParams, listing?.data?.id],
    queryFn: () => getBookableListingDetails({ params: calendarParams }),
  })

  const resetSelectedForMobile = useCallback(() => {
    if(selectedRange.startDate && selectedRange.startDate.isSame(selectedRange.endDate))
      return
    handlePriceSettings(false)
    resetSelected()
  }, [resetSelected, handlePriceSettings, selectedRange])

  useEffect(() => {
    if(listing) {
      const startingYear = dayjs(listing?.data?.created_at).get('year')
      const endingYear = dayjs().add(2, 'year').get('year')
      const yearMenu = Array.from({ length: endingYear - startingYear + 1 }, (_, index) => startingYear + index).map(year => ({
        key: String(year), 
        label: year.toString(), 
        onClick: () => {
          setYear(year)
        }}))
      setYearOptions(yearMenu)
    }
  }, [listing])

  useEffect(() => {
    if(selectedRange.startDate) setPriceSettings(true)
  }, [selectedRange])

  const data = useMemo(() => generateDataByYear(year), [generateDataByYear, year])
  const bookedIntervals = useMemo(() => {
    return calendarData?.data ? splitIntervalsByWeekends(calendarData?.data?.calendar_data) : {}
  }, [calendarData?.data, splitIntervalsByWeekends])
 
  return (
    <div className='flex flex-row'>
      <div className='flex-grow'>
        <div className='h-[50px] items-center flex justify-between bg-white mt-2 border-b px-2 sm:px-4 sm:p-4 border-r'>
          <div className='flex justify-start items-center max-w-[250px]'>
            <div className={`${styles.flexCenter}`}>
              <CaretLeft size={20} onClick={handleBackToCalendarListing} className='cursor-pointer' fill='#222222'/>
            </div>
            <div className='flex justify-center items-center relative ml-2 mr-3'>
              <div className='border-[2px] rounded-full w-[30px] h-[30px]'>
                <Image
                  src={listing?.data?.cover_photo}
                  alt='profile-image'
                  fill
                  className='rounded-full relative object-cover'
                />
              </div>
            </div>
            <div className='font-semibold text-[#202020] text-[16px] ellipsis-one-line'>{listing?.data?.title}</div>
          </div>
          <div className='flex justify-end items-center gap-2 mr-2'>
            <div className={`${styles.flexCenter} md:hidden `}>
              <Gear size={20} className='cursor-pointer' onClick={handlePriceSettings(true)}/>
            </div>
            <div onClick={handleYearModalOpen} className='flex justify-start items-center gap-1 cursor-pointer'>
              <p className='font-semibold text-[#202020] text-[16px]'>{year}</p>
              <CaretDown size={13} className='cursor-pointer' fill='#222222'/>
            </div>
          </div>
        </div>
        <div className='sm:px-10  overflow-x-hidden overflow-y-scroll max-h-[88vh] sm:max-h-[80vh] pt-3'>
          <div className='grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3'>
            {data.data.map((monthData, monthIndex) => {
              return (
                <Month
                  monthData={monthData}
                  key={monthData.month}
                  year={dayjs().get('year')}
                  onMouseDown={handleMouseDown}
                  onMouseEnter={handleMouseEnter}
                  onMouseUp={handleMouseUp}
                  onTouch={handleTouch}
                  inDragRange={inDragRange}
                  inSelectedRange={inSelectedRange}
                  isDragging={isDragging}
                  onBookingSelect={handleBookingSelect}
                  isPrevious={isPrevious}
                  calendarData={calendarData?.data?.calendar_data}
                  bookedIntervals={bookedIntervals}
                />
              )
            })}
          </div>
        </div>
      </div>
      <div className='sm:w-[320px] sm:border-l hidden md:block'>
        <CalendarAction 
          selectedBooking={selectedBooking} 
          onBookingSelect={handleBookingSelect} 
          refetchCalendarData={refetchCalendarData} 
          selectedRange={selectedRange} 
          resetSelected={resetSelected} 
          data={calendarData?.data} 
          listing={listing?.data}
          closeModal={handlePriceSettings(false)}
        />
      </div>

      {/* ============= CALENDAR ACTION MODAL ============= */}
      {((priceSettings || !!selectedBooking) && !isYearModalOpen) && 
      <div className={`slide-in-bottom rounded-t-xl sm:rounded-none w-full fixed z-10 sm:z-auto bottom-0 bg-white border-l sm:px-5 block shadow-[0_-1px_10px_5px_rgba(0,0,0,0.1)] md:hidden pb-5`}>
        <CalendarAction 
          selectedBooking={selectedBooking} 
          onBookingSelect={handleBookingSelect} 
          refetchCalendarData={refetchCalendarData} 
          selectedRange={selectedRange} 
          resetSelected={resetSelectedForMobile} 
          data={calendarData?.data} 
          listing={listing?.data} 
          closeModal={handlePriceSettings(false)}
        />
      </div>}

      {/* ============= YEAR MODAL ============= */}
      <div ref={yearModalRef} className={`${isYearModalOpen ? 'block slide-in-bottom' : 'hidden'} rounded-t-xl sm:rounded-none w-full fixed z-10 sm:z-auto bottom-0 bg-white border-l sm:px-5 shadow-[0_-1px_10px_5px_rgba(0,0,0,0.1)]`}>
        <div className='mb-5 px-5 py-5 flex flex-col justify-center items-center gap-5'>
          <div className={`${styles.flexCenter} border-b pb-2 w-full`}>
            <p className='font-medium text-[#202020] text-[16px]'>Select Year</p>
          </div>
          <div className='w-full'>
            <div className='space-y-2'>
              {yearOptions.map(option =>    
                <button 
                  key={option.key} 
                  onClick={option.onClick}
                  className={` py-2 w-full rounded-md text-center ${option.key.includes(year.toString())  ? 'bg-gray-100 font-semibold text-[#202020] text-[16px]' : 'font-medium text-gray-500 text-[14px]'} `}>
                  {option.label}
                </button>)}
            </div>
          </div>
          <Button label='Close' variant={'primary'} className='w-full !py-2.5' onclick={handleYearModalClose}/>
        </div>
      </div>
    </div>
  )
}

export default CalendarMobile
