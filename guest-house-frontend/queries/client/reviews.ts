import { apiClient } from '~/lib/api/apiClient'
import { Query } from '~/queries/types'

export const createGuestReview:Query = async (data) => {
  const endpoint = `bookings/user/bookings/${data?.data.id}/reviews/`
  return await apiClient({
    method: 'POST',
    endpoint: endpoint,
    data: data?.data
  })
}

export const createHostReview:Query = async (data) => {
  const endpoint = `bookings/host/reservations/${data?.data.id}/reviews/`
  return await apiClient({
    method: 'POST',
    endpoint: endpoint,
    data: data?.data
  })
}

export const getReviewsByMe:Query = async (data) => {
  const endpoint = `accounts/user/reviews/?my_reviews=false`

  return await apiClient({
    method: 'GET',
    endpoint: endpoint,
    data: data?.params
  })
}


export const getReviewsBy:Query = async (data) => {
  const endpoint = `accounts/public/reviews/${data?.params.id}/?my_reviews=false`

  return await apiClient({
    method: 'GET',
    endpoint: endpoint,
    data: data?.params
  })
}

export const getReviewsForMe:Query = async (data) => {
  const endpoint = `accounts/user/reviews/?my_reviews=true`

  return await apiClient({
    method: 'GET',
    endpoint: endpoint,
    data: data?.params
  })
}

export const getReviewsFor:Query = async (data) => {
  const endpoint = `accounts/public/reviews/${data?.params.id}/?my_reviews=true`

  return await apiClient({
    method: 'GET',
    endpoint: endpoint,
    data: data?.params
  })
}
