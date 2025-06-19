import { apiClient } from '~/lib/api/apiClient'

export const sendMessages = async (data:any) => {
  const endpoint = 'contacts/messages'
  try {
    const response = await apiClient({
      endpoint: endpoint,
      method: 'POST',
      data: data,
    })
    return response
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}
