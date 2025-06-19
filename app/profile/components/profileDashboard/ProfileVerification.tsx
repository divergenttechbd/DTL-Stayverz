import { CheckCircle } from '@phosphor-icons/react/dist/ssr/CheckCircle'
import Link from 'next/link'
import { FC } from 'react'
import { ProfileDataType } from '~/app/profile/profileType'
import Modal from '~/components/modal/Modal'
import { useModal } from '~/components/modal/hooks/useModal'

interface IProfileVerificationProps {
  profileInfo: Partial<ProfileDataType>
  identity_verification_method: string | undefined
  identity_verification_status: string | undefined
}
const ProfileVerification:FC<IProfileVerificationProps> = ({ profileInfo,identity_verification_method,identity_verification_status }) => {

  const [isModalOpen, handleModalOpen, handleModalClose] = useModal()
  return (
    <>
      <div className='bg-white px-6 py-8 rounded-3xl border border-gray-200 w-full'>
        <div className='relative'>
          <h4 className='text-2xl font-medium mb-6'>{profileInfo?.first_name}&apos;s confirmed information</h4>          
          <div className='text-base mb-4 flex gap-2 text-[#202020]'><span><CheckCircle size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px]' color='#FC8E6A'/></span><span>Phone Number</span></div>
          {identity_verification_status === 'verified' && <div className='text-base mb-4 flex gap-2 text-[#202020]'><span><CheckCircle size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px]' color='#FC8E6A'/></span><span>Profile Verified</span></div>}
          {profileInfo?.is_email_verified && <div className='text-base mb-4 flex gap-2 text-[#202020]'><span><CheckCircle size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px]' color='#FC8E6A'/></span><span>Email Verified</span></div>}

          <p className='underline text-base cursor-pointer font-normal leading-6 text-[#616161]' onClick={handleModalOpen}>Learn about identity verification</p>
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
            </p>
          </Modal>
        </div>

        {
          identity_verification_status !== 'verified' &&<div className='pt-10'>
            <h4 className='text-xl font-semibold mb-8'>Verify your identity</h4>        
            <p className='text-sm mb-4 text-gray-600'>
              Before you book or Host on Stayverz, you will need to complete this step.
            </p>

            {/*  make button component */}
            <Link href='/profile/verify-profile' className='text-black border border-black px-4 pt-3 pb-3 leading-6 inline-block hover:bg-gray-50 rounded-lg'>
              {identity_verification_method === '' ? 'Get verified' : identity_verification_status === 'rejected' ? <p>Resubmit Verification!</p> : <p>Verification Pending!</p>}
            </Link>

          </div>
        }
      </div>
    </>
  )
}

export default ProfileVerification
