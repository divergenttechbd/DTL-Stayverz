import { CheckSquareOffset } from '@phosphor-icons/react/dist/ssr/CheckSquareOffset'
import { FC, useCallback, useState } from 'react'
import EarningItem from '~/app/host-dashboard/earnings/components/EarningItem'
import ReservationDetails from '~/app/host-dashboard/reservations/components/ReservationDetails'
import Modal from '~/components/modal/Modal'

interface IReservationTableProps {
  earnings: IEarning[] | undefined
}
const EarningList:FC<IReservationTableProps> = ({ earnings }) => {
  const [selectedReservation, setSelectedReservation] = useState<string | undefined>()
  const handleCloseModal = useCallback(() => {
    setSelectedReservation(undefined)
  }, [])

  const handleReservationClick = useCallback((reservation: string) => () => {
    setSelectedReservation(reservation)
  } , [])

  return (
    <div>
      {(earnings && earnings.length > 0) ?  
        <div className='border rounded-md mt-2 mb-2'>
          {
            earnings?.map(earning => <EarningItem key={earning.id} earning={earning} onReservationClick={handleReservationClick} />)
          }
          <Modal
            show={!!selectedReservation} 
            onClose={handleCloseModal}
            modalContainerclassName='slide-in-bottom w-full sm:w-[650px] h-full sm:max-h-[83%] sm:rounded-xl sm:overflow-hidden pb-15'
            crossBtnClassName='ml-4 mt-3'
            headerContainerClassName='pt-2 pb-2'
            header={<h2 className='text-[32px] font-semibold leading-9 pb-6 border-b border-grayBorder'>Reservation Details</h2>}
            bodyContainerClassName='h-full overflow-auto pb-[70px] sm:pb-2 mb-5'
          >
            {selectedReservation && <div className='sm:pb-20'><ReservationDetails reservationId={selectedReservation}/></div>}
          </Modal>
        </div>:   
        <div className='p-4 rounded-xl bg-grayBg text-black h-52 flex justify-center'>
          <div className='max-w-[200px] flex flex-col justify-center items-center gap-6'>
            <CheckSquareOffset size={32} />
            <p className='text-sm text-center'>
                You have no earnings.
            </p>
          </div>
        </div>}
  
    </div>
  )
}

export default EarningList
