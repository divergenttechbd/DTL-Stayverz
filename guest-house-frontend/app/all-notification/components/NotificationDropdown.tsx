import { Bell } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { FC, useEffect, useRef, useState } from 'react'
import Notifications from '~/app/all-notification/components/Notifications'
import { useDetectOutsideClick } from '~/hooks/useDetectOutsideClick'
import { getNotifications } from '~/queries/client/notification'
import { useAuthStore } from '~/store/authStore'

const NotificationDropdown: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showNotifications, setShowNotifications] = useState<boolean>(false)
  const { isAuthenticated } = useAuthStore()

  const { data, refetch } = useQuery<any, Error>({ 
    queryKey: ['notifications'], 
    queryFn: () => getNotifications(), 
    staleTime: Infinity
  })
  
  //fetch the data 
  useEffect(() => {
    if(isAuthenticated) {
      var ws = new WebSocket(`${process.env.NEXT_PUBLIC_API_WS}/ws/notifications/`)
      ws.onmessage = (ev: MessageEvent<any>) => {
        refetch()
      }
    }
  }, [isAuthenticated, refetch])

  const handleCloseNotificationModal = () => setShowNotifications(false)
  const handleNotificationClick = () => {
    setShowNotifications(prevValue => !prevValue)
    refetch()
  }

  useDetectOutsideClick(containerRef, handleCloseNotificationModal, true)

  const notificationBadger = data?.stats > 0 ? 'absolute right-1 after:content[""] after:w-2 after:h-2 after:block after:bg-[#F15927] after:rounded-full after:absolute after:right-0 after:top-1/2 after:translate-x-2 after:-translate-y-1/2': ''
  const bellColor = data?.stats > 0 ? '#f15927' : '#757575'
  return(
    <div 
      ref={containerRef}
      className={`md:block text-sm font-semibold p-2 rounded-full hover:bg-neutral-100 transition cursor-pointer static md:relative ${showNotifications && 'bg-neutral-100'}`}
    >
      <div 
        className='relative'
        onClick={handleNotificationClick}
      >
        <span className={`${notificationBadger}`}></span>
        <Bell size={24} color={bellColor}/>
      </div>
      {
        showNotifications && data ? <Notifications unread_msg={data?.data?.stats} data={data?.data?.results}/> : null
      }        
    </div>
  )
}

export default NotificationDropdown
