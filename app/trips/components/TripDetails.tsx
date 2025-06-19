'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import BookingSuccessCard from '~/app/checkout/components/BookingSuccessCard'
import Review from '~/app/review/components/Review'
import { IReview } from '~/app/review/types'
import ReviewForm from '~/app/trips/components/ReviewForm'
import useTripDetailsMeta from '~/app/trips/hooks/meta/useTripDetailsMeta'
import Modal from '~/components/modal/Modal'
import { useModal } from '~/components/modal/hooks/useModal'
import { getBooking } from '~/queries/client/bookings'
import { createGuestReview } from '~/queries/client/reviews'

const TripDetails = ({ params }: { params: { invoice_no: string } })  => {
  const { data } = useQuery({ queryKey: ['tripDetails', params.invoice_no], queryFn: () => getBooking({ params: { invoice_no: params.invoice_no, is_review: true } }) })
  const tableData = useTripDetailsMeta(data?.data?.booking_data)
  const [currentReview, setCurrentReview] = useState<IReview>()
  const [isOpen, setIsOpen] = useState(false)

  const isPastTrip = useMemo(() => dayjs(data?.data?.booking_data?.check_out).isBefore(dayjs().startOf('day')), [data])
  const isUpcomingTrip = useMemo(() => dayjs(data?.data?.booking_data?.check_in).isAfter(dayjs().endOf('day')), [data])

  const [isModalOpen, openModal, closeModal] = useModal()

  const queryClient = useQueryClient()
  const { mutateAsync:createReviewAsync, isLoading } = useMutation({ 
    mutationFn: createGuestReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tripDetails'] })
    }
  })

  const handleReviewSubmit = useCallback(async (data: any) => {
    const payload = { id: params.invoice_no, ...data }
    try {
      const mutation = await createReviewAsync({data: payload})
      if(!mutation.isSucceed) throw mutation
      closeModal()
      return mutation 
    } catch (error) {
      return error
    }
  },[params, createReviewAsync, closeModal])

  const handleModalOpen = useCallback((review: IReview | undefined) => () => {
    setCurrentReview(review)
    openModal()
  }, [openModal])

  return (
    <>
      <Modal
        show={isModalOpen}
        onClose={closeModal}
        modalContainerclassName='w-full sm:w-[45rem] rounded-xl pt-3'
        titleContainerClassName='items-center justify-center gap-5 p-4'
        crossBtnClassName='absolute left-4 top-1/2 -translate-y-1/2'
        bodyContainerClassName='p-6'
        closeOnOutsideClick={true}
      >
        {currentReview ? <Review review={currentReview}/> : <ReviewForm onSubmit={handleReviewSubmit} isLoading={isLoading} />}
      </Modal>
      <div className='container mx-auto flex flex-col md:flex-row gap-5 md:gap-10'>
        <div className='flex-[1] '>
          <div className='flex items-center'>
            <h1 className='text-3xl font-semibold text-[#202020] my-10'>Trip Details 
              {isPastTrip && !data?.data?.booking_data.guest_review_done && 
              <span 
                className='text-sm ms-2 underline font-semibold cursor-pointer' 
                onClick={handleModalOpen(undefined)}> Rate this Trip
              </span>}
              {isPastTrip && data?.data?.booking_data.guest_review_done && 
              <span 
                className='text-sm underline ms-2 font-semibold cursor-pointer' 
                onClick={handleModalOpen({
                  listing: data.data.booking_data.listing,
                  review: data.data.review_data.review,
                  rating: data.data.review_data.rating,
                  review_by: {
                    full_name: data.data.review_data.full_name,
                    image: data.data.review_data.image,
                  },
                  created_at: data.data.review_data.created_at,
                })}>Show Review
              </span>}
              {isUpcomingTrip && data?.data?.booking_data?.status !== 'cancelled' && <Link 
                className='text-sm underline text-red-600 font-semibold ms-2 cursor-pointer' 
                href={`/trips/cancel/${params.invoice_no}`}> Cancel this Trip
              </Link>}
            </h1>
          </div>
          
          <div className='relative overflow-x-auto'>
            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
              <tbody>
                {tableData?.map((item:any, index:number) => <tr key={item.label} className={`bg-white ${index !== tableData.length -1 ? 'border-b' : ''}`}>
                  <th scope='row' className='pr-5 sm:pr-3 py-4 font-medium text-[#202020] whitespace-nowrap'>
                    {item.label}
                  </th>
                  <td className='pr-5 sm:pr-3 py-4 text-[#202020]'>
                    {item.value}
                  </td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </div>
        <div className={`flex-[0.6] ${!isOpen ? 'pb-[100px]' : 'pb-[250px]'} md:pb-0 md:mt-10 relative`}>
          <BookingSuccessCard data={data?.data?.booking_data} isOpen={isOpen} setIsOpen={setIsOpen}/>
        </div>
      </div>
    </>
  )
}

export default TripDetails
