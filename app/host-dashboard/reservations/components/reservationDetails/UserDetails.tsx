import { CalendarCheck } from '@phosphor-icons/react/dist/ssr/CalendarCheck'
import { HouseLine } from '@phosphor-icons/react/dist/ssr/HouseLine'
import { PersonSimple } from '@phosphor-icons/react/dist/ssr/PersonSimple'
import { Shield } from '@phosphor-icons/react/dist/ssr/Shield'
import Link from 'next/link'
import { FC } from 'react'
import { IGuest } from '~/app/host-dashboard/reservations/types'
import { useAuthStore } from '~/store/authStore'

interface IUserDetails {
  userFirstName: string
  user: IGuest
  userJoiningDate: string
  chatId?: string
}
const UserDetails:FC<IUserDetails> = ({ userFirstName, user, userJoiningDate, chatId }) => {
  const {userData} = useAuthStore()
  
  return (
    <div className='border-b-8 border-grayBorder px-6 pb-6 pt-8'>
      <h3 className='text-2xl font-semibold'>About {userFirstName}</h3>
      <div className='flex flex-col mt-4 mb-6 gap-3'>

        {/* will get this review value later */}
        {/* <div className='flex gap-2 items-center'>
          <Star size={16} />
          <p>Ratings</p>
        </div> */}
        <div className='flex gap-2 items-center'>
          <Shield size={16} />
          <p>{user?.identity_verification_status === 'verified' ? 'Verified':'Not Verified'}</p>
        </div>
        <div className='flex gap-2 items-center'>
          <CalendarCheck size={16} />
          <p>Joined Stayverz in {userJoiningDate}</p>
        </div>
        {user?.address ? (
          <div className='flex gap-2 items-center'>
            <HouseLine size={16} />
            <p>Lives in ...</p>
          </div>
        ): (<></>)}
        {user?.is_host ? (
          <div className='flex gap-2 items-center'>
            <PersonSimple size={16} />
            <p>Also a host</p>
          </div>
        ) : (<></>)}
      </div>

      
      <Link href={`/host-dashboard/inbox?conversation_id=${chatId}`} className='text-[#f66c0e] border border-[#f66c0e] hover:bg-[#f66c0e] hover:text-[#ffffff] px-4 py-2 leading-6 rounded-lg font-medium text-sm w-full mt-2  flex justify-center items-center'>Message</Link>
            
      {/* <p className='text-[10px] text-grayText text-center mt-2'>Phone: {user?.phone_number}</p> */}
    </div>
  )
}

export default UserDetails
