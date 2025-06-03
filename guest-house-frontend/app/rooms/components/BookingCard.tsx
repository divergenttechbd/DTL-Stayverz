'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import PriceBreakdownPopover from '~/app/rooms/components/PriceBreakdownPopover'
import { DateRangeWithRoomDataTypes } from '~/app/rooms/components/RoomDetails'
import DateRangeDropdown from '~/app/rooms/components/guestDropdown/DateRangeDropdown'
import GuestDropDown, { GuestCounts } from '~/app/rooms/components/guestDropdown/GuestDropDown'
import Button from '~/components/layout/Button'
import { DATE_FORMAT } from '~/constants/format'
import { getAsQueryString } from '~/lib/utils/url'
import { styles } from '~/styles/classes'

const BookingCard: FC<DateRangeWithRoomDataTypes> = (props) => {

  const { selectedRange, data, onChange, error, onValidate } = props
  const [isOpen, setIsOpen] = useState(false)
  const [guests, setGuestsNumber] = useState<GuestCounts>({ adult: 1, children: 0, infant: 0, pets: 0 })

  const searchParams = useSearchParams()

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

    // calculate the booking price
    const bookingCharge = parseFloat((price * (data?.service_charge_percentage ?? 0)).toFixed(2))
    const total_price = price + bookingCharge

    return {
      bookingPrice: price,
      bookingCharge: bookingCharge,
      total_price: total_price,
      totalNights: datesArray.length,
      price_info
    }
  }, [data, selectedRange])

  const router = useRouter()
  const handleSubmit = useCallback(() => {
    if (onValidate?.())
      router.push(`/checkout/${data?.unique_id}${getAsQueryString({
        ...guests,
        check_in: selectedRange.startDate?.format(DATE_FORMAT),
        check_out: selectedRange.endDate?.format(DATE_FORMAT)
      })
      }`)

  }, [data, guests, router, onValidate, selectedRange])

  const setPopover = useCallback((value: boolean) => () => {
    setIsOpen(value)
  }, [])

  useEffect(() => {
    onChange?.({
      guests,
      selectedRange
    })
  }, [guests, selectedRange, onChange])

  return (
    <div className={`sticky top-5 lg:top-[120px] ${props.className || ''}`}>
      <div className='border border-[rgb(221,221,221)] rounded-xl p-5 shadow-md w-full'>
        <div className='space-y-5 w-full'>
          {/* TOP SECTION */}
          <div className='flex justify-between items-center'>
            <div className='flex justify-start items-end gap-1'>
              <p className={`bg-[#FFF3EE] rounded-[35px] py-2 px-6  gap-2 text-[#F15927] space-x-1`}>
                <span className='text-base font-semibold leading-6'>৳{data?.price || 0}</span>
                <span className='text-sm font-semibold leading-6'>night</span>
              </p>
            
            </div>
            {/* <div>
              <button className='underline text-[#71716f] text-[14px] font-[600]'>1 review</button>
            </div> */}
          </div>
          {/* ALL DROPDOWN SECTION */}
          <div>
            <div className='border rounded-lg'>
              {/* DATE PICKER */}
              <DateRangeDropdown {...props} />

              {/* GUEST DROPDOWN */}
              <GuestDropDown maxGuests={data?.guest_count} guests={guests} setGuestsNumber={setGuestsNumber} />
            </div>
          </div>
          {/* CHECK AVAILAVILITY */}
          {error ? <p className='text-red-500 text-xs my-5'>{error}</p> : null}
          {/* <Button label='Reserve Now' onclick={handleSubmit} type='button' variant='regular' /> */}
          {/* NO CHARGING */}
          <div className={`${styles.flexCenter}`}>
            <p className='font-[400] text-[14px] text-[#202020]'>You won&apos;t be charged yet</p>
          </div>
          {/* TOTAL  */}
          {!!calculationData.bookingPrice && <div className='space-y-5'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='text-[#202020] text-base font-medium leading-7 relative cursor-pointer underline' onClick={setPopover(true)}>
                  ৳{data?.calendar_data?.[selectedRange?.startDate?.format(DATE_FORMAT) || '']?.price || '0'} x {calculationData.totalNights} nights
                  {isOpen && (
                    <PriceBreakdownPopover setOpen={setPopover} data={calculationData} />
                  )}
                </div>
                <p className='text-[#202020] text-base font-medium leading-7'>৳{calculationData.bookingPrice}</p>
              </div>
              <div className='flex items-center justify-between'>
                <p className='text-[#202020] text-base font-medium leading-7'>
                  Gateway fee
                </p>
                <p className='text-[#202020] text-base font-medium leading-7'>৳{calculationData.bookingCharge}</p>
              </div>
            </div>
            <div className='border-b'></div>
            <div className='flex items-center justify-between'>
              <p className='text-xl font-medium leading-7 text-[#202020] '>
                Total Cost
              </p>
              <p className='text-lg font-medium leading-7 text-[#202020]'>৳{calculationData.total_price}</p>
            </div>
          </div>}
          <Button label='Reserve' onclick={handleSubmit} type='button' variant='regular' className='!text-base !font-medium !leading-6 py-3'/>
        </div>
      </div>
    </div >
  )
}

export default BookingCard

