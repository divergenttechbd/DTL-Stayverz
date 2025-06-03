import Image from 'next/image'
import { FC, useMemo } from 'react'

interface UserAvatarProps {
  image?: string
  fullName: string
  alt?: string
  size?: keyof typeof SIZE_CLASSNAMES
}

export const UserAvatar: FC<UserAvatarProps> = ({
  image,
  fullName,
  alt='User"s photo',
  size='md'
}) => {
  const firstLetter = useMemo(() => (fullName?.charAt(0)), [fullName])

  return (
    <div className={`rounded-full bg-gray-300 flex items-center justify-center relative ${SIZE_CLASSNAMES[size]}`}>
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          className='rounded-full relative object-cover'
        />
      ) : (<span className='text-sm text-white'>{firstLetter}</span>)}
    </div>
  )
}


const SIZE_CLASSNAMES: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string> = {
  xs: 'w-6 h-6',
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
}
