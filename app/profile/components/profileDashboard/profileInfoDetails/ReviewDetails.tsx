import { Dot } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import Image from 'next/image'
import { FC } from 'react'
import { IReview } from '~/app/review/types'
import RatingStar from '~/components/layout/RatingStar'
import { UserAvatar } from '~/components/layout/UserAvatar'

interface IReviewDetailsProps  {
  review: IReview
}
const ReviewDetails:FC<IReviewDetailsProps> = ({ review }) => {

  return (
    <div className='border-y border-grayBorder py-6 flex flex-col gap-4'>
      <div className='flex justify-between'>
        <h4 className='text-lg font-medium'>{review?.listing.title}</h4>
        <Image
          className={`rounded-t-lg w-[70px] h-[50px] object-cover`}
          src={review?.listing?.cover_photo  || ''}
          alt={review?.listing?.title}
          height={100}
          width={100}
        />
      </div>
      <div className='flex gap-4 items-center'>
        <UserAvatar fullName={review.review_by?.full_name} image={review.review_by?.image} />
        <div>
          <h4 className='text-black text-base font-medium'>{review?.review_by.full_name}</h4>
          <div className='flex gap-2 items-center'>
            <RatingStar rating={review?.rating}/>
            <span><Dot size={10} weight='fill' /></span>
            <p className='text-grayText text-sm'>{dayjs(review.created_at).format('MMM DD, YYYY')}</p>
          </div>
        </div>
      </div>
      <p className='text-black text-base'>
        {review.review}
      </p>
    </div>
  )
}

export default ReviewDetails
