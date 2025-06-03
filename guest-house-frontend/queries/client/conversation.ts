import { apiClient, chatApiClient } from '~/lib/api/apiClient'
import { ChatQuery, Query } from '~/queries/types'
import { Conversation, ConversationDetails } from '~/queries/models/conversation'

export const createConversation: Query = async (configs) => {
  try {
    const response = await apiClient({
      method: 'POST',
      endpoint: 'chat/user/start/',
      ...configs
    })
    return response
  } catch (error) {
    throw error
  }
}

export const getConversations: any = async (configs: any) => {
  const endpoint = `chat/user/rooms/`
  try {
    const response = await chatApiClient<Conversation[]>({
      method: 'GET',
      endpoint: endpoint,
      ...configs
    })
    return response
  } catch (error) {
    throw error
  }
}

export const getConversationDetails: ChatQuery<ConversationDetails['data'], ConversationDetails['extra_data']> = async (configs) => {
  const { conversationId , ...params } = configs?.params || {}
  const endpoint = `chat/user/rooms/${conversationId}`
  try {
    const response = await chatApiClient<ConversationDetails['data'], ConversationDetails['extra_data']>({
      method: 'GET',
      endpoint: endpoint,
      ...configs,
      params,
    })
    return response
  } catch (error) {
    throw error
  }
}
