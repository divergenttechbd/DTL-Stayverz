import { CheckCircle } from '@phosphor-icons/react/dist/ssr/CheckCircle'
import { FC, useMemo } from 'react'
import { ProfileDataType } from '~/app/profile/profileType'
import Modal from '~/components/modal/Modal'
import { useModal } from '~/components/modal/hooks/useModal'

interface IProfileVerificationProps {
  profileInfo: ProfileDataType
}
const ProfileVerification:FC<IProfileVerificationProps> = ({ profileInfo }) => {

  const firstName = useMemo(() => {
    return profileInfo?.full_name?.split(' ')[0]
  },[profileInfo?.full_name])

  const [isModalOpen, handleModalOpen, handleModalClose] = useModal()
  return (
    <>
      <div className='bg-white px-6 py-8 rounded-3xl border border-gray-200 w-full'>
        <div className='relative'>
          <h4 className='text-2xl font-semibold mb-6'>{firstName}&apos;s confirmed information</h4>          
          <div className='text-base mb-4 flex gap-2 text-[#202020]'><span><CheckCircle size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px]' color='#FC8E6A'/></span><span>Phone Number</span></div>
          {profileInfo?.identity_verification_status  === 'verified' && <div className='text-base mb-4 flex gap-2 text-[#202020]'><span><CheckCircle size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px]' color='#FC8E6A'/></span><span>Profile Verified</span></div>}
          {profileInfo?.is_email_verified && <div className='text-base mb-4 flex gap-2 text-[#202020]'><span><CheckCircle size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px]' color='#FC8E6A'/></span><span>Email Verified</span></div>}

          <p className='underline text-base cursor-pointer text-base font-normal leading-6 text-[#616161]' onClick={handleModalOpen}>Learn about identity verification</p>
          <Modal
            show={isModalOpen}
            onClose={handleModalClose}
            modalContainerclassName='w-[550px] rounded-xl'
            headerContainerClassName='pt-2 pb-2'
            crossBtnClassName='ml-4 mt-3'
            title='What is identity verification?'  
            titleContainerClassName='pb-4 border-b border-grayBorder mb-4'
            titleClassName='mx-auto self-end'
            bodyContainerClassName='h-full overflow-auto pb-2 mb-5 px-6'
          >
            <p className='text-sm'>Someone being “Identity verified,” or having an identity verification badge, only means that they have provided info in order to complete our identity verification process. This process has safeguards, but is not a guarantee that someone is who they claim to be. 
              {/* <Link href='#' className='underline cursor-pointer font-semibold'>Learn More</Link> */}
            </p>
          </Modal>
        </div>
      </div>
    </>
  )
}

export default ProfileVerification
