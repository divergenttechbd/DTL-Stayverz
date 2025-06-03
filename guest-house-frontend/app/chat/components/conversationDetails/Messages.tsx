import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { Message } from '~/app/chat/components/conversationDetails/Message'
import { Conversation, type Message as MessageData } from '~/queries/models/conversation'
import { ReportMessageModal } from '~/app/chat/components/conversationDetails/ReportMessageModal'
import { useSenderReceiver } from '~/app/chat/hooks/useSenderReceiver'

interface MessagesProps {
  conversation: Conversation
  messages: MessageData[]
  retryMessageSend: (conversationId: string, message: MessageData) => void
}

export const Messages: FC<MessagesProps> = ({
  conversation,
  messages,
  retryMessageSend,
}) => {
  const containerRef = useRef<VirtuosoHandle>(null)
  const [reportMessageId, setReportMessageId] = useState<MessageData['id']>()
  const reportMessage = useMemo(() => reportMessageId ? messages?.find(i => i.id === reportMessageId) : undefined, [messages, reportMessageId])
  const { receiver } = useSenderReceiver({fromUser: conversation.from_user, toUser: conversation.to_user})

  const handleCloseReport = useCallback(() => {
    setReportMessageId(undefined)
  }, [])

  const handleRetryMessageSend = useCallback((message: MessageData) => () => {
    retryMessageSend(conversation.id, message)
  }, [conversation.id, retryMessageSend])

  useEffect(() => {
    setTimeout(() => {
      containerRef.current?.scrollToIndex({index: messages.length - 1, behavior: 'smooth'})
    }, 200)
  }, [messages])

  return (
    <>
      <Virtuoso
        ref={containerRef}
        data={messages}
        initialTopMostItemIndex={messages.length - 1}
        itemContent={(index, message) => (
          <div className={`mx-7 md:mx-14 ${index >= (messages.length - 1) ? 'pb-6 sm:pb-8' : ''}`}>
            <Message
              index={index}
              messages={messages}
              receiver={receiver}
              onReport={setReportMessageId}
              onRetrySend={handleRetryMessageSend(message)}
            />
          </div>
        )}
      />
      <ReportMessageModal message={reportMessage} onClose={handleCloseReport} />
    </>
  )
}
