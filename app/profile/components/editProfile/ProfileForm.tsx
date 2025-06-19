import { Briefcase, CaretRight, ChatCenteredDots, GlobeStand, GraduationCap } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import OtpVerification from '~/app/auth/components/otpVerification/OtpVerification'
import BioForm from '~/app/profile/components/editProfile/profileInfo/BioForm'
import EmailForm from '~/app/profile/components/editProfile/profileInfo/EmailForm'
import LangForm from '~/app/profile/components/editProfile/profileInfo/LangForm'
import LocationForm from '~/app/profile/components/editProfile/profileInfo/LocationForm'
import SchoolForm from '~/app/profile/components/editProfile/profileInfo/SchoolForm'
import WorkForm from '~/app/profile/components/editProfile/profileInfo/WorkForm'
import { modalHeaders } from '~/app/profile/constants/modalHeaders'
import { IProfile, ModalType, ProfileDataType } from '~/app/profile/profileType'
import Modal from '~/components/modal/Modal'
import { generateOtp, verifyEmail } from '~/queries/client/profile'

const useProfileModal = (): [ModalType, (type:ModalType) => void, () => void] => {
  const [activeModal, setActiveModal] = useState<ModalType>(ModalType.NONE)
  const openModal = (type: ModalType) => setActiveModal(type)
  const closeModal = () => setActiveModal(ModalType.NONE)
  return [activeModal, openModal, closeModal]
}

type ProfileFormProps = {
  data: ProfileDataType;
}

