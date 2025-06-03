import { apiClient } from '~/lib/api/apiClient'
import { Query } from '~/queries/types'

export const getListingMetadata: Query = async (configs) => {
  const endpoint = 'listings/host/configurations/'
  try {
    const resp = await apiClient({
      method: 'GET',
      endpoint: endpoint,
      ...configs
    })

    return resp
  } catch (error) {
    throw error
  }
}

export const getListing: Query = async (configs) => {
  const endpoint = `listings/host/listings/${configs?.params.id}/`
  try {
    const resp = await apiClient({
      method: 'GET',
      endpoint: endpoint,
    })
    return resp
  } catch (error) {
    throw error
  }
}

export const getListings: Query = async (configs) => {
  const endpoint = `listings/host/listings/`
  try {
    const resp = await apiClient({
      method: 'GET',
      endpoint: endpoint,
      params: configs?.params
    })
    return resp
  } catch (error) {
    throw error
  }
}

export const createListing = async (data: any) => {
  const endpoint = 'listings/host/listings/'
  return await apiClient({
    method: 'POST',
    endpoint: endpoint,
    data: data
  })
}

export const updateListing = async (data: any) => {
  const endpoint = `listings/host/listings/${data.id}/`
  return await apiClient({
    method: 'PATCH',
    endpoint: endpoint,
    data: data
  })
}

export const getBookableListingDetails:Query = async (data) => {
  const endpoint = `listings/host/listing-calendars/${data?.params.id}/`
  const params = {
    from_date: data?.params.from_date,
    to_date: data?.params.to_date
  }
  try {
    const resp = await apiClient({
      method: 'GET',
      endpoint: endpoint,
      params
    })
    return resp
  } catch (error) {
    throw error
  }

}

export const setBookableListingDetails:Query = async (data) => {
  const endpoint = `listings/host/listing-calendars/${data?.data.id}/`
  return await apiClient({
    method: 'POST',
    endpoint: endpoint,
    data: data?.data
  })
}

