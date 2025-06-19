import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import OtpVerification from '~/app/auth/components/otpVerification/OtpVerification'
import useAddPaymentMethodFormFields from '~/app/host-dashboard/payouts/hooks/useAddPaymentMethodFormFields'
import { EditModalType, IPaymentMethod } from '~/app/host-dashboard/payouts/types'
import Form from '~/components/form/Form'
import Modal from '~/components/modal/Modal'
import { updatePaymentMethod } from '~/queries/client/paymentMethod'
import { generateOtp } from '~/queries/client/profile'
import { useAuthStore } from '~/store/authStore'

type EditModalProps = {
  activeModal: EditModalType
  setActiveModal: Function
  selectedMethod: IPaymentMethod
  setSelectedMethod: Function
}

const EditModal:FC<EditModalProps> = ({activeModal, setActiveModal, selectedMethod, setSelectedMethod}) => {
  const [otpExpirationTime, setOtpExpirationTime] = useState<number | null>(null)

  const {userData} = useAuthStore()
  const formInstance = useForm<any>({values: selectedMethod})
  
  const formFields = useAddPaymentMethodFormFields(selectedMethod.m_type)
  
  const queryClient = useQueryClient()
  const { mutateAsync:generateOtpMutation } = useMutation({ 
    mutationFn: generateOtp,
  })
  const { mutateAsync:updatePaymentMethodAsync } = useMutation({ 
    mutationFn: updatePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] })
    }
  })

  const closeModal = useCallback(() => {
    setActiveModal(EditModalType.NONE)
    setSelectedMethod(undefined)
  }, [setActiveModal, setSelectedMethod])

  const handleGenerateOtp = useCallback(async () => {
    const payload = { phone_number: userData?.phone_number, scope: 'payment_method' }
    try {
      const mutation = await generateOtpMutation(payload)
      if(!mutation.isSucceed) throw mutation
      setOtpExpirationTime(mutation?.data?.valid_till)
      return mutation 
    } catch (error) {
      return error
    }
  },[generateOtpMutation, userData])

  const handleOtpSubmit = useCallback(async (otp: number) => {
    const payload = {
      ...formInstance.getValues(),
      otp: otp.toString(),
      m_type: selectedMethod.m_type
    }

    try {
      const mutation = await updatePaymentMethodAsync({data: payload})
      if(!mutation.isSucceed) throw mutation
      formInstance.reset()
      closeModal()
    }
    catch (error) {
      console.log('fn handleOtpSubmit. return catch -', error)
      return error
    }
  },[closeModal, formInstance, selectedMethod, updatePaymentMethodAsync])


  const handleSubmit = useCallback(async (data:Record<string, any>) => {
    try {
      await handleGenerateOtp()
      setActiveModal(EditModalType.OTP)
    } catch(err) {
      console.log(err)
    }
    
  }, [handleGenerateOtp, setActiveModal])

  return (
    <Modal
      show={activeModal !== EditModalType.NONE}
      onClose={closeModal}
      modalContainerclassName='w-[550px] h-auto rounded-2xl'
      crossBtnClassName='ml-4 mt-5'
      bodyContainerClassName='h-full'
      header={
        <h4 className='text-2xl font-semibold mb-2'>Edit Payment Method</h4>
      }
      subHeader={
        <h6 className='text-base text-grayText leading-5'>Update the following data.</h6>
      }
    >
      <div className='p-6'>      
        {(activeModal === EditModalType.OTP && otpExpirationTime && (
          <OtpVerification
            title='Confirm your email'
            otpExpirationTime={otpExpirationTime || 120}
            onVerifyOtp={handleOtpSubmit}
            phoneNumber={userData?.phone_number}
            onGenerateOtp={handleGenerateOtp}
          />
        ))}

        {(activeModal === EditModalType.FORM && (
          <Form
            formInstance={formInstance}
            fields={formFields['user_info']}
            onSubmit={handleSubmit}
            className='w-full'
            inputsContainerClassName='space-y-4 w-full'
            submitButtonLabel=
              {
                <div className='flex flex-row justify-between'>
                  <button type='submit' 
                    className='flex flex-row rounded items-center bg-[#f66c0e] px-6 pb-2 pt-2.5 text-neutral-50 hover:bg-[#f66c0e] disabled:bg-gray-400 disabled:cursor-not-allowed'>
                Continue
                  </button>
                </div>
              }
          />
        ))}
      </div>
    </Modal>
  )
}

export default EditModal
