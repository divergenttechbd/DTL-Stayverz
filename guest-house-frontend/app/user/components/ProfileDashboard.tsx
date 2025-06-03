'use client'
import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import ProfileInfo from '~/app/user/components/ProfileInfo'
import ProfileSummary from '~/app/user/components/ProfileSummary'
import ProfileVerification from '~/app/user/components/ProfileVerfication'
import Loader from '~/components/loader/Loader'
import { getUserProfileDetails } from '~/queries/client/profile'
import { useAuthStore } from '~/store/authStore'

type ProfileDashboardProps = {
  params: { id: number | string }
}

export const ProfileDashboard:FC<ProfileDashboardProps> = ({params}) => {
  const { userData } = useAuthStore()
  const { userFirstLetter, identity_verification_status, identity_verification_method } = userData || {}

  //useQuery to fetch data
  const { isLoading, data:userProfileData } = useQuery({
    queryKey: ['profileData', params],
    queryFn: () => getUserProfileDetails({params: params}),
  })

  return (
    <div className='container mx-auto my-5 sm:my-auto'>
      <div className='flex flex-col sm:flex-row gap-10 sm:gap-15'>

        {/* Profile Intro and verification */}
        <div className='w-full sm:w-[450px] sm:sticky sm:block sm:h-fit sm:top-[150px] sm:mb-5'>
          <div className='flex flex-col gap-8'>
            <ProfileSummary
              profileInfo={userProfileData?.data} 
              userFirstLetter={userFirstLetter}
            />
            <ProfileVerification
              profileInfo={userProfileData?.data}
            />
          </div>
        </div> 

        {/* Profile data */}
        <div className={`w-full overflow-x-hidden ${isLoading ? 'flex justify-center m-0' : ''}`}> 
          {
            isLoading ? 
              <Loader/> :
              <ProfileInfo
                profileInfo={userProfileData?.data}
                params={params}
              />
          }
        </div>
      </div>
    </div>
  )
}
