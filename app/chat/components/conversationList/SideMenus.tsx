import { FC, useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChatCentered } from '@phosphor-icons/react'
import { useChatSessionNewConversationCount } from '~/app/chat/store/chatSessionStore'

interface SideMenusProps {
  onClick?: (key: string) => void
  allMessageCount: number | null
}

export const SideMenus: FC<SideMenusProps> = ({
  onClick, allMessageCount
}) => {
  const conversationCount = useChatSessionNewConversationCount()
  const searchParams = useSearchParams()
  const activeMenu = useMemo(() => searchParams.get('message_type') || 'all_messages', [searchParams])
  const menus = useMemo(() => ([
    {
      key: 'all_messages',
      label: 'All messages',
      icon: <ChatCentered size={22} weight={activeMenu === 'all_messages' ? 'fill' : undefined} className={`shrink-0 ${activeMenu === 'all_messages' ? 'fill-white' : 'fill-black'}`} />,
      count: (allMessageCount || 0) + conversationCount,
    },
  ]), [activeMenu, allMessageCount, conversationCount])

  const handleClick = useCallback((key: string) => () => {
    onClick?.(key)
  }, [onClick])

  return (
    <div className='p-4'>
      <h4 className='px-4 mt-2 font-semibold text-3xl'>Inbox</h4>
      <div className='mt-12 flex flex-col gap-3'>
        {menus.map(i => {
          const isActive = activeMenu === i.key
          return (
            <Link key={i.key} href={`/host-dashboard/inbox${i.key === 'all_messages' ? '' : `?message_type=${i.key}`}`} replace onClick={handleClick(i.key)}>
              <div className={`flex gap-2 items-center px-5 py-3 ${isActive ? 'rounded-full bg-black' : ''}`}>
                {i.icon}
                <p className={`text-lg ${isActive ? 'text-white font-semibold' : 'text-gray-600'}`}>{i.label}</p>
                <p className={`ml-auto text-lg ${isActive ? 'text-white font-semibold' : 'text-gray-600'}`}>{i.count}</p>
              </div>
            </Link>
          )})}
      </div>
    </div>
  )
}
