import { useQuery } from '@tanstack/react-query'
import { FC, useCallback, useEffect, useState } from 'react'
import ReviewDetails from '~/app/profile/components/profileDashboard/profileInfoDetails/ReviewDetails'
import ReviewList from '~/app/review/components/ReviewList'
import { IReview } from '~/app/review/types'
import ReviewCard from '~/components/card/ReviewCard'
import Carousel from '~/components/carousel/Carousel'
import Modal from '~/components/modal/Modal'
import { useModal } from '~/components/modal/hooks/useModal'
import useWindowSize from '~/hooks/useWindowSize'
import { getReviewsByMe, getReviewsFor } from '~/queries/client/reviews'

const ReviewCarousel = Carousel<IReview>
interface IProfileReviewsProps {
  latestReviews: IReview[] | undefined
  firstName: string | undefined
  params: {id: string | number}
}
const ProfileReviews: FC<IProfileReviewsProps> = ({ latestReviews, firstName, params }) => {
  const { isMobileView } = useWindowSize()
  const [isModalOpen, handleModalOpen, handleModalClose] = useModal()
  const [showableReviewContent, setShowableReviewContent] = useState<undefined | IReview[] | IReview>()

  const { data:reviewsForMe, isFetching } = useQuery({
    queryKey: ['reviewsForMe', params],
    queryFn: () => getReviewsFor({params: params}),
    refetchOnWindowFocus: false
  })
  const { data: reviewsByMe } = useQuery({
    queryKey: ['reviewsByMe'],
    queryFn: getReviewsByMe,
    refetchOnWindowFocus: false
  })
  const handleShowReview = useCallback((content: IReview[] | IReview | undefined) => () => {
    setShowableReviewContent(content)
  }, [])
  useEffect(() => {
    if (showableReviewContent) handleModalOpen()
    else handleModalClose()
  }, [handleModalClose, handleModalOpen, showableReviewContent])


  const renderReviewSlide = useCallback((review: IReview) => {
    return (
      <ReviewCard
        review={review}
        key={review.id}
      />
    )
  }, [])
  return (
    <>
      <div className='mb-5 relative'>
        <h3 className='text-2xl font-semibold mb-8'>{firstName}&apos;s reviews</h3>
        <div className='flex flex-col gap-2'>
          <ReviewCarousel
            carouselItems={latestReviews}
            slidesCountPerView={isMobileView ? 1 : 2}
            slidesGap={20}
            renderItem={renderReviewSlide}
          />
        </div>
      </div>

      {!!latestReviews?.length && <button
        className='text-black border border-black px-4 pb-2 mt-3 pt-2 leading-6 rounded-lg text-base hover:bg-gray-50 block'
        onClick={handleShowReview(reviewsForMe?.data)}
      >
        Show all Reviews
      </button>}

      <hr className='mt-8 mb-6 w-full border-t border-grayBorder' />

      <button
        className='text-black underline font-semibold pb-2 mt-3 pt-2 rounded-lg text-base hover:bg-gray-50 mb-5'
        onClick={handleShowReview(reviewsByMe?.data)}
      >
        Reviews you&apos;ve written
      </button>

      <hr className='mt-4 mb-8 w-full border-t border-grayBorder' />

      <Modal
        show={isModalOpen}
        onClose={handleShowReview(undefined)}
        modalContainerclassName='w-[550px] max-h-[85%] rounded-xl'
        crossBtnClassName='ml-4 mt-3'
        headerContainerClassName='pt-2 pb-2'
        header={<h2 className='text-xl font-semibold leading-9'>Reviews</h2>}
        bodyContainerClassName='h-full overflow-auto pb-2 mb-5'
      >
        {showableReviewContent ?
          !Array.isArray(showableReviewContent) ?
            <ReviewDetails review={showableReviewContent as IReview} /> :
            <ReviewList list={showableReviewContent as IReview[]} />
          : null}
      </Modal>
    </>
  )
}

export default ProfileReviews
