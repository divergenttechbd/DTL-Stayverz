import { apiClient, chatApiClient } from '~/lib/api/apiClient'
import { Query } from '~/queries/types'

export const createReport = async (data: any) => {
  const endpoint = 'user/chat/complaint'
  return await chatApiClient({
    method: 'POST',
    endpoint: endpoint,
    data: data
  })
}

export const getMessageMetaDetails: Query = async (configs) => {
  const { userId, listingId } = configs?.params
  const userEndpoint = `accounts/public/profile/${userId}/?is_chat=true`
  const listingEndpoint = `listings/public/listings/lite/${listingId}`
  if (!listingId) throw 'No listing id present'
  try {
    const [resp1, resp2] = await Promise.all([apiClient({
      method: 'GET',
      endpoint: userEndpoint
    }), apiClient({
      method: 'GET',
      endpoint: listingEndpoint
    })])
    return {...resp1, ...resp2, data: {user: resp1.data, listing: resp2.data}}
  } catch(error) {
    throw error
  }
}
