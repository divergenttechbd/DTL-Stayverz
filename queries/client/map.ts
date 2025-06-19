import { apiClient } from '~/lib/api/apiClient'

export const getLocationSuggetions = async (params: any) => {
  const endpoint = 'Map/GetSuggestions'
  return await apiClient({
    method: 'GET',
    endpoint: endpoint,
    params: params
  })
}

export const getPlaceSuggestions = async (params: any) => {
  const endpoint = `maps/suggestions/`
  return await apiClient({
    method: 'GET',
    endpoint: endpoint,
    params: params
  })
}

export const getAddress = async (params: any) => {
  const endpoint = 'maps/addresses/'
  return await apiClient({
    method: 'GET',
    endpoint: endpoint,
    params: params
  })

}

export const getPlaceInfo = async (params: any) => {
  const endpoint = `maps/places/${params.place_id}/`
  return await apiClient({
    method: 'GET',
    endpoint: endpoint,
  })

}
