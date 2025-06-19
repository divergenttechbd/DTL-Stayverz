'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { ProfileForm } from '~/app/profile/components/editProfile/ProfileForm'
import { ProfileImageUpload } from '~/app/profile/components/editProfile/ProfileImageUpload'
import { getProfileDetails } from '~/queries/client/profile'

export const EditProfile = () => {
  //useQuery to fetch data
  const { data:userProfileData } = useQuery({
    queryKey: ['profileData'],
    queryFn: () => getProfileDetails(),
  })

  return (
    <>    
      <div className='container mx-auto flex  flex-col sm:flex-row gap-5 sm:gap-20'>
        <ProfileImageUpload />
        <ProfileForm data={userProfileData?.data}/>
      </div>
      <div 
        className='bg-white shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] fixed left-0 right-0 bottom-0 w-full border-t border-gray-400 h-20 px-4 py-6'
      >
        <div className='lg:max-w-[1162px] flex justify-enr items-center mx-auto justify-end h-7'>
          <Link href='/profile' className='text-base rounded-lg bg-[#f66c0e] px-6 py-2 sm:py-3 text-neutral-50 hover:bg-[#f66c0e]'>
          Done
          </Link>
        </div>
      </div>
    </>
  )
}
