'use client'
import { Star } from '@phosphor-icons/react'
import Image from 'next/image'
import { FC, useCallback, useMemo, useState } from 'react'
import PriceBreakdownPopover from '~/app/rooms/components/PriceBreakdownPopover'
import { DATE_FORMAT } from '~/constants/format'
import { DateRange } from '~/hooks/calendar/useCalendar'

type BookingCardProps = {
  data: any
  selectedRange: DateRange | undefined
}

const BookingCard:FC<BookingCardProps> = (props) => {

  const [isOpen, setIsOpen] = useState(false)
  const {selectedRange, data} = props

  const calculationData = useMemo (() => {
    if(!(selectedRange?.startDate && selectedRange.endDate))
      return {}

    const datesArray = [...Array(selectedRange.endDate.diff(selectedRange?.startDate, 'day'))]
      .map((_, index) => (selectedRange.startDate?.add(index, 'day').format(DATE_FORMAT)))
    const price = datesArray.map(date => data?.calendar_data?.[date || '']?.price || 0).reduce((acc, n) => acc + n, 0)
    const price_info:Record<string, any> = {}

    datesArray.forEach(date => {
      if(date) price_info[date] = data?.calendar_data?.[date]
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

  const setPopover = useCallback((value:boolean) => () => {
    setIsOpen(value)
  }, [])

  return (
    <div className='sticky top-36'>
      <div className='border border-[rgb(221,221,221)] rounded-xl p-5 shadow-md w-full'>
        <div className='space-y-5 w-full'>
          {/* TOP SECTION */}
          <div className='flex justify-between items-center'>
            <div className='flex justify-start items-end gap-2'>
              <Image className='h-[100px] w-[120px] rounded-lg' src={data?.cover_photo} alt={data?.title} width={100} height={100}/>
              <div className='flex flex-col h-[100px]'>
                <p className='text-[#202020] text-[16px] font-medium pb-1'>{data?.title}</p>
                <div className='flex items-center text-sm'><Star /> <span className='font-semibold'>{data?.avg_rating || 0}</span> ({data?.total_rating_count || 0} reviews)</div>
              </div>
            </div>
          </div>

          <h3 className='text-[#202020] text-[22px] font-medium pt-3 border-t'>Price details</h3>

          {/* TOTAL  */}
          <div className='space-y-5'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='font-[400] text-[16px] text-[#202020] underline relative cursor-pointer' onClick={setPopover(true)}>
                  ৳{data?.calendar_data?.[selectedRange?.startDate?.format(DATE_FORMAT) || '']?.price || '0'} x {calculationData.totalNights} nights
                  {isOpen && (
                    <PriceBreakdownPopover setOpen={setPopover} data={calculationData}/>
                  )}
                </div>
                <p className='font-[400] text-[16px] text-[#202020]'>৳{calculationData.bookingPrice}</p>

                
              </div>
              <div className='flex items-center justify-between'>
                <p className='font-[400] text-[16px] text-[#202020]'>
                  Gateway fee
                </p>
                <p className='font-[400] text-[16px] text-[#202020]'>৳{calculationData.bookingCharge}</p>
              </div>
            </div>
            <div className='border-b'></div>
            <div className='flex items-center justify-between'>
              <p className='font-semibold text-[16px] text-[#202020] '>
                Total amount
              </p>
              <p className='font-semibold text-[16px] text-[#202020]'>৳{(calculationData.total_price)}</p>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default BookingCard
