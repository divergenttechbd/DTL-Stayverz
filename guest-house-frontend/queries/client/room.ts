import { apiClient } from '~/lib/api/apiClient'
import { Query } from '~/queries/types'


export const getListingsConfigurations: Query = async () => {

  const endpoint = `listings/public/configurations/`
  try {
    const resp = await apiClient({
      method: 'GET',
      endpoint: endpoint,
      headers: {Authorization: undefined}
    })

    return resp

  } catch (error) {
    throw error
  }
}

export const getRooms: Query = async (data) => {

  // const { page, page_size , category} = data.params

  const endpoint = `listings/public/listings/`
  try {
    const resp = await apiClient({
      method: 'GET',
      endpoint: endpoint,
      params: {...data?.params},
      headers: {Authorization: undefined}
    })
    return resp

  } catch (error) {
    throw error
  }
}

export const getCheckoutCalculation: Query = async (data) => {
  const unique_id = data?.data.unique_id
  const endpoint = `listings/public/listings/${unique_id}/checkout-calculate/`
  return await apiClient({
    method: 'POST',
    endpoint: endpoint,
    data: data?.data
  })
}

export const getRoomDetails: Query = async (data) => {

  const unique_id = data?.params.unique_id

  const endpoint = `listings/public/listings/${unique_id}`

  try {
    const resp = await apiClient({
      method: 'GET',
      endpoint: endpoint,
      headers: {Authorization: undefined}
    })
    return resp?.data
  } catch (error) {
    throw error
  }
}


export const getRoomDetailsFew: Query<RoomDetails> = async (data) => {
  const unique_id = data?.params.unique_id
  const endpoint = `listings/public/listings/${unique_id}`

  try {
    const resp = await apiClient<RoomDetails>({
      method: 'GET',
      endpoint: endpoint,
      headers: {Authorization: undefined}
    })
    return resp
  } catch (error) {
    throw error
  }
}

export const addWishList:Query = async (data) => {
  const endpoint = 'wishlists/user/wishlist-items/'
  try {
    const response = await apiClient({
      endpoint: endpoint,
      method: 'POST',
      data: data
    })
    return response
  } catch (error) {
    throw error
  }
}

export const deleteWishList = async (id:number) => {
  const endpoint = `wishlists/user/wishlist-items/${id}/`
  try {
    const response = await apiClient({
      endpoint: endpoint,
      method: 'DELETE',
    })
    return response
  } catch (error) {
    throw error
  }
}

export const getWishLists: Query = async () => {
  const endpoint = 'wishlists/user/wishlist-items/' 
  try {
    const responsea = await apiClient({
      method: 'GET',
      endpoint: endpoint
    })
    return responsea

  } catch (error) {
    throw error
  }
}
