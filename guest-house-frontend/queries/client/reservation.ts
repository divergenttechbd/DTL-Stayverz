import { apiClient } from '~/lib/api/apiClient'
import { Query } from '~/queries/types'

export const getReservationMetaData:Query = async (data) => {
  const endpoint = `bookings/host/reservations`
  try {
    const response = await apiClient({
      method: 'GET',
      endpoint: endpoint,
      ...data
    })
    return response
  } catch (error) {
    throw error
  }
}

export const getSingleReservationMetaData:Query = async (configs) => {
  const { reservationId, userType } = configs?.params
  const endpoint = userType === 'guest' ? `bookings/user/bookings/${reservationId}` : `bookings/host/reservations/${reservationId}`
  if (!reservationId) throw 'No booking id present'
  try{
    const response = await apiClient({
      method: 'GET',
      endpoint: endpoint
    })
    return {...response, data: userType === 'guest' ? response.data.booking_data : response.data}
  } catch(error) {
    throw error
  }
}

export const getReservationStatesData:Query = async (data) => {
  const endpoint = `bookings/host/reservation-stats/`
  try {
    const response = await apiClient({
      method: 'GET',
      endpoint: endpoint,
      ...data
    })
    return response
  } catch (error) {
    throw error
  }
}
