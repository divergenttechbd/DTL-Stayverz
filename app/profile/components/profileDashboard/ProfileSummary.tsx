import { Dot, Star } from '@phosphor-icons/react'
import Image from 'next/image'
import { FC, useMemo } from 'react'
import { ProfileDataType } from '~/app/profile/profileType'

interface IProfileSummaryProps {
  profileInfo: Partial<ProfileDataType>
  userFirstLetter: string | undefined
}

const ProfileSummary:FC<IProfileSummaryProps> = ({ profileInfo,userFirstLetter }) => {

  const avgRating = useMemo(() => {
    return profileInfo?.avg_rating && (profileInfo?.avg_rating).toFixed(2)    
  },[profileInfo?.avg_rating])
  const reviewCount = useMemo(() => {
    return profileInfo?.total_rating_count
  }, [profileInfo?.total_rating_count])
  
  return (
    <div className='bg-white px-6 py-8 mb-8 rounded-3xl w-full shadow-[0px_5px_15px_rgb(0,0,0,0.3)]'>
      <div className='rounded-full w-24 h-24 bg-black flex items-center justify-center mx-auto mb-4 relative'>
        {
          profileInfo?.image ? (                
            <Image
              src={profileInfo.image}
              alt='Profile Image'                                   
              fill
              className='rounded-full relative object-cover'
            />
          ) : (<span className='text-3xl text-white text-center'>{userFirstLetter}</span>)
        }
      </div>
      <h2 className='text-center text-3xl font-medium text-[#202020] mb-2'>{profileInfo?.first_name} {profileInfo?.last_name}</h2>
      <div className='flex text-center justify-center items-center gap-1'>
        <Star weight='fill' size={16} />
        <h2 className='text-sm font-medium'>
          {avgRating}
        </h2>
        <Dot size={10} weight='fill' />
        <h2 className='text-sm font-medium'>
          {reviewCount} {reviewCount && reviewCount >1 ? 'reviews':'review'}
        </h2>
      </div>
      { profileInfo?.email && (
        <p className='text-center text-sm mt-1'>{profileInfo?.email}</p>
      )}
        
      <p className='text-center text-sm mt-1 font-medium capitalize'>{profileInfo?.u_type}</p>
    </div>
  )
}

export default ProfileSummary
