'use client'
import { useQuery } from '@tanstack/react-query'
import { FC, useMemo } from 'react'
import ProfileInfo from '~/app/profile/components/profileDashboard/ProfileInfo'
import ProfileSummary from '~/app/profile/components/profileDashboard/ProfileSummary'
import ProfileVerification from '~/app/profile/components/profileDashboard/ProfileVerification'
import { ProfileDataType } from '~/app/profile/profileType'
import Loader from '~/components/loader/Loader'
import { getProfileDetails } from '~/queries/client/profile'
import { useAuthStore } from '~/store/authStore'

export const ProfileDashboard: FC = () => {
  const { userData } = useAuthStore()
  const { userFirstLetter, identity_verification_status, identity_verification_method } = userData || {}

  //useQuery to fetch data
  const { isLoading, data: userProfileData } = useQuery({
    queryKey: ['profileData'],
    queryFn: () => getProfileDetails(),
  })

  const showProfile = useMemo(() => {
    const { profile: { school, work, address, languages, bio } } = userProfileData?.data as ProfileDataType || { profile: {} }
    const minimumRequiredFields: boolean = [school, work, address, bio].every(item => item === '') && (languages?.length === 0)
    return !minimumRequiredFields
  }, [userProfileData])

  return (
    <div className='container mx-auto my-5 sm:my-auto'>
      <div className='flex flex-col sm:flex-row gap-10 sm:gap-15'>
        {/* Profile Intro and verification */}
        <div className=' w-full sm:w-[450px] sm:sticky sm:block sm:h-fit sm:top-[150px] sm:mb-5'>
          <div className='flex flex-col gap-8'>
            <ProfileSummary
              profileInfo={userProfileData?.data}
              userFirstLetter={userFirstLetter}
            />
            <ProfileVerification
              profileInfo={userProfileData?.data}
              identity_verification_method={identity_verification_method}
              identity_verification_status={identity_verification_status}
            />
          </div>
        </div>

        {/* Profile data */}
        <div className={`w-full sm:overflow-x-hidden  ${isLoading ? 'flex justify-center m-0' : showProfile ? '' : 'flex flex-col items-center mb-40'}`}>
          {
            isLoading ?
              <Loader /> :
              <ProfileInfo
                profileInfo={userProfileData?.data}
                showProfile={showProfile}
              />
          }
        </div>
      </div>
    </div>
  )
}
