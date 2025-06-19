import Link from 'next/link'
import { FC } from 'react'
import ProfileBasicInfo from '~/app/profile/components/profileDashboard/profileInfoDetails/ProfileBasicInfo'
import ProfileListings from '~/app/profile/components/profileDashboard/profileInfoDetails/ProfileListings'
import ProfileReviews from '~/app/profile/components/profileDashboard/profileInfoDetails/ProfileReviews'
import { ProfileDataType } from '~/app/profile/profileType'
interface IProfileInfoProps {
  profileInfo: ProfileDataType
  showProfile: boolean
}

const ProfileInfo: FC<IProfileInfoProps> = ({ profileInfo, showProfile }) => {

  return (
    !showProfile ? (
      <div className='pb-10 border-gray-300 sm:w-full'>
        <h3 className='text-2xl font-semibold mb-4'>It&apos;s time to create your profile</h3>
        <p className='text-sm text-gray-500 mb-6'>Your Stayverz profile is an essential part of every reservation. Completing your profile allows other hosts and guests to get to know you better.</p>
        <Link href='/profile/create-profile' className='text-white bg-[#f66c0e] border px-6 py-3 rounded-xl text-base'>
          Create Profile
        </Link>
      </div>
    ) : (
      <>
        {/* Profile Information */}
        <ProfileBasicInfo profile={profileInfo?.profile} firstName={profileInfo?.first_name} />

        {/* Profile Reviews */}
        {(profileInfo?.latest_reviews).length > 0 && (
          <ProfileReviews latestReviews={profileInfo?.latest_reviews} firstName={profileInfo?.first_name}/>
        )}

        {/* Profile Listings */}
        {(profileInfo?.listings)?.length > 0 && (
          <ProfileListings listings={profileInfo?.listings} firstName={profileInfo?.first_name}/>
        )}
      </>
    )
  )
}

export default ProfileInfo
