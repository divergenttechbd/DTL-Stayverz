import { useMemo } from 'react'
import { Conversation } from '~/queries/models/conversation'
import { useChatSessionConversations } from '~/app/chat/store/chatSessionStore'

interface UseMergedConversationsArgs {
  fetchedConversations?: Conversation[]
}

export const useMergedConversations = ({
  fetchedConversations
}: UseMergedConversationsArgs) => {
  const chatSessionConversations = useChatSessionConversations()
  const conversations = useMemo<Conversation[] | undefined>(() => 
    ((fetchedConversations || chatSessionConversations) ?
      [...fetchedConversations || [], ...chatSessionConversations || []] : undefined), [fetchedConversations, chatSessionConversations])

  return { conversations }
}
