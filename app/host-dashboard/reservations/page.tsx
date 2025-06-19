import Reservation from '~/app/host-dashboard/reservations/components/Reservation'

export default function ReservationPage() {
  return(
    <div className='flex min-h-[90vh] flex-col justify-between w-full'>
      <Reservation />
    </div>
  )
}
