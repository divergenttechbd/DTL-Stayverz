'use client'

import { FC, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ConversationDetails } from '~/app/chat/components/conversationDetails/ConversationDetails'
import { ConversationList } from '~/app/chat/components/conversationList/ConversationList'
import { useChatSession } from '~/app/chat/hooks/useChatSession'
import { ConnectionStatus } from '~/app/chat/components/ConnectionStatus'
import { useChatInterceptor } from '~/lib/api/hooks/useChatInterceptor'
import useWindowSize from '~/hooks/useWindowSize'
import { useChatSessionActions } from '~/app/chat/store/chatSessionStore'
import { useHasUserData, useUserId } from '~/store/authStore'

interface ChatProps {
  conversationListClassName?: string
}

export const Chat: FC<ChatProps> = ({
  conversationListClassName=''
}) => {
  const hasUserData = useHasUserData()
  const searchParams = useSearchParams()
  const { isMobileView } = useWindowSize()
  const userId = useUserId()
  const { connectionStatus, connectSession } = useChatSession({canConnect: hasUserData, userId})
  const { reset: resetChatSessionStore } = useChatSessionActions()
  const currentConversationId = searchParams.get('conversation_id')
  useChatInterceptor({onRefreshToken: connectSession})

  // Clear chat session store when unmounted
  useEffect(() => {
    return () => {
      resetChatSessionStore()
    }
  }, [resetChatSessionStore])

  return (
    <div className={`flex sm:h-content max-sm:h-screen-dynamic`}>
      <ConnectionStatus status={connectionStatus} onRetry={connectSession} />
      {connectionStatus === 'OPEN' ?
        <>
          {(isMobileView && currentConversationId) ? null :
            <ConversationList className={`basis-full lg:basis-1/4 md:basis-2/5 ${conversationListClassName}`} isMobileView={isMobileView} />
          }
          {currentConversationId ?
            <ConversationDetails
              className={`lg:basis-3/4 md:basis-3/5 flex`}
              conversationId={currentConversationId}
              isMobileView={isMobileView}
            /> : null
          }
        </>
        : null}
    </div>
  )
}
