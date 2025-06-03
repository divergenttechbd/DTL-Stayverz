import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FC, useState } from 'react'
import Notification from '~/app/all-notification/components/Notification'
import { updateAllNotifications } from '~/queries/client/notification'

interface Props {
  data: any
  unread_msg: number
}

const Notifications:FC<Props> = ({ data, unread_msg }) => {
  const [unreadCount, setUnreadCount] = useState(unread_msg)
  const [allReadState, setAllReadState] = useState<boolean>(false)
  const handleUnreadCount = (isRead: boolean) => {
    // Only decrement if the notification was originally unread
    if (!isRead) {
      setUnreadCount(prevCount => prevCount - 1)
    }
  }

  const queryClient = useQueryClient()
  const { mutateAsync:allNotificationUpdate } = useMutation({
    mutationFn: updateAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationData']})
    }
  })
  const handleUpdateAllNotificationClick = async () => {
    if(!allReadState){
      try{
        const mutation = await allNotificationUpdate()
        if(!mutation.isSucceed) throw mutation
        // Update local state to reflect all notifications as read
        setUnreadCount(0)
        setAllReadState(true)
      }catch (error) {
        console.error('Error updating data:', error)
      }
    }
  }

  // Keep track of the last rendered date to avoid duplicates
  let lastDate = ''

  return(
    <section className='flex flex-col w-full h-full md:h-[500px] md:w-[360px] mx-auto shadow-md absolute right-0 top-20 md:top-10 z-40 bg-white'>

      {/* Notification top */}
      <div className='flex justify-between px-5 py-3 bg-white rounded-t-lg'>
        <p className='text-sm flex gap-2'>
          Notifications
          <span className='h-5 w-5 flex justify-center items-center rounded-full bg-[#F15927] text-white'>{unreadCount}</span>
        </p>
        {
          unreadCount>0 ? 
            <p 
              className='text-xs text-[#F15927] cursor-pointer'
              onClick={handleUpdateAllNotificationClick}
            >Mark all as read</p>:
            ''
        }
      </div>

      {/* notification */}
      <div className='border-grayBorder border-b-2 bg-white md:overflow-y-scroll pb-40 md:pb-0'>

        { data && 
          data?.map((item: any) => {
            // Extract only the date part from the created_at field
            const currentDate = dayjs(item?.created_at).format('YYYY-MM-DD')
            const showDateHeader = currentDate !== lastDate
            lastDate = currentDate // Update the lastDate
            return (
              <>
                {showDateHeader && <p className='text-xs font-semibold p-5 border-t border-grayBorder'>{currentDate}</p>}
                <Notification 
                  key={item.id} 
                  item={item} 
                  handleUnreadCount={() => handleUnreadCount(item.is_read)}
                  allRead={allReadState}
                  isNotificationModal={true}
                />
              </>
            )}
          )
        }
      </div>

      {/* Notification bottom */}
      <div className='py-5 bg-white rounded-b-lg mt-auto md:static w-full fixed bottom-[60px] border border-t'>
        <a href='/all-notification' className='block text-sm text-center font-semibold text-[#F15927]'>View all notifications</a>
      </div>
    </section>
  )
}

export default Notifications
