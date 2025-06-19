import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FC, useCallback, useMemo, useState } from 'react'
import ReservationDetails from '~/app/host-dashboard/reservations/components/ReservationDetails'
import ReservationMobile from '~/app/host-dashboard/reservations/components/ReservationMobile'
import { useReservationTableMeta } from '~/app/host-dashboard/reservations/hooks/meta/useReservationTableMeta'
import ReviewForm from '~/app/trips/components/ReviewForm'
import Modal from '~/components/modal/Modal'
import Table from '~/components/table/Table'
import useWindowSize from '~/hooks/useWindowSize'
import { getAsQueryString, getObjectFromSearchParams } from '~/lib/utils/url'
import { getReservationMetaData } from '~/queries/client/reservation'
import { createHostReview } from '~/queries/client/reviews'

interface IReservationTableProps {
  eventType: string
}
const ReservationTable:FC<IReservationTableProps> = ({ eventType }) => {

  const {isMobileView} = useWindowSize()
  // revservation modal details ---
  const [isModalOpen, setModalOpen] = useState(false)
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const reservationId = searchParams.get('invoice_id')

  const isReviewing = useMemo(() => searchParams.get('modal_type') === 'review', [searchParams])

  const queryClient = useQueryClient()
  const { mutateAsync:createReviewAsync, isLoading } = useMutation({ 
    mutationFn: createHostReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] })
    }
  })

  const handleOpenModal = useCallback((rowId: string, modalType: string) => {
    const currentParam = getObjectFromSearchParams(searchParams)
    router.replace(`${pathName}${getAsQueryString({...currentParam , invoice_id: rowId, modal_type: modalType})}`)
    setModalOpen(true)
  },[pathName, router, searchParams])

  const handleCloseModal = useCallback(() => {
    const updatedSearchParams = getObjectFromSearchParams(searchParams)
    delete updatedSearchParams.invoice_id
    router.push(`${pathName}${getAsQueryString({...updatedSearchParams})}`)
    setModalOpen(false)
  },[pathName, router, searchParams])

  const columns = useReservationTableMeta({ eventType: eventType, handleOpenModal: handleOpenModal })

  const fetchDataPayload = useMemo(() => (
    {params: {event_type: eventType}}
  ),[eventType])

  const handleReviewSubmit = useCallback(async (data: any) => {
    const payload = { id: reservationId, ...data }
    try {
      const mutation = await createReviewAsync({data: payload})
      if(!mutation.isSucceed) throw mutation
      handleCloseModal()
      return mutation 
    } catch (error) {
      return error
    }
  },[createReviewAsync, handleCloseModal, reservationId])


  return (
    <div>
      {isMobileView ? 
        <ReservationMobile
          eventType={eventType} 
          fetchData={getReservationMetaData}
          handleOpenModal={handleOpenModal}
          fetchDataPayload={fetchDataPayload}  
        /> :  
        <Table 
          key={eventType}
          columns={columns} 
          fetchData={getReservationMetaData}
          onRowClick={() => {}}
          fetchDataPayload={fetchDataPayload}  
          clickableRow={false}      
        />}
      <Modal 
        show={isModalOpen} 
        onClose={handleCloseModal}
        modalContainerclassName='slide-in-bottom w-full h-full sm:w-[550px] sm:max-h-[85%] sm:rounded-xl sm:overflow-hidden'
        crossBtnClassName='ml-4 mt-3'
        headerContainerClassName='pt-2 pb-2'
        header={<h2 className='text-[32px] font-semibold leading-9 pb-6 border-b border-grayBorder'>{ isReviewing ? 'Reservation Review' : 'Reservation Details'}</h2>}
        bodyContainerClassName='h-full overflow-auto pb-[60px] sm:pb-2 mb-5'
      >
        {
          isReviewing ? 
            <ReviewForm className='px-5' onSubmit={handleReviewSubmit} isLoading={isLoading} /> :
            reservationId && <div className='sm:pb-20'><ReservationDetails reservationId={reservationId}/></div>
        }
      </Modal>
    </div>
  )
}

export default ReservationTable

