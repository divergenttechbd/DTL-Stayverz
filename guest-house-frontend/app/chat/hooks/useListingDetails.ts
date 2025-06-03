import { useQuery } from '@tanstack/react-query'
import { getMessageMetaDetails } from '~/queries/client/chat'
import { getSingleReservationMetaData } from '~/queries/client/reservation'
import { useAuthStore } from '~/store/authStore'

interface UseListingDetailsArgs {
  listingId: string
  userId: string
}

export const useListingDetails = ({listingId, userId}: UseListingDetailsArgs) => {
  const {data, isLoading} = useQuery({
    queryKey: ['metaDetails', listingId, userId],
    queryFn: () => getMessageMetaDetails({params: {listingId, userId}})
  })

  return {
    data: data?.data,
    isLoading,
  }
}

interface UseBookingDetailsArgs {
  reservationId: String
}

export const useBookingDetails = ({reservationId}: UseBookingDetailsArgs) => {
  const { userData } = useAuthStore()
  const { u_type: userType } = userData || {}
  const {data, isLoading} = useQuery({
    queryKey: ['reservationDetails', reservationId, userType],
    queryFn: () => getSingleReservationMetaData({params: {reservationId, userType}})
  })

  return {
    data: data?.data,
    isLoading,
  }
}
