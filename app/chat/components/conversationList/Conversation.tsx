import { ArrowBendUpLeft } from '@phosphor-icons/react'
import Link from 'next/link'
import { FC, useMemo } from 'react'
import { DATE_FORMAT } from '~/app/chat/constants'
import { useSenderReceiver } from '~/app/chat/hooks/useSenderReceiver'
import { useChatSessionConversationMessages } from '~/app/chat/store/chatSessionStore'
import { UserAvatar } from '~/components/layout/UserAvatar'
import { formatDate, formatTime } from '~/lib/utils/formatter/dateFormatter'
import { ConverstationStatus, type Conversation as ConversationData } from '~/queries/models/conversation'


export interface ConversationProps {
  data: ConversationData
  isActive?: boolean
  isVisited?: boolean
}

export const Conversation: FC<ConversationProps> = ({
  data,
  isActive,
  isVisited,
}) => {
  const { id, to_user, from_user, listing, booking_data, latest_message, status } = data
  const { sender, receiver } = useSenderReceiver({fromUser: from_user, toUser: to_user})
  const sessionMessages = useChatSessionConversationMessages(data.id)
  const { user, content, created_at, m_type, is_read } = sessionMessages?.[sessionMessages?.length - 1] || latest_message
  const duration = useMemo(() => (`${formatDate(booking_data.check_in, 'MMM D')} - ${formatDate(booking_data.check_out, 'MMM D')}`), [booking_data])
  const isRead = (!sessionMessages?.length && isVisited) || (user.user_id === sender?.user_id) || is_read
  const formattedDate = useMemo(() => {
    return formatDate(new Date().toISOString(), DATE_FORMAT) === formatDate(created_at, DATE_FORMAT) ? formatTime(created_at) : formatDate(created_at, 'MMM DD')
  }, [created_at])
  if (!sender || !receiver) return null

  return (
    <Link href={`?conversation_id=${id}`}>
      <div className={`flex items-center gap-2 max-sm:px-2 sm:px-4 py-4 ${isActive ? 'bg-gray-100 rounded-lg' : 'border-b'}`}>
        <div className='shrink-0 w-14 h-14 relative'>
          <UserAvatar image={receiver.image} fullName={receiver.full_name} alt='Sender"s Image' />
        </div>
        <div className='flex-1 flex-col'>
          <div className='flex justify-between'>
            <p className={`text-xs ${STATUS_CLASSNAMES[status]}`}>{STATUS_DISPLAY_NAMES[status]}</p>
            <p className='text-sm text-gray-500'>{formattedDate}</p>
          </div>
          <p className={`${isRead ? 'text-gray-500' : 'font-bold text-gray-0'}`}>{receiver.full_name}</p>
          <div className='flex justify-between items-center gap-1'>
            <p className={`ellipsis-one-line break-all ${isRead ? 'text-gray-500' : 'font-bold text-gray-0'}`}>
              {m_type === 'system' ? 'Stayverz' : user?.user_id === sender.user_id ? 'You:' : ''} {content}
            </p>
            {isRead ? null : <ArrowBendUpLeft className='shrink-0' size={16} weight='bold' color='#6b7280' />}
          </div>
          <p className='text-sm text-gray-500 ellipsis-one-line break-all'>{duration} · {listing.name}</p>
        </div>
      </div>
    </Link>
  )
}


const STATUS_CLASSNAMES: Record<`${ConverstationStatus}`, string> = {
  inquiry: 'text-red-800',
  confirmed: 'text-green-800',
  cancelled: 'text-red-500',
}

const STATUS_DISPLAY_NAMES: Record<`${ConverstationStatus}`, string> = {
  inquiry: 'Inquiry',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
}
