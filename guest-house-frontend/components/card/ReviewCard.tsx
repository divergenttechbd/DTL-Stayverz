import { Dot } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import truncate from 'lodash/truncate'
import { FC } from 'react'
import { IReview } from '~/app/review/types'
import RatingStar from '~/components/layout/RatingStar'
import { UserAvatar } from '~/components/layout/UserAvatar'

type ReviewProps = {
  review: IReview
}

const ReviewCard:FC<ReviewProps> = ({ review }) => {
  return (
    <div className='my-2 border w-full border-grayBorder rounded-xl p-5 h-[220px] flex flex-col justify-between'>
      <p className='text-black text-base'>
        {`“...${truncate(review.review, {'length': 100})}...`}
      </p>
      <div className='flex justify-start items-center gap-3'>
        <UserAvatar fullName={review.review_by?.full_name} image={review.review_by?.image} />
        <div>
          <h4 className='text-black text-base font-medium'>{review?.review_by.full_name}</h4>
          <div className='flex gap-2 items-center'>
            <RatingStar rating={review?.rating}/>
            <span><Dot size={10} weight='fill' /></span>
            <p className='text-[#717171] text-xs'>{dayjs(review.created_at).format('MMM DD, YYYY')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard
