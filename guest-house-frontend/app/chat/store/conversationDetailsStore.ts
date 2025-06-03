import { create } from 'zustand'
import { Message } from '~/queries/models/conversation'

interface ConversationDetailsStore {
  activeMessageMeta: Message['meta']
  messgageInputFocused: boolean
  actions: {
    setMessgageInputFocused: (status: boolean) => void
    setActiveMessageMeta: (meta?: Message['meta']) => void
    reset: () => void
  }
}

const useConversationDetailsStore = create<ConversationDetailsStore>((set) => {
  return {
    activeMessageMeta: undefined,
    messgageInputFocused: false,
    actions: {
      setMessgageInputFocused: (status) => set({messgageInputFocused: status}),
      setActiveMessageMeta: (meta) => set({activeMessageMeta: meta}),
      reset: () => set({activeMessageMeta: undefined})
    }
  }
})

export const useConversationDetailsActiveMessageMeta = () => useConversationDetailsStore(state => state.activeMessageMeta)
export const useConversationDetailsMessgageInputFocused = () => useConversationDetailsStore(state => state.messgageInputFocused)
export const useConversationDetailsActions = () => useConversationDetailsStore(state => state.actions)
