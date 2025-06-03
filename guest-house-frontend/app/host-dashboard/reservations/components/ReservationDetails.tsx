import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FC, useMemo } from 'react'
import BookingDetails from '~/app/host-dashboard/reservations/components/reservationDetails/BookingDetails'
import CancellationPolicy from '~/app/host-dashboard/reservations/components/reservationDetails/CancellationPolicy'
import Payout from '~/app/host-dashboard/reservations/components/reservationDetails/Payout'
import ReservationSummary from '~/app/host-dashboard/reservations/components/reservationDetails/ReservationSummary'
import UserDetails from '~/app/host-dashboard/reservations/components/reservationDetails/UserDetails'
import { IGuest, IReservationDetails } from '~/app/host-dashboard/reservations/types'
import Loader from '~/components/loader/Loader'
import { getSingleReservationMetaData } from '~/queries/client/reservation'
import { useAuthStore } from '~/store/authStore'

interface IReservationDetailsProps {
  reservationId: string
}

const ReservationDetails:FC<IReservationDetailsProps> = ({
  reservationId
}) => {
  const { userData } = useAuthStore()
  const { u_type: userType } = userData || {}
  const {data:reservationDetails, isLoading} = useQuery({
    queryKey: ['reservationDetails', reservationId, userType],
    queryFn: () => getSingleReservationMetaData({params: {reservationId, userType}})
  })

  const {
    guest,
    host,
    listing,
    calendar_info,
    price_info,
    check_in,
    check_out,
    chat_room_id,
    created_at,
    night_count,
    adult_count,
    children_count,
    infant_count,
    guest_service_charge,
    price,
    host_service_charge,
    paid_amount,
    host_pay_out,
    reservation_code,
    total_price
  }: IReservationDetails = reservationDetails?.data || {}
  const user = (userType === 'guest' ? host : guest) as IGuest
  const userLastName = useMemo(() => {
    const nameArr = user?.full_name.split(' ')
    return nameArr && nameArr[nameArr?.length-1]
  },[user?.full_name])


  const userFirstName = useMemo(() => {
    const nameArr = user?.full_name.split(' ')
    return nameArr && nameArr[0]
  },[user?.full_name])

  const formattedDates = useMemo(() => {
    const checkIn = dayjs(check_in).format('MMM D')
    const checkOut = dayjs(check_out).format('MMM D')    

    const checkInWithYear = dayjs(check_in).format('MMM D, YYYY')
    const checkOutWithYear = dayjs(check_out).format('MMM D, YYYY')
    const bookingWithYear = dayjs(created_at).format('MMM D, YYYY')

    const userJoiningDate = dayjs(user?.date_joined).format('YYYY')
    return {checkIn, checkOut, checkInWithYear, checkOutWithYear, bookingWithYear, userJoiningDate}
  },[check_in, check_out, created_at, user?.date_joined])

  return(
    <>
      { isLoading ? 
        <div className='w-full h-[50vh] flex justify-center items-center'><Loader/></div> : reservationDetails?.data && user ? (
          <div>
            <ReservationSummary 
              user={user}
              listing={listing}
              checkIn={formattedDates.checkIn}
              checkOut={formattedDates.checkOut}
              night_count={night_count}
              adult_count={adult_count + children_count + infant_count}
              handleOrder={null}
              host_pay_out={total_price}
            />

            <UserDetails
              userFirstName={userFirstName}
              user={user}
              userJoiningDate={formattedDates.userJoiningDate}
              chatId={chat_room_id}
            />

            <BookingDetails
              adult_count={adult_count}
              children_count={children_count}
              infant_count={infant_count}
              checkInWithYear={formattedDates.checkInWithYear}
              checkOutWithYear={formattedDates.checkOutWithYear}
              bookingWithYear={formattedDates.bookingWithYear}
              reservation_code={reservation_code}
            />

            {calendar_info ?
              <>
                <Payout
                  calendar_info={calendar_info}
                  night_count={night_count}
                  price={price}
                  price_info={price_info}
                  service_charge={guest_service_charge}
                  payout={paid_amount}
                  userType='Guest'
                />
                
                <Payout
                  calendar_info={calendar_info}
                  night_count={night_count}
                  price={price}
                  price_info={price_info}
                  service_charge={host_service_charge}
                  payout={host_pay_out}
                  userType='Host'
                />
              </>
              : null}
            <CancellationPolicy listing={listing}/>
          </div>)
          : null}
    </>
  )
}

export default ReservationDetails
