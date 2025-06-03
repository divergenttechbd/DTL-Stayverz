import { FC } from 'react'
import ReviewDetails from '~/app/profile/components/profileDashboard/profileInfoDetails/ReviewDetails'
import { IReview } from '~/app/review/types'

type ReviewListProps = {
  list: IReview[]
}

const ReviewList:FC<ReviewListProps> = ({list}) => {
  return (
    <div className='px-6'>
      {
        list.map(review => <ReviewDetails key={review.id} review={review} />)
      }
    </div>
  )
}

export default ReviewList
