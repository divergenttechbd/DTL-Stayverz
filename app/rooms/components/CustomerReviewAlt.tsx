import { CaretRight } from '@phosphor-icons/react'
import { Star } from '@phosphor-icons/react/dist/ssr/Star'
import dayjs from 'dayjs'
import truncate from 'lodash/truncate'
import { FC, useCallback, useState } from 'react'
import { IReview } from '~/app/review/types'
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
    <div className='space-y-5 w-full'>
      <div className='flex justify-start items-center gap-3'>
        <div className='hidden'>
          <UserAvatar fullName={review.review_by?.full_name} image={review.review_by?.image} />
        </div>
        <div>
          <h4 className='text-[#202020] text-base font-semibold leading-6'>Superb Work!</h4>
          <p className='text-[#717171] text-[14px] font-[400] hidden'>{dayjs(review.created_at).format('MMM DD, YYYY')}</p>
        </div>
      </div>
      <div className='space-y-1'>
        <p className='text-[#9C9C9C] text-base font-normal leading-6'>
          <span className='pr-1'> {showFullReview ? review.review : truncate(review.review, {'length': 100})}</span>
          {!showFullReview && 
          <button className='text-[#616161] leading-6  inline-flex justify-start items-center gap-1' onClick={handleToggle}>
            <span className=''>Read more</span>
            <CaretRight size={16} className='hidden'/>
          </button>}
        </p>
        
      </div>
      <div className='space-y-5 pt-3'>
        <div className='flex justify-start items-center gap-2'>
          {Array.from({length:5}).map((el, index) => <Star key={index} size={24} weight='fill' color='#FFA82B' />)}
        </div>
        <h4 className='text-[#202020] text-sm font-semibold leading-4'>{review?.review_by.full_name}</h4>
      </div>
    </div>
  )
}

export default CustomerReview
