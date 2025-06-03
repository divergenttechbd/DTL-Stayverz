import { Briefcase } from '@phosphor-icons/react/dist/ssr/Briefcase'
import { ChatCenteredDots } from '@phosphor-icons/react/dist/ssr/ChatCenteredDots'
import { GlobeStand } from '@phosphor-icons/react/dist/ssr/GlobeStand'
import { GraduationCap } from '@phosphor-icons/react/dist/ssr/GraduationCap'
import { FC, ReactNode, useMemo } from 'react'
import { IProfile } from '~/app/profile/profileType'

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
          <span className='text-[#202020]'>{icon}</span>
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
      <h1 className='text-3xl font-semibold mb-6'>About {firstName}</h1>

      <div className='my-10 grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10 border-b border-grayBorder'>
        {infoBlocks.map((info, index) => (
          <InfoBlock key={index} icon={info.icon} label={info.label} value={info.value} className={info.className} />
        ))}
      </div>
    </>
  )
}

export default ProfileBasicInfo
