'use client'
import { Dot, Star } from '@phosphor-icons/react'
import { FC } from 'react'
import { IReview } from '~/app/review/types'
import CustomerReview from '~/app/rooms/components/CustomerReview'

type RoomReviewProps = {
  data: any
  isLoading: boolean
}

const RoomReview:FC<RoomReviewProps> = ({data, isLoading}) => {
  return (
    <div className='px-5 xl:px-0 xl:container'>
      <div className={`pt-5`}>
        <div className='flex flex-col justify-start items-start gap-5'>
          <div className='space-y-5 lg:space-y-10'>
            {/* HEADER */}
            <div className='flex justify-start items-center gap-1'>
              <span className=''>
                <Star weight='fill' size={16} />
              </span>
              <h2 className='text-[22px] text-[#202020] font-medium'>
                {(data?.avg_rating).toFixed(2)}
              </h2>
              <span><Dot size={10} weight='fill' /></span>
              <h2 className='text-[22px] text-[#202020] font-medium'>
                {data?.total_rating_count} reviews
              </h2>
            </div>
            {/* CUSTOMER REVIEWS */}
            <div className='grid md:grid-cols-2 gap-y-10 gap-x-20'>
              {/* REVIEW ONE */}
              {data?.reviews?.slice(0, 10)?.map((review:IReview) => (
                <CustomerReview key={review.id} review={review} />
              ))}

            </div>
            {/* SHOW ALL REVIEW BTN */}
            {data?.total_rating_count > 10 && <div>
              <button className='mt-3 text-[#202020] text-[14px] font-medium px-6 py-3 border border-[#202020] rounded-lg'>
                Show all {data?.total_rating_count} reviews
              </button>
            </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomReview
