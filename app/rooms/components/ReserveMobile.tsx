import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import RoomDateRange from '~/app/rooms/components/RoomDateRange'
import { DateRangeWithRoomDataTypes, getStayingDuration } from '~/app/rooms/components/RoomDetails'
import { GuestCounts } from '~/app/rooms/components/guestDropdown/GuestDropDown'
import { useBookingCard } from '~/app/rooms/components/hooks/useBookingCard'
import Button from '~/components/layout/Button'
import Modal from '~/components/modal/Modal'
import { DATE_FORMAT } from '~/constants/format'
import useWindowSize from '~/hooks/useWindowSize'
import { getAsQueryString } from '~/lib/utils/url'

export interface ReserveMobileTypes extends DateRangeWithRoomDataTypes {
  isOpen: boolean
  handleModalOpen:Function
  handleModalClose:Function
}

const ReserveMobile: FC<ReserveMobileTypes> = (props) => {
  const {isMobileView} = useWindowSize()
  const [guests, setGuestsNumber] = useState<GuestCounts>({ adult: 1, children: 0, infant: 0, pets: 0 })
  const { selectedRange, data, resetSelected,isOpen,handleModalOpen ,handleModalClose} = props
  const { totalNights, arrivalDate, leavingDate } = getStayingDuration(selectedRange)
  const [error, onValidate, minimumNightsSelected, hasDateRangeSelected] = useBookingCard(selectedRange, data)
  const searchParams = useSearchParams()
  const router = useRouter()

  const openDateRangeModal = useCallback(() =>handleModalOpen() ,[handleModalOpen])
  const closeDateRangeModal = useCallback(() =>handleModalClose() ,[handleModalClose])

  const calculationData = useMemo(() => {
    if (!(selectedRange.startDate && selectedRange.endDate))
      return {}

    const datesArray = [...Array(Math.abs(selectedRange?.endDate?.diff(selectedRange?.startDate, 'day')) || 0)]
      .map((_, index) => (selectedRange.startDate?.add(index, 'day').format(DATE_FORMAT)))
    const price = datesArray.map(date => data?.calendar_data[date || '']?.price || 0).reduce((acc, n) => acc + n, 0)
    const price_info: Record<string, any> = {}

    datesArray.forEach(date => {
      if (date) price_info[date] = data?.calendar_data[date]
    })

    return {
      bookingPrice: price,
      bookingCharge: Math.round(price * data?.service_charge_percentage) || 0,
      total_price: price + Math.round(price * data?.service_charge_percentage || 0),
      totalNights: datesArray.length,
      price_info
    }
  }, [data, selectedRange])

  const staysDuration = useMemo(() => {
    const duration =  `${arrivalDate?.split(',')?.[0]} - ${leavingDate?.split(',')?.[0]}`
    return duration
  },[arrivalDate, leavingDate])

  useEffect(() => {
    if (searchParams.has('adult')) {
      setGuestsNumber({
        adult: parseInt(searchParams.get('adult') || '0'),
        children: parseInt(searchParams.get('children') || '0'),
        infant: parseInt(searchParams.get('infant') || '0'),
        pets: 0
      })
    }
  }, [searchParams, setGuestsNumber])

  const clearDates = () => {
    resetSelected()
  }


  const handleSubmit = useCallback(() => {
    console.log(guests)
    // return
    if (onValidate?.()) {
      router.push(`/checkout/${data?.unique_id}${getAsQueryString({
        ...guests,
        check_in: selectedRange.startDate?.format(DATE_FORMAT),
        check_out: selectedRange.endDate?.format(DATE_FORMAT)
      })}`)
    } else {
      if(isMobileView) handleModalOpen()
    }

  }, [data, guests, router, onValidate, selectedRange, handleModalOpen,isMobileView])


  return (
    <>
      <div>
        <div className=''>
          <Modal
            show={isOpen}
            onClose={closeDateRangeModal}
            modalContainerclassName='slide-in-bottom w-full  overflow-y-auto rounded-t-2xl fixed h-[95vh] bottom-0'
            title={'Select Dates'}
            titleContainerClassName='items-center justify-center gap-5 p-4 border-b'
            crossBtnClassName='absolute left-4 top-1/2 -translate-y-1/2'
            bodyContainerClassName='px-3 py-6'
          >

            <div className=''>
              <RoomDateRange
                {...props}
                data={data}
                some={true} />
              <div className='flex justify-start items-center'>
                <button type='button' onClick={clearDates} className='text-[#202020] text-[16px] font-medium underline hover:bg-[rgba(0,0,0,0.01)] py-1 px-2 rounded-md'>Clear Dates</button>
              </div>
            </div>

            <div className='absolute w-full left-0 right-0 mx-auto bottom-0 bg-white px-3 py-2 border-t z-[100]'>
              <div className='sm:container flex justify-between items-center'>
                <div className='w-full'>
                  {totalNights > 0 ?
                    <span onClick={openDateRangeModal}>
                      <p className='font-[500] text-[14px] text-[#202020]'>৳ {calculationData.total_price} <span className='text-[12px]'>total</span></p>
                      <p className='font-[500] text-[14px] text-[#202020] underline'>
                        {arrivalDate?.split(',')?.[0]} - ${leavingDate?.split(',')?.[0]}
                      </p>
                    </span> :
                    <p  onClick={openDateRangeModal} className='font-medium text-[14px] text-[#202020] underline cursor-pointer'>
                      Add dates for price
                    </p>}
                </div>
                <Button variant='custom' label='Save' disabled={totalNights > 0 ? false : true} className='bg-[#F15927] mt-2 text-white font-medium py-2 px-4 rounded-[8px]' onclick={closeDateRangeModal} type='button' />
              </div>
            </div>
          </Modal>

        </div>
      </div>
      <div className='lg:hidden bg-[#ffffff] py-4 px-3 fixed bottom-0 w-full border z-10'>
        <div className='sm:container flex justify-between items-center'>
          <div className='w-full'>
            {totalNights > 0 ?
              <span onClick={openDateRangeModal}>
                <p className='font-[500] text-[14px] text-[#202020]'>৳ {calculationData.total_price} <span className='text-[12px]'>total</span></p>
                <p  className='font-[500] text-[14px] text-[#202020] underline'>
                  {arrivalDate?.split(',')?.[0]} - {leavingDate?.split(',')?.[0]}
                </p>
              </span> :
              <p  onClick={openDateRangeModal} className='font-medium text-[14px] text-[#202020] underline cursor-pointer'>
                Add dates for price
              </p>}
          </div>
          <Button className='min-w-[120px] max-w-[max-content] text-[14px] py-3 mt-0'
            label={`${totalNights > 0 ? 'Reserve' : 'Check Availability'}`}
            variant='regular' onclick={handleSubmit} type='button' />
        </div>
      </div>
    </>
  )
}

export default ReserveMobile
