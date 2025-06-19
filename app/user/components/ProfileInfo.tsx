import { FC, useMemo } from 'react'
import { ProfileDataType } from '~/app/profile/profileType'
import ProfileBasicInfo from '~/app/user/components/profileInfoDetails/ProfileBasicInfo'
import ProfileReviews from '~/app/user/components/profileInfoDetails/ProfileReviews'

interface IProfileInfoProps {
  profileInfo: Partial<ProfileDataType>
  params: {id: string | number}
}

const ProfileInfo:FC<IProfileInfoProps> = ({ profileInfo, params }) => {
  const firstName = useMemo(() => {
    return profileInfo?.full_name?.split(' ')[0]
  },[profileInfo?.full_name])
  
  return (
    <>
      <ProfileBasicInfo profile={profileInfo?.profile} firstName={firstName}/>

      <ProfileReviews latestReviews={profileInfo?.latest_reviews} firstName={firstName} params={params}/>
    </>
  )
}

export default ProfileInfo
