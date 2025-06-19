import { CheckSquareOffset } from '@phosphor-icons/react/dist/ssr/CheckSquareOffset'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FC, useCallback, useMemo, useState } from 'react'
import { IReservationData, IReservationStatInfo } from '~/app/host-dashboard/components/types'
import ReservationDetails from '~/app/host-dashboard/reservations/components/ReservationDetails'
import ReviewForm from '~/app/trips/components/ReviewForm'
import ReservationCard from '~/components/card/ReservationCard'
import Carousel from '~/components/carousel/Carousel'
import Modal from '~/components/modal/Modal'
import useWindowSize, { BreakpointsType } from '~/hooks/useWindowSize'
import { getAsQueryString, getObjectFromSearchParams } from '~/lib/utils/url'
import { createHostReview } from '~/queries/client/reviews'

const ReservationCardCarousel = Carousel<IReservationData>
interface IReservationContentProps {
  eventType: string
  reservationContents: IReservationData[]
  reservationStatInfo: IReservationStatInfo
  refetch: Function
}

const BREAKPOINT_PAGINATION: Record<BreakpointsType, number> = {
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  '2xl': 4,
}


const ReservationContent: FC<IReservationContentProps> = ({ eventType, reservationContents, reservationStatInfo ,  refetch}) => {
  const { breakpoint, isMobileView } = useWindowSize()
  const slidesCountPerView = BREAKPOINT_PAGINATION[breakpoint as keyof typeof BREAKPOINT_PAGINATION]
  const { label: label, count: count } = useMemo(() => {
    let label = ''
    let count = 0

    switch (eventType) {
    case 'pending_review':
      label = (reservationStatInfo?.pending_review.label || 'Default Label').split('(')[0]
      count = reservationStatInfo?.pending_review.count || 0
      break
    case 'arriving_soon':
      label = (reservationStatInfo?.arriving_soon.label || 'Default Label').split('(')[0]
      count = reservationStatInfo?.arriving_soon.count || 0
      break
    case 'checking_out':
      label = (reservationStatInfo?.checking_out.label || 'Default Label').split('(')[0]
      count = reservationStatInfo?.checking_out.count || 0
      break
    case 'upcoming':
      label = (reservationStatInfo?.upcoming.label || 'Default Label').split('(')[0]
      count = reservationStatInfo?.upcoming.count || 0
      break
    case 'currently_hosting':
      label = (reservationStatInfo?.currently_hosting.label || 'Default Label').split('(')[0]
      count = reservationStatInfo?.currently_hosting.count || 0
      break
    default:
      break
    }

    return { label, count }
  }, [eventType, reservationStatInfo])

  // reservation details
  // use a custom hook instead
  const [isModalOpen, setModalOpen] = useState(false)
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const reservationId = searchParams.get('invoice_id')

  const handleOpenModal = useCallback((invoiceId: string, eventType: string) => {
    const currentParam = getObjectFromSearchParams(searchParams)
    router.replace(`${pathName}${getAsQueryString({ ...currentParam, invoice_id: invoiceId, event_type: eventType })}`)
    setModalOpen(true)
  }, [pathName, router, searchParams])

  const handleCloseModal = useCallback(() => {
    const updatedSearchParams = getObjectFromSearchParams(searchParams)
    delete updatedSearchParams.invoice_id
    delete updatedSearchParams.event_type
    router.push(`${pathName}${getAsQueryString({ ...updatedSearchParams })}`)
    setModalOpen(false)
  }, [pathName, router, searchParams])


  const [reviewModalOpen, setReviewModalOpen] = useState(false)

  const handleReviewModalOpen = useCallback((invoiceId: string, modalType: string) => {
    const currentParam = getObjectFromSearchParams(searchParams)
    router.replace(`${pathName}${getAsQueryString({...currentParam , invoice_id: invoiceId, modal_type: modalType})}`)
    setModalOpen(true)
    setReviewModalOpen(true)
  },[pathName, router, searchParams])

  const handleReviewModalClose = useCallback(() => {
    const updatedSearchParams = getObjectFromSearchParams(searchParams)
    delete updatedSearchParams.invoice_id
    router.push(`${pathName}${getAsQueryString({...updatedSearchParams})}`)
    setModalOpen(false)
    setReviewModalOpen(false)
  },[pathName, router, searchParams])


  const queryClient = useQueryClient()
  const { mutateAsync:createReviewAsync, isLoading } = useMutation({ 
    mutationFn: createHostReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] })
    }
  })

  const handleReviewSubmit = useCallback(async (data: any) => {
    const payload = { id: reservationId, ...data }
    try {
      const mutation = await createReviewAsync({data: payload})
      if(!mutation.isSucceed) throw mutation
      handleReviewModalClose()
      refetch()
      return mutation 
    } catch (error) {
      return error
    }
  },[createReviewAsync, handleReviewModalClose, refetch, reservationId])


  const renderReservationSlide = useCallback((content: IReservationData) => {
    return (
      <ReservationCard
        key={content.id}
        eventType={label}
        className={'mx-auto !w-full sm:!w-[300px]'}
        guestImage={content?.guest_image}
        guestName={content?.guest_name}
        checkIn={content?.check_in}
        checkOut={content?.check_out}
        listingName={content?.listing_title}
        chatId={content?.chat_room_id}
        onClickHandler={ () => handleOpenModal(content?.invoice_no, eventType)}
        reviewOnClick={() =>  handleReviewModalOpen(content?.invoice_no, 'review')}
      />
    )
  }, [eventType, handleOpenModal, handleReviewModalOpen, label])


  const navigationClassName = useMemo(() => {
    if ((isMobileView && count > 1) ||  count > 4) {
      return `${isMobileView ? '!top-[240px] w-[max-content]' : '!-top-16'}`
    } else {
      return 'hidden'
    }
  }, [count,isMobileView])

  const leftNavigationClassName = useMemo(() => {
    if ((isMobileView && count > 1) || count > 4) {
      return `${isMobileView ? '!left-0  !ml-auto' : ''}`
    } else {
      return 'hidden'
    }
  }, [count, isMobileView])


  const rightNavigationClassName = useMemo(() => {
    if ((isMobileView && count > 1) || count > 4) {
      return `${isMobileView ? '!left-[15%] !ml-auto' : ''}`
    } else {
      return 'hidden'
    }
  }, [count, isMobileView])

  return (
    <>
      {
        count === 0 ? (
          <div className='p-4 rounded-xl bg-grayBg text-black h-52 flex justify-center'>
            <div className='max-w-[200px] flex flex-col justify-center items-center gap-6'>
              <CheckSquareOffset size={32} />
              <p className='text-sm text-center'>
                No Reservations to show.
              </p>
            </div>
          </div>
        ) : (
          <div className='relative overflow-y-visible'>
            <ReservationCardCarousel
              leftNavigationClassName={leftNavigationClassName}
              rightNavigationClassName={rightNavigationClassName}
              carouselItems={reservationContents}
              slidesCountPerView={slidesCountPerView}
              slidesGap={20}
              renderItem={renderReservationSlide}
              navigationClassName={navigationClassName}
            />


            <Modal
              show={isModalOpen}
              onClose={() => eventType === 'pending_review' ? handleReviewModalClose() :  handleCloseModal()}
              modalContainerclassName='slide-in-bottom w-full h-full sm:w-[550px] sm:max-h-[85%] sm:rounded-xl sm:overflow-hidden'
              crossBtnClassName='ml-4 mt-3'
              headerContainerClassName='pt-2 pb-2'
              header={<h2 className='text-[32px] font-semibold leading-9 pb-6 border-b border-grayBorder'>Reservation Details</h2>}
              bodyContainerClassName='h-full overflow-auto pb-2 mb-5'
            >
              {
                reservationId &&  (reviewModalOpen ?  <ReviewForm className='px-5' onSubmit={handleReviewSubmit} isLoading={isLoading} /> : <div className='pb-[50px] sm:pb-20'> <ReservationDetails reservationId={reservationId} /></div>)
              }
            </Modal>
          </div>
        )
      }
    </>
  )
}

export default ReservationContent
