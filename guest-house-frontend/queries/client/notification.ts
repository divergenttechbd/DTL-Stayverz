import { apiClient } from '~/lib/api/apiClient'
import { Query } from '~/queries/types'


export const getNotifications: Query = async () => {
  const endpoint = `notifications/user/notifications/?page_size=0`
  try {
    const response = await apiClient({
      method: 'GET',
      endpoint: endpoint,
    })
    return response
  } catch (error) {
    throw error
  }
}

export const updateNotification = async (id:number) => {
  const endpoint = `notifications/user/notifications/${id}/`
  try {
    const response = await apiClient({
      method: 'PATCH',
      endpoint: endpoint
    })
    return response
  } catch (error) {
    throw error
  }
}

export const updateAllNotifications = async () => {
  const endpoint = `notifications/user/notifications/0/?all_read=true`
  try {
    const response = await apiClient({
      method: 'PATCH',
      endpoint: endpoint
    })
    return response
  } catch (error) {
    throw error
  }

}
