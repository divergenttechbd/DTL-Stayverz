'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useMemo } from 'react'
import { ConnectionStatus } from '~/app/chat/components/ConnectionStatus'
import { CreateMessage } from '~/app/chat/components/conversationDetails/CreateMessage'
import { Header } from '~/app/chat/components/conversationDetails/Header'
import { Messages } from '~/app/chat/components/conversationDetails/Messages'
import { MessageMeta } from '~/app/chat/components/conversationDetails/messageMeta/MessageMeta'
import { useConversationSession } from '~/app/chat/hooks/useConversationSession'
import { useHandleTypingStatus } from '~/app/chat/hooks/useHandleTypingStatus'
import { useMergedMessages } from '~/app/chat/hooks/useMergedMessages'
import { useSenderReceiver } from '~/app/chat/hooks/useSenderReceiver'
import { useChatSessionActions } from '~/app/chat/store/chatSessionStore'
import { useConversationDetailsActions } from '~/app/chat/store/conversationDetailsStore'
import Loader from '~/components/loader/Loader'
import { getConversationDetails } from '~/queries/client/conversation'

interface ConversationDetailsProps {
  className?: string
  conversationId: string
  isMobileView?: boolean
}

export const ConversationDetails:FC<ConversationDetailsProps> = ({
  className='',
  conversationId,
  isMobileView,
}) => {
  const queryClient = useQueryClient()
  const { data, isFetching } = useQuery({
    queryKey: ['conversation', {conversationId}],
    queryFn: () => getConversationDetails({params: {conversationId, page: 1, limit: 1000}}),
    staleTime: Infinity
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const sendInquiryToPeer = searchParams.get('signal_peer') === 'inquiry'
  const pathname = usePathname()
  const { receiver, sender } = useSenderReceiver({fromUser: data?.extra_data?.chat_room.from_user, toUser: data?.extra_data?.chat_room.to_user})
  const { messages, lastMessage } = useMergedMessages({conversationId, fetchedMessages: data?.data})
  const lastSystemMessage = useMemo(() => [...messages || []].reverse().find(i => i.m_type === 'system'), [messages])
  const { connectionStatus, sendMessage, retryMessageSend, sendTypingStatus, sendReadStatus, sendInquiryMessage, connectSession } = useConversationSession({conversationId, sender})
  const { updateLatestMessage } = useChatSessionActions()
  const { setActiveMessageMeta, reset } = useConversationDetailsActions()
  const { typingStatus, handleSendTypingStatus } = useHandleTypingStatus({conversationId, sendTypingStatus})

  const handleBackClick = useCallback(() => {
    router.push(pathname)
  }, [router, pathname])

  // set conversation meta
  useEffect(() => {
    if (isMobileView) return
    setActiveMessageMeta(lastSystemMessage?.meta)
  }, [lastSystemMessage, setActiveMessageMeta, isMobileView])

  // invalidate queries on unmount
  useEffect(() => {
    return () => {
      queryClient.invalidateQueries(['conversation'])
    }
  }, [queryClient])

  // reset store when unmounted
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  // update read status
  useEffect(() => {
    if ((connectionStatus !== 'OPEN') || lastMessage?.is_read || !sender) return
    if (lastMessage?.user.id !== sender?.id) {
      setTimeout(() => sendReadStatus(), 500)
      updateLatestMessage(conversationId, {is_read: true})
    }
  }, [sendReadStatus, conversationId, lastMessage, sender, connectionStatus, updateLatestMessage])

  // send inquiry message
  useEffect(() => {
    if (connectionStatus !== 'OPEN' || !sendInquiryToPeer) return
    sendInquiryMessage()
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete('signal_peer')
    router.replace(`${pathname}?${newSearchParams.toString()}`)
  }, [connectionStatus, sendInquiryMessage, sendInquiryToPeer, router, pathname, searchParams])

  return (
    <>
      <div className={`flex grow h-full basis-4/6 ${className} max-sm:fixed max-sm:inset-0`}>
        <div className={`flex grow h-full flex-col relative`}>
          {isFetching ? <Loader className='mt-20' /> : (data?.extra_data && sender && receiver && messages && lastMessage) ? <>
            {connectionStatus === 'OPEN' ?
              <>
                <Header title={receiver.full_name} lastSystemMessage={lastSystemMessage} onBackClick={handleBackClick} isTyping={typingStatus} peer={receiver} isMobileView={isMobileView} />
                <Messages conversation={data.extra_data.chat_room} messages={messages} key={data.extra_data.chat_room.id} retryMessageSend={retryMessageSend} />
                <CreateMessage onCreate={sendMessage} onType={handleSendTypingStatus} />
              </>
              : <ConnectionStatus status={connectionStatus} onRetry={connectSession} />
            }
          </> : 'Empty'}
        </div>
        <MessageMeta />
      </div>
    </>
  )
}
