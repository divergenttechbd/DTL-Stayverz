import { Briefcase } from '@phosphor-icons/react/dist/ssr/Briefcase'
import { ChatCenteredDots } from '@phosphor-icons/react/dist/ssr/ChatCenteredDots'
import { GlobeStand } from '@phosphor-icons/react/dist/ssr/GlobeStand'
import { GraduationCap } from '@phosphor-icons/react/dist/ssr/GraduationCap'
import Image from 'next/image'
import Link from 'next/link'
import { FC, ReactNode, useMemo } from 'react'
import { IProfile } from '~/app/profile/profileType'
import EditPencil from '~/public/images/edit-pencile.svg'

interface IInfoBlock {
  icon: ReactNode | null
  label: string | ''
  value: string | undefined
  className?: string | undefined
}
interface IProfileBasicInfoProps {
  profile: IProfile | undefined
  firstName: string | undefined
}
const ProfileBasicInfo: FC<IProfileBasicInfoProps> = ({ profile, firstName }) => {
  const infoBlocks: IInfoBlock[] = useMemo(() => [
    {
      icon: <GraduationCap size={24} />,
      label: 'Where I went to school',
      value: profile?.school,
      
    },
    {
      icon: <Briefcase size={24} />,
      label: 'My work',
      value: profile?.work,
    },
    {
      icon: <GlobeStand size={24} />,
      label: 'Where I live',
      value: profile?.address,
    },
    {
      icon: <ChatCenteredDots size={24} />,
      label: 'Languages I speak',
      value: profile?.languages?.join(', '),
    },
    {
      icon: null,
      label: '',
      value: profile?.bio,
      className: `lg:col-span-2`
    }
  ], [profile])

  const InfoBlock: FC<IInfoBlock> = ({ icon, label, value, className }) => {
    if (!value) return null
    return (
      <div className={`w-full ${className || ''}`}>
        <div className={`flex gap-3`}>
          <span className='text-black'>{icon}</span>
          <p className='text-base py-[2px]'>
            {label && `${label}: `}
            {value}
          </p>
        </div>
      </div>
    )
  }
  return (
    <>
      <div className='mb-6 flex justify-between items-center'>
        <h1 className='text-3xl font-medium text-[#202020]'>About {firstName}</h1>
        <div className=''>
          <Link href='/profile/create-profile' className='text-[#202020] font-medium border border-[#f66c0e] px-4 pb-2 pt-2 flex justify-center items-center gap-2 leading-6 rounded-lg text-sm hover:bg-gray-50'>
            <Image src={EditPencil} width={30} height={30} alt='' className='w-5 h-5'/> 
          Edit Profile
          </Link>
        </div>
      </div>
      <div className='my-10 grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10'>
        {infoBlocks.map((info, index) => (
          <InfoBlock key={index} icon={info.icon} label={info.label} value={info.value} className={info.className} />
        ))}
      </div>
    </>
  )
}

export default ProfileBasicInfo
