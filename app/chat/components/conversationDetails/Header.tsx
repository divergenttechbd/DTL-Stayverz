import { CaretLeft, Circle } from '@phosphor-icons/react'
import { FC } from 'react'
import { Header as MessageMetaHeader } from '~/app/chat/components/conversationDetails/messageMeta/Header'
import { useOnlineStatus } from '~/app/chat/hooks/useOnlineStatus'
import { Message, Peer } from '~/queries/models/conversation'

interface IHeaderProps {
  title: string
  onBackClick: () => void
  isTyping?: boolean
  lastSystemMessage?: Message
  peer: Peer
  isMobileView?: boolean
}

export const Header: FC<IHeaderProps> = ({
  title,
  onBackClick,
  isTyping,
  lastSystemMessage,
  peer,
  isMobileView,
}) => {
  const { isOnline, lastSeen } = useOnlineStatus({peer})
  return (
    <div className='flex flex-col gap-1 py-4 md:py-4 px-7 md:px-8 border-b w-full'>
      <div className='flex items-center gap-9'>
        <CaretLeft size={22} color='#222222' className='block md:hidden cursor-pointer' onClick={onBackClick} />
        <div className='flex flex-col gap-1'>
          <h4 className='font-medium text-xl'>{title}</h4>
          <div className='flex items-center gap-1'>
            {isOnline ? <Circle width={10} weight='fill' color='mediumseagreen' className='-my-2' /> : null}
            <p className='text-xs text-[#202020] leading-none'>
              {isTyping ? 'Typing...' : isOnline ? 'Online' : lastSeen ? `Last Seen at ${lastSeen}` : 'Offline'}
            </p>
          </div>
        </div>
      </div>
      {(lastSystemMessage?.meta && isMobileView) ? <MessageMetaHeader meta={lastSystemMessage.meta} /> : null}
    </div>
  )
}
