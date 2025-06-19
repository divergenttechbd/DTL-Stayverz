import { useCallback, useEffect, useMemo, useRef } from 'react'
import throttle from 'lodash/throttle'
import { useChatSessionConversationTypingStatus } from '~/app/chat/store/chatSessionStore'

interface UseHandleTypingStatusArgs {
  conversationId: string
  sendTypingStatus: (status: boolean) => void
}

export const useHandleTypingStatus = ({conversationId, sendTypingStatus}: UseHandleTypingStatusArgs) => {
  const typingStatus = useChatSessionConversationTypingStatus(conversationId)
  const timerRef = useRef<NodeJS.Timeout>()

  const runIdleCleanUp = useCallback(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      sendTypingStatus(false)
    }, 800)
  }, [sendTypingStatus])

  const throttledSendTypingStatus = useMemo(() => throttle((value: string) => {
    sendTypingStatus(!!value)
    runIdleCleanUp()
  }, 500)
  , [sendTypingStatus, runIdleCleanUp])

  useEffect(() => {
    const timer = timerRef.current
    if (!typingStatus) clearTimeout(timer)
    return () => {
      clearTimeout(timer)
    }
  }, [typingStatus])

  return {
    typingStatus,
    handleSendTypingStatus: throttledSendTypingStatus
  }
}
