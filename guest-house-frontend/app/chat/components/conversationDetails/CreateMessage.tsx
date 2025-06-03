// import { Chats, PlusCircle } from '@phosphor-icons/react'
import { FC, useCallback } from 'react'
import { MessageInput } from '~/app/chat/components/conversationDetails/MessageInput'

export interface CreateMessageProps {
  onCreate: (value: string) => void
  onType?: (value: string) => void
}

export const CreateMessage: FC<CreateMessageProps> = ({
  onCreate,
  onType
}) => {
  const handleSubmit = useCallback((value: string) => {
    onCreate(value)
  }, [onCreate])

  return (
    <div className={`flex gap-3 md:gap-6 items-center px-8 md:px-14 bg-white max-sm:py-2 sm:py-4 shadow-t-sm`}>
      {/* <PlusCircle className='shrink-0' size={32} weight='fill' /> */}
      {/* <Chats className='shrink-0' size={32} /> */}
      <MessageInput className='flex-1' onSubmit={handleSubmit} onType={onType} />
    </div>
  )
}
