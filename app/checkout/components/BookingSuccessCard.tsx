'use client'
import { Star } from '@phosphor-icons/react'
import Image from 'next/image'
import { FC, useCallback, useMemo } from 'react'
import PriceBreakdownPopover from '~/app/rooms/components/PriceBreakdownPopover'

type BookingSuccessCardProps = {
  data: any
  isOpen:boolean
  setIsOpen:Function
}

const BookingSuccessCard:FC<BookingSuccessCardProps> = (props) => {

  const {data, isOpen, setIsOpen} = props

  const calculationData = useMemo(() => {
    const dates = Object.keys(data?.price_info || {})?.sort()

    return {
      nights: dates?.length,
      price: data?.price_info?.[dates?.[0]]?.price
    }
  }, [data?.price_info])
  
  const setPopover = useCallback((value:boolean) => () => {
    setIsOpen(value)
  }, [setIsOpen])

  return (
    <div className='sticky top-36'>
      <div className='border border-[rgb(221,221,221)] rounded-xl p-5 shadow-md w-full'>
        <div className='space-y-5 w-full'>
          {/* TOP SECTION */}
          <div className='flex justify-between items-center'>
            <div className='flex justify-start items-end gap-2'>
              <Image className='h-[100px] w-[120px] rounded-lg' src={data?.listing?.cover_photo} alt={data?.listing?.title || 'cover'} width={100} height={100}/>
              <div className='flex flex-col h-[100px]'>
                <p className='text-[#202020] text-[16px] font-medium pb-1'>{data?.listing?.title}</p>
                <div className='flex items-center text-sm'><Star /> <span className='font-semibold'>{data?.listing?.avg_rating?.toFixed(2) || 0}</span> ({data?.listing?.total_rating_count || 0} reviews)</div>
              </div>
            </div>
          </div>

          <div className='space-y-5'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between pt-4 border-t'>
                <div className='font-[400] text-[16px] text-[#202020]'>
                  Reservation Code
                </div>
                <p className='font-[400] text-[16px] text-[#202020]'>{data?.reservation_code}</p>
              </div>
            </div>
          </div>

          <h3 className='text-[#202020] text-[22px] font-medium pt-3 border-t'>Price details</h3>

          {/* TOTAL  */}
          <div className='space-y-5'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='font-[400] text-[16px] text-[#202020] underline relative cursor-pointer' onClick={setPopover(true)}>
                  ৳{calculationData?.price || '0'} x {calculationData?.nights || 0} nights
                  {isOpen && (
                    <PriceBreakdownPopover setOpen={setPopover} data={data}/>
                  )}
                </div>
                <p className='font-[400] text-[16px] text-[#202020]'>৳{data?.price}</p>
              </div>
              <div className='flex items-center justify-between'>
                <p className='font-[400] text-[16px] text-[#202020]'>
                  Gateway fee
                </p>
                <p className='font-[400] text-[16px] text-[#202020]'>৳{data?.guest_service_charge}</p>
              </div>
            </div>
            <div className='border-b'></div>
            <div className='flex items-center justify-between'>
              <p className='font-semibold text-[16px] text-[#202020] '>
                Paid amount
              </p>
              <p className='font-semibold text-[16px] text-[#202020]'>৳{(data?.paid_amount)}</p>
            </div>
            <div className='border-b'></div>
            <div className=''>
              <p className='font-semibold text-[16px] text-[#202020] '>
                Cancellation Policy
              </p>
              <p className='font-[400] text-[16px] text-[#202020]'>{(data?.listing?.cancellation_policy?.description)}</p>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default BookingSuccessCard

