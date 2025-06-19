import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useState } from 'react'
import Avatar from '~/public/favicon.ico'
import { updateNotification } from '~/queries/client/notification'

interface INotificationProps {
  item: any
  handleUnreadCount: (isRead: boolean) => void
  allRead: boolean
  isNotificationModal: boolean
}
const Notification: FC<INotificationProps> = ({ item, handleUnreadCount, allRead, isNotificationModal }) => {
  const queryClient = useQueryClient()
  const { push } = useRouter()

  //Update Notification status
  const { mutateAsync:notificationUpdate } = useMutation({
    mutationFn: updateNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationData']})
    }
  })

  const notificationId = item?.id
  const [read, setRead] = useState(item?.is_read)

  // Update the local `read` state whenever `allRead` changes
  useEffect(() => {
    setRead(allRead || item?.is_read)
  }, [allRead, item?.is_read])

  const handleNotificationClick = useCallback(async () => {
    if(!read) {
      setRead(true)
      handleUnreadCount(read)
      try{
        const payload = notificationId
        const mutation = await notificationUpdate(payload)
        if(!mutation.isSucceed) throw mutation
      }catch (error) {
        console.error('Error updating data:', error)
      }finally{
        push(item.data.link)
      }
    } else {
      push(item.data.link)
    }
  },[handleUnreadCount, item.data.link, notificationId, notificationUpdate, push, read])

  const notificationBadger = !read ? `after:content[""] after:w-2 after:h-2 after:block after:bg-[#F15927] after:rounded-full after:absolute ${isNotificationModal ? 'after:right-0' : 'after:right-5'} after:top-1/2 after:translate-x-2 after:-translate-y-1/2`:''
  const notificationBackground = !read ? 'bg-[#E8E8ED]':'bg-white'

  return(
    <div 
      className={`relative px-5 py-4 ${notificationBackground} flex gap-2 cursor-pointer ${!isNotificationModal? notificationBadger:''}`}
      onClick={handleNotificationClick}
    >
      <Image src={Avatar} alt='avatar' className='w-10 h-10 bg-cover'/>
      <div className={`flex flex-col gap-2 relative ${isNotificationModal? notificationBadger:''}`}>
        <p className='text-xs text-[#616161] px-2'>{item?.data?.message || ''}</p>
        <p className='text-[10px] text-[#9C9C9C] px-2'>{dayjs(item.created_at).format('h:mm a')}</p>
      </div>
    </div>
  )
}

export default Notification