export const ProfileForm: FC<ProfileFormProps> = ({ data }) => {
  const profileData:IProfile = data?.profile as IProfile
  
  interface IButtonDataType {
    id: number
    modalType: ModalType 
    title: string
    icon: ReactNode
    value: string | string[] | undefined 
  }
  const [activeModal, openModal, closeModal] = useProfileModal()
  const [email, setEmail] = useState<string | undefined>('')
  const [otpExpirationTime, setOtpExpirationTime] = useState<number | null>(null)
  const [emailLoading, setEmailLoading] = useState(false)
  const formInstance = useForm()

  const buttonData:IButtonDataType[] = useMemo(() => [
    {id: 1, modalType: ModalType.SCHOOL, title: 'Where I went to school', icon: <GraduationCap size={32} />, value: profileData?.school},
    {id: 2, modalType: ModalType.WORK, title: 'My work', icon: <Briefcase size={32} />, value: profileData?.work},
    {id: 3, modalType: ModalType.LOCATION, title: 'Where I live', icon: <GlobeStand size={32} />, value: profileData?.address},
    {id: 4, modalType: ModalType.LANGUAGE, title: 'Languages I speak', icon: <ChatCenteredDots size={32} />, value: profileData?.languages}
  ], [profileData])
  
  const queryClient = useQueryClient()
  const { mutateAsync:verifyEmailMutation } = useMutation({ 
    mutationFn: verifyEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profileData'] })
    }
  })
  
  const { mutateAsync:generateOtpMutation } = useMutation({ 
    mutationFn: generateOtp,
  })

  const handleEmailSubmit = useCallback(async (data: any) => {
    const payload = { email: data?.email, scope: 'email_verify' }
    try {
      const mutation = await generateOtpMutation(payload)
      if(!mutation.isSucceed) throw mutation
      setOtpExpirationTime(mutation?.data?.valid_till)
      setEmail(mutation.data?.email)
      openModal(ModalType.OTP)
      setEmailLoading(false)
      return mutation 
    } catch (error) {
      return error
    }
  },[generateOtpMutation, openModal])

  const handleOtpSubmit = useCallback(async (otp: number) => {
    const payload = {
      email: email,
      otp: otp.toString(),
      otp_verify: true
    }
    try {
      const mutation = await verifyEmailMutation(payload)
      if(!mutation.isSucceed) throw mutation
      formInstance.reset()
      closeModal()
    }
    catch (error) {
      console.log('fn handleOtpSubmit. return catch -', error)
      return error
    }
  },[closeModal, email, formInstance, verifyEmailMutation])

  const modalHeaderType = modalHeaders[activeModal as keyof typeof modalHeaders]
  return (
    <div className='flex-grow mb-[15vh]'>
      {/* Basic profile modal */}
      <div className='basic-info'>
        <h2 className='text-3xl font-medium text-[#202020] mb-6'>Your profile</h2>
        <p className='text-base text-grayText mb-4 w-4/5'>The information you share will be used across Stayverz to help other guests and Hosts get to know you.</p>

        {/* Buttons for Basic Intro */}
        <div className='grid md:grid-cols-2 mb-10 gap-x-16'>
          {buttonData.map((btn) => {
            return (            
              <button
                key={btn.id}
                className='text-left'          
                onClick={() => openModal(btn.modalType)}
              >
                <div className='profileBtn hover:bg-primaryHover relative flex gap-3 items-center border-b border-gray-300 py-6 h-full'>
                  <span className='text-black'>{btn.icon}</span>
                  <span className={`text-base leading-5 ${ 
                    Array.isArray(btn.value) ? 
                      (btn.value.length === 0 ? 'text-grayText' : 'text-black') :
                      (btn.value ? 'text-black' : 'text-grayText')
                  }`}
                  >
                    <span className=''>{btn.title}</span>: {Array.isArray(btn.value) ? btn.value.join(', ') : btn.value}
                  </span>
                  <span className='ml-auto'>{
                    Array.isArray(btn.value) ? 
                      (btn.value.length === 0 ? '' : <CaretRight size={25}/>) :
                      (btn.value ? <CaretRight size={25}/> : '')
                  }</span>
                </div>
              </button>
            )})}
        </div>
        
        {/* Intro */}
        <div className='info-details mt-10'>
          <h2 className={`text-3xl font-medium text-[#202020] ${profileData?.bio === '' ? 'mb-8':'mb-6'}`}>About You</h2>
          <div className={`${profileData?.bio === '' ? 'p-6  border-dashed border-gray-400 border rounded-2xl':''}`}>
            { 
              profileData?.bio === '' ? 
                <p className='text-base text-grayText mb-2'>Write something fun and punchy</p> : 
                <p className='text-base text-black mb-2'>{profileData?.bio}</p> 
            }
            <a href='#' className='text-black' onClick={() => openModal(ModalType.BIO)}>
              { 
                profileData?.bio === '' ? 
                  <span className='underline'>Add Intro</span> : 
                  <span className='underline'>Edit Intro</span>
              }
            </a>
          </div>
        </div>
        
        {/* Email */}
        {/* Some UX related problems are detected. Will fix soon */}
        <div className='info-details mt-10'>
          <h2 className={`text-3xl font-medium text-[#202020] ${!data?.is_email_verified  ? 'mb-8':'mb-6'}`}>Your Email</h2>
          <div className={`${!data?.is_email_verified  ? 'p-6  border-dashed border-gray-400 border rounded-2xl':''}`}>
            { 
              !data?.is_email_verified ? 
                <p className='text-base text-grayText mb-2'>Write your email</p> : 
                <p className='text-base text-black mb-2'>{data?.email}</p> 
            }
            <a href='#' className='text-black' onClick={() => openModal(ModalType.EMAIL)}>
              { 
                !data?.is_email_verified  ? 
                  <span className='underline'>Add Email</span> : 
                  <span className='underline'>Edit Email</span>
              }
            </a>
          </div>
        
        </div>
      </div>

      {/* Modals */}
      <Modal
        show={activeModal !== ModalType.NONE}
        onClose={closeModal}
        modalContainerclassName='w-[550px] h-auto rounded-2xl'
        crossBtnClassName='ml-4 mt-5'
        bodyContainerClassName='h-full'
        header={
          <h4 className='text-2xl font-semibold mb-2'>{modalHeaderType?.header}</h4>
        }
        subHeader={
          <h6 className='text-base text-grayText leading-5'>{modalHeaderType?.subHeader}</h6>
        }
      >
        {activeModal === ModalType.SCHOOL && (
          <SchoolForm
            data={data}
            closeModal={closeModal}
          />
        )}
        {activeModal === ModalType.WORK && (
          <WorkForm
            data={data}
            closeModal={closeModal}
          />
        )}
        {activeModal === ModalType.LOCATION && (
          <LocationForm
            data={data}              
            closeModal={closeModal}
          />
        )}
        {/* Need to update this checkbox modal */}
        {/* {activeModal === ModalType.LANGUAGE && (
          <LanguageForm
            data={data}
            title='Languages you speak'
            selectedLanguages={profileData?.languages || []}
            handleModalClose={closeModal}
            enumValue={ModalType.LANGUAGE}
          />
        )} */}
        {activeModal === ModalType.LANGUAGE && (
          <LangForm
            data={data}
            closeModal={closeModal}
          />
        )}
        {activeModal === ModalType.BIO && (            
          <BioForm
            data={data}
            closeModal={closeModal}
          />
        )}
        {activeModal === ModalType.EMAIL && (            
          <EmailForm
            data={data}            
            onSubmit={handleEmailSubmit}
            emailLoading={emailLoading}            
          />
        )}
        {(activeModal === ModalType.OTP && otpExpirationTime && email && (
          <OtpVerification
            title='Confirm your email'
            otpExpirationTime={otpExpirationTime}
            onVerifyOtp={handleOtpSubmit}
            email={email}
            onGenerateOtp={handleEmailSubmit}
          />
        ))}
      </Modal>
    </div>    
  )
}
