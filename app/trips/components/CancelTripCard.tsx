'use client'
import { Star } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import Image from 'next/image'
import { FC, useMemo } from 'react'
import { rangeFormatter } from '~/lib/utils/formatter/dateFormatter'

type CancelTripCardProps = {
  data: any
}

const CancelTripCard:FC<CancelTripCardProps> = (props) => {
  const {data} = props

  
  const calculationData = useMemo(() => {
    const refundable = data?.listing?.cancellation_policy?.policy_name === 'Moderate' ? dayjs(data?.check_in)?.diff(dayjs().startOf('day'), 'day') >= data?.listing?.cancellation_policy?.cancellation_deadline : true
    return {
      refund_amount: refundable ? (data?.total_price * (data?.listing?.cancellation_policy?.refund_percentage / 100) || 0) : 0
    }
  }, [data])
  
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
                  Dates
                </div>
                <p className='font-[400] text-[16px] text-[#202020]'>{rangeFormatter(dayjs(data?.check_in), dayjs(data?.check_out))}</p>
              </div>

              <div className='flex items-center justify-between pt-2'>
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
                <p className='font-[400] text-[16px] text-[#202020]'>
                  Original Total
                </p>
                <p className='font-[400] text-[16px] text-[#202020]'>৳{data?.total_price?.toFixed(2)}</p>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <p className='font-[400] text-[16px] text-[#202020] '>
                Paid to date
              </p>
              <p className='font-[400] text-[16px] text-[#202020]'>৳{(data?.paid_amount?.toFixed(2))}</p>
            </div>
            <div className='flex items-center justify-between'>
              <p className='font-semibold text-[16px] text-[#202020] '>
                Refund amount
              </p>
              <p className='font-semibold text-[16px] text-[#202020]'>৳{calculationData.refund_amount?.toFixed(2)}</p>
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

export default CancelTripCard

