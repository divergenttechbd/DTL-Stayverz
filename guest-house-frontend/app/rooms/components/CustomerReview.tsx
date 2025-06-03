import { CaretRight, Dot } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import truncate from 'lodash/truncate'
import { FC, useCallback, useState } from 'react'
import { IReview } from '~/app/review/types'
import RatingStar from '~/components/layout/RatingStar'
import { UserAvatar } from '~/components/layout/UserAvatar'

type CustomerReviewProps = {
  review: IReview;
}

const CustomerReview:FC<CustomerReviewProps> = ({review}) => {
  const [showFullReview, setShowFullReview] = useState(review.review.length < 100)
  const handleToggle = useCallback(() => {
    setShowFullReview(prev => !prev)
  }, []) 
  return (
    <div className='space-y-2'>
      <div className='flex justify-start items-center gap-3'>
        <UserAvatar fullName={review.review_by?.full_name} image={review.review_by?.image} />
        <div>
          <h4 className='text-[#202020] text-[16px] font-medium'>{review?.review_by.full_name}</h4>
          <div className='flex gap-2 items-center'>
            <RatingStar rating={review?.rating}/>
            <span><Dot size={10} weight='fill' /></span>
            <p className='text-[#717171] text-[14px] font-base'>{dayjs(review.created_at).format('MMM DD, YYYY')}</p>
          </div>
        </div>
      </div>
      <div>
        <p className='text-[#202020] text-[16px]  font-base'>
          {showFullReview ? review.review : truncate(review.review, {'length': 100})}
        </p>
      </div>
      {!showFullReview && <button className='text-sm font-medium leading-5 md:text-base md:font-medium md:leading-6  flex justify-start items-center gap-1' onClick={handleToggle}>
        <span className='underline'>Show More</span>
        <CaretRight size={16}/>
      </button>}
    </div>
  )
}

export default CustomerReview
