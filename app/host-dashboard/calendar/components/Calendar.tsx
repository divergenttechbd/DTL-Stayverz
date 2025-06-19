'use client'
import { Gear } from '@phosphor-icons/react/dist/ssr/Gear'
import { useQuery } from '@tanstack/react-query'
import dayjs, { Dayjs } from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarAction } from '~/app/host-dashboard/calendar/components/CalendarAction'
import Month from '~/app/host-dashboard/calendar/components/Month'
import { YearDropdownToggler } from '~/app/host-dashboard/calendar/components/YearDropdownToggler'
import useSplitIntervalsByWeekends from '~/app/host-dashboard/calendar/hooks/useSplitIntervalsByWeekends'
import Dropdown, { DropdownMenu } from '~/components/layout/Dropdown'
import ListingDropdown from '~/components/layout/ListingDropdown'
import { ListingDropdownToggler } from '~/components/layout/ListingDropdownToggler'
import useCalendar from '~/hooks/calendar/useCalendar'
import { getBookableListingDetails, getListings } from '~/queries/client/listing'


export type Listing = {
  id: number
  unique_id: string
  cover_photo?: string
  title: string
  created_at: string
  status: string
  base_price: number | string
  amenities: any[]
  description: string
}

export type DateRange = {
  startDate: Dayjs | null
  endDate: Dayjs | null
}
export type HandlePriceSettings = (value: boolean) => () => void;

export const Calendar = () => {
  const {splitIntervalsByWeekends} = useSplitIntervalsByWeekends()
  const {selectedRange, inDragRange, isDragging, isPrevious, resetSelected, inSelectedRange, generateDataByYear, handleMouseDown, handleMouseEnter, handleMouseUp, handleTouch} = useCalendar()
  const [year, setYear] = useState(dayjs().get('year'))
  const [yearOptions, setYearOptions] = useState<DropdownMenu[]>([])
  const [selectedBooking, setSelectedBooking] = useState<string | undefined>()
  const [priceSettings, setPriceSettings] = useState<boolean>(false)

  const handlePriceSettings:HandlePriceSettings = useCallback((value:boolean) => {
    return () => {
      setPriceSettings(value)
    }
  },[])

  const handleBookingSelect = useCallback((id:string) => () => {
    if(id) resetSelected()
    setSelectedBooking(id)
  }, [resetSelected])

  const [listing, setListing] = useState<Listing | undefined>(undefined)
  
  const calendarParams = useMemo(() => ({
    from_date: `${year}-01-01`,
    to_date: `${year}-12-31`,
    id: listing?.id
  }), [listing, year])


  const { data: listingMenuData } = useQuery({
    queryKey: ['listingMenu', { page_size: 0 }],
    queryFn: () => getListings({params: {status: 'published'}}),
  })

  const { data: calendarData } = useQuery({
    queryKey: ['calendarData', calendarParams, listing?.id],
    queryFn: () => getBookableListingDetails({params: calendarParams}),
  })

  const { refetch: refetchCalendarData } = useQuery({
    queryKey: ['calendarData', calendarParams, listing?.id],
    queryFn: () => getBookableListingDetails({ params: calendarParams }),
  })

  const listingMenu = listingMenuData?.data?.map((d:Listing) => ({
    label: d.title,
    imgUrl: d.cover_photo,
    key: d.unique_id,
    onClick: ({ onClose }: { onClose: Function }) => {
      setListing(d)
      onClose()
    }
  }))

  const resetSelectedForMobile = useCallback(() => {
    if(selectedRange.startDate && selectedRange.startDate.isSame(selectedRange.endDate))
      return
    handlePriceSettings(false)
    resetSelected()
  }, [resetSelected, handlePriceSettings, selectedRange])


  useEffect(() => {
    if(listingMenuData)
      setListing(listingMenuData?.data?.[0])
  }, [listingMenuData])

  useEffect(() => {
    if(listing) {
      const startingYear = dayjs(listing.created_at).get('year')
      const endingYear = dayjs().add(2, 'year').get('year')
      const yearMenu = Array.from({ length: endingYear - startingYear + 1 }, (_, index) => startingYear + index).map(year => ({
        key: String(year), 
        label: year.toString(), 
        onClick: ({ onClose }: { onClose: Function }) => {
          setYear(year)
          onClose()
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
        <div className='h-[10vh] items-center flex justify-between bg-white mt-2 border-b px-2 sm:px-4 sm:p-4 border-r'>
          <Dropdown menus={yearOptions || []} menuClass='left-0' renderToggler={({toggle}) => <YearDropdownToggler title={year.toString() || 'Select Year'} onToggle={toggle} />} />
          <ListingDropdown 
            menus={listingMenu || []} 
            renderToggler={({toggle}) => 
              <ListingDropdownToggler 
                imgUrl={listing?.cover_photo || null}
                title={listing?.title || 'Select Listing'} 
                onToggle={toggle} 
              />
            }
          />
          <div className={`flex justify-center items-center md:hidden `}>
            <Gear size={20} className='cursor-pointer' onClick={handlePriceSettings(true)}/>
          </div>
        </div>
        <div className='sm:px-10  overflow-x-hidden overflow-y-scroll max-h-[88vh] sm:max-h-[80vh]'>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3'>
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
          setListing={setListing} 
          selectedRange={selectedRange} 
          resetSelected={resetSelected} 
          data={calendarData?.data} 
          listing={listing}
          closeModal={handlePriceSettings(false)}
        />
      </div>
      {(priceSettings) && 
      <div 
        className='slide-in-bottom rounded-t-xl sm:rounded-none w-full absolute z-10 sm:z-auto bottom-0 bg-white border-l sm:px-5 block shadow-[0_-1px_10px_5px_rgba(0,0,0,0.1)] md:hidden'
      >
        <CalendarAction 
          selectedBooking={selectedBooking} 
          onBookingSelect={handleBookingSelect} 
          refetchCalendarData={refetchCalendarData} 
          setListing={setListing} 
          selectedRange={selectedRange} 
          resetSelected={resetSelectedForMobile} 
          data={calendarData?.data} 
          listing={listing} 
          closeModal={handlePriceSettings(false)}
        />
      </div>}
    </div>
  )
}
