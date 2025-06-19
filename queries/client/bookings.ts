import { apiClient } from '~/lib/api/apiClient'
import { Query } from '~/queries/types'

export const createBooking:Query = async (data) => {
  const endpoint = 'bookings/user/bookings/'
  return await apiClient({
    method: 'POST',
    endpoint: endpoint,
    data: data?.data
  })
}


export const getBooking:Query = async (data) => {
  const endpoint = `bookings/user/bookings/${data?.params.invoice_no}/`
  return await apiClient({
    method: 'GET',
    endpoint: endpoint,
    params: {is_review: data?.params.is_review}
  })
}

export const getBookings:Query = async (data) => {
  const endpoint = `bookings/user/bookings/`
  return await apiClient({
    method: 'GET',
    endpoint: endpoint,
    params: data?.params
  })
}

export const createPayment:Query = async (data) => {
  const endpoint = 'payments/user/ssl-order-payment/'
  return await apiClient({
    method: 'POST',
    endpoint: endpoint,
    data: data?.data
  })
}

export const cancelBooking: Query = async (data) => {
  const endpoint = `bookings/user/bookings/${data?.data.id}/cancel/`
  return await apiClient({
    method: 'POST',
    endpoint: endpoint,
    data: data?.data
  })
}
