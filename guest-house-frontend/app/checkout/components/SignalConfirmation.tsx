import { useEffect, useMemo, useRef } from 'react'
import { useConversationSession } from '~/app/chat/hooks/useConversationSession'
import { getData, setData } from '~/lib/storage/storage'

interface ProcessSignalConfirmationProps {
  invoiceNo: string
  conversationId: string
  onSignalSent: (status: boolean) => void
  signalHistory: Record<string, boolean> | undefined
}

const ProcessSignalConfirmation = ({
  invoiceNo,
  conversationId,
  onSignalSent,
  signalHistory
}: ProcessSignalConfirmationProps) => {
  const signalSentRef = useRef(false)
  const { connectionStatus, sendConfirmationMessage } = useConversationSession({conversationId})

  useEffect(() => {
    if (signalSentRef.current || (connectionStatus !== 'OPEN')) return
    sendConfirmationMessage()
    onSignalSent(true)
    signalSentRef.current = true
    setData('signal_history', {...signalHistory, [invoiceNo]: true})
  }, [connectionStatus, sendConfirmationMessage, onSignalSent, signalHistory, invoiceNo])

  return null
}

interface SignalConfirmationProps {
  invoiceNo: string
  conversationId?: string
  onSignalSent: (status: boolean) => void
}

export const SignalConfirmation = ({
  invoiceNo,
  conversationId,
  onSignalSent,
}: SignalConfirmationProps) => {
  const signalHistory = useMemo<ProcessSignalConfirmationProps['signalHistory']>(() => getData('signal_history'), [])
  const startProcess = !!conversationId && !signalHistory?.[invoiceNo]

  useEffect(() => {
    if (signalHistory?.[invoiceNo]) onSignalSent(true)
  }, [signalHistory, invoiceNo, onSignalSent])

  return startProcess ? <ProcessSignalConfirmation invoiceNo={invoiceNo} conversationId={conversationId} onSignalSent={onSignalSent} signalHistory={signalHistory} /> : null
}
