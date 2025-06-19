import { useMemo } from 'react'
import { Message } from '~/queries/models/conversation'
import { useChatSessionConversationMessages } from '~/app/chat/store/chatSessionStore'

interface UseMergedMessagesArgs {
  conversationId: string
  fetchedMessages?: Message[]
}

export const useMergedMessages = ({
  conversationId,
  fetchedMessages
}: UseMergedMessagesArgs) => {
  const chatSessionMessages = useChatSessionConversationMessages(conversationId)
  const firstChatSessionMessageId = chatSessionMessages?.[0]?.id
  const filteredFetchedMessages = useMemo(() => {
    if (!firstChatSessionMessageId) return fetchedMessages
    const index = fetchedMessages?.findIndex(i => i.id === firstChatSessionMessageId)
    if (!index || index < 0) return fetchedMessages
    return fetchedMessages?.slice(0, index)
  }, [fetchedMessages, firstChatSessionMessageId])

  const messages = useMemo<Message[] | undefined>(() => 
    ((filteredFetchedMessages || chatSessionMessages) ?
      [...filteredFetchedMessages || [], ...chatSessionMessages || []] : undefined), [filteredFetchedMessages, chatSessionMessages])
  return { messages, lastMessage: messages?.[messages.length - 1] }
}
