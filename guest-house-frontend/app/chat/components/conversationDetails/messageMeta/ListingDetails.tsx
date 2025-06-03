import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useMemo } from 'react'
import { useListingDetails } from '~/app/chat/hooks/useListingDetails'
import BookingDetails from '~/app/host-dashboard/reservations/components/reservationDetails/BookingDetails'
import CancellationPolicy from '~/app/host-dashboard/reservations/components/reservationDetails/CancellationPolicy'
import Payout from '~/app/host-dashboard/reservations/components/reservationDetails/Payout'
import ReservationSummary from '~/app/host-dashboard/reservations/components/reservationDetails/ReservationSummary'
import UserDetails from '~/app/host-dashboard/reservations/components/reservationDetails/UserDetails'
import Loader from '~/components/loader/Loader'
import { getAsQueryString } from '~/lib/utils/url'
import { useAuthStore } from '~/store/authStore'

interface IListingDetailsProps {
  listingId: string
  bookingData: any
  userId: string
}

const ListingDetails:FC<IListingDetailsProps> = ({
  listingId,
  bookingData,
  userId,
}) => {
  const { userData } = useAuthStore()
  const {data, isLoading} = useListingDetails({listingId, userId})

  const reservationDetails = useMemo(() => ({
    ...data,
    ...bookingData.booking_date,
    ...bookingData.checkout_data,
  }), [data, bookingData])

  const {
    calendar_info,
    price_info,
    check_in,
    check_out,
    created_at,
    nights,
    total_guest_count,
    adult,
    children,
    infant,
    pets,
    guest_service_charge,
    price,
    host_service_charge,
    paid_amount,total_price,
    host_pay_out,
    reservation_code,
    listing,
  } = reservationDetails
  const { user } = reservationDetails

  const router = useRouter()

  const handleOrder = useCallback(() => {
    router.push(`/checkout/${listing?.unique_id}${getAsQueryString({
      adult: adult,
      children: children,
      infant: infant,
      pets: pets,
      check_in: check_in,
      check_out: check_out,
    })
    }`)
  }, [router, listing?.unique_id, adult, children, infant, pets, check_in, check_out])

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


  if (!reservationDetails) return null

  return isLoading ? <Loader className='mt-20' /> : (
    <div>
      {user ?
        <ReservationSummary 
          user={user}
          listing={listing}
          checkIn={formattedDates.checkIn}
          checkOut={formattedDates.checkOut}
          night_count={nights}
          adult_count={total_guest_count}
          host_pay_out={total_price}
          handleOrder={handleOrder}
        />
        : null}

      <UserDetails
        userFirstName={userFirstName}
        user={user}
        userJoiningDate={formattedDates.userJoiningDate}
      />

      <BookingDetails
        adult_count={adult}
        children_count={children}
        infant_count={infant}
        checkInWithYear={formattedDates.checkInWithYear}
        checkOutWithYear={formattedDates.checkOutWithYear}
        bookingWithYear={formattedDates.bookingWithYear}
        reservation_code={reservation_code}
      />

      {calendar_info ?
        <>
          <Payout
            calendar_info={calendar_info}
            night_count={nights}
            price={price}
            price_info={price_info}
            service_charge={guest_service_charge}
            payout={paid_amount}
            userType='Guest'
          />
          
          <Payout
            calendar_info={calendar_info}
            night_count={nights}
            price={price}
            price_info={price_info}
            service_charge={host_service_charge}
            payout={host_pay_out}
            userType='Host'
          />
        </>
        : null}
      {listing ? <CancellationPolicy listing={listing}/> : null}
    </div>
  )
}

export default ListingDetails
