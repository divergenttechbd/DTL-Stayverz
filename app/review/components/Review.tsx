import { CaretRight } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import truncate from 'lodash/truncate'
import Link from 'next/link'
import { FC, MouseEventHandler } from 'react'
import { IReview } from '~/app/review/types'
import { UserAvatar } from '~/components/layout/UserAvatar'

type ReviewProps = {
  review: IReview
  showFullReview?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined
  containerClassName?: string
}

const Review:FC<ReviewProps> = ({review, showFullReview = true, onClick, containerClassName}) => {
  return (
    <div className={` my-2 border w-full border-grayBorder rounded-xl px-6 py-4 ${containerClassName || ''}`}>
      <div>
        <Link href={`/rooms/${review?.listing?.unique_id}`} className='text-black text-base font-medium'>{review?.listing.title}</Link>
      </div>
      <div className='flex justify-start items-center gap-3'>
        <UserAvatar fullName={review.review_by?.full_name} image={review.review_by?.image} />
        <div>
          <h4 className='text-black text-base font-medium'>{review?.review_by.full_name}</h4>
          <p className='text-[#717171] text-xs'>{dayjs(review.created_at).format('MMM DD, YYYY')}</p>
        </div>
      </div>
      <div>
        <p className='text-black text-base'>
          {showFullReview ? review.review : truncate(review.review, {'length': 100})}
        </p>
      </div>
      {!showFullReview && <button className='text-black text-base font-bold flex justify-start items-center gap-1' onClick={onClick}>
        <span className='underline'>Show More</span>
        <CaretRight size={16} />
      </button>}
    </div>
  )
}

export default Review
