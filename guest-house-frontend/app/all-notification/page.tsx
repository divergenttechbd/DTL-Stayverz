'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import Notification from '~/app/all-notification/components/Notification'
import Container from '~/components/layout/Container'
import Footer from '~/components/layout/Footer'
import ResponsiveHostNavbar from '~/components/layout/ResponsiveHostNavbar'
import ResponsiveNavbar from '~/components/layout/ResponsiveNavbar'
import { getNotifications, updateAllNotifications } from '~/queries/client/notification'
import { useAuthStore } from '~/store/authStore'

const AllNotification = () => {
  //Get all notifications
  const { data } = useQuery<any, Error>({ 
    queryKey: ['notifications'], 
    queryFn: () => getNotifications(), 
  })

  //unread count
  const [unreadCount, setUnreadCount] = useState(data?.data?.stats||0)

  useEffect(() => {
    
    if (data?.data?.stats !== undefined) {
      setUnreadCount(data?.data?.stats)
    }
  }, [data])

  const handleUnreadCount = (isRead: boolean) => {
    if (!isRead) {
      setUnreadCount((prevCount: number) => prevCount - 1)
    }
  }

  //Mark all read
  const [allReadState, setAllReadState] = useState<boolean>(false)
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
        setUnreadCount(0)
        setAllReadState(true)
      }catch (error) {
        console.error('Error updating data:', error)
      }
    }
  }

  const { userData } = useAuthStore()
  const { u_type: userType } = userData || {}
  let lastDate = ''// Keep track of the last rendered date to avoid duplicates
  
  return(
    <>
      {
        userType === 'guest' ? 
          <ResponsiveNavbar wrapInContainer={true}/> : 
          <ResponsiveHostNavbar />
      }

      <Container>
        <div className='container pt-28 pb-20 bg-grayBg'>
          <div className='notification__wrapper md:max-w-3xl mx-auto'>
            {/* Page to header */}
            <div className='flex justify-between items-center font-semibold mb-5'>
              <p className='text-sm flex gap-2'>
                Notifications
                <span className='h-5 w-5 flex justify-center items-center rounded-full bg-[#F15927] text-white'>{unreadCount===undefined? 0:unreadCount}</span>
              </p>
              {
                unreadCount>0 ? 
                  <p 
                    className='text-xs text-[#F15927] cursor-pointer'
                    onClick={handleUpdateAllNotificationClick}
                  >Mark all as read</p>
                  :''
              }
            </div>

            {/* Notifications data */}
            { data?.data && 
              data?.data?.results?.map((item: any) => {
                const currentDate = dayjs(item?.created_at).format('YYYY-MM-DD')
                const showDateHeader = currentDate !== lastDate
                lastDate = currentDate // Update the lastDate
                return (
                  <>
                    {showDateHeader && <p className='font-semibold text-xs p-5 border-t border-grayBorder bg-white'>{currentDate}</p>}
                    <Notification 
                      key={item.id} 
                      item={item} 
                      handleUnreadCount={() => handleUnreadCount(item.is_read)}
                      allRead={allReadState}
                      isNotificationModal={false}
                    />
                  </>
                )}
              )
            }
          </div>
        </div>
      </Container>
      <Footer/>
    </>
  )
}

export default AllNotification
