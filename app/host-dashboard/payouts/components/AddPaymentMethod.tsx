'use client'

import { ArrowLeft } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import OtpVerification from '~/app/auth/components/otpVerification/OtpVerification'
import useAddPaymentMethodFormFields from '~/app/host-dashboard/payouts/hooks/useAddPaymentMethodFormFields'
import Form from '~/components/form/Form'
import { createPaymentMethod } from '~/queries/client/paymentMethod'
import { generateOtp } from '~/queries/client/profile'
import { useAuthStore } from '~/store/authStore'

const helperText = {
  'otp': '',
  'method_selection': <div>
    <h3 className='text-xl font-semibold'>How would you like to Pay?</h3>
    <p>Payouts will be sent in BDT.</p>
  </div>,
  'user_info': <div>
    <h3 className='text-xl font-semibold mb-4'>Enter Your Account Details</h3>
  </div>,
}

export const AddPaymentMethod = () => {
  const [formState, setFormState] = useState<'method_selection' | 'user_info' | 'otp'>('method_selection')
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [otpExpirationTime, setOtpExpirationTime] = useState<number | null>(null)

  const formFields = useAddPaymentMethodFormFields(formData.m_type)

  const router = useRouter()
  const { userData } = useAuthStore()
  const formInstance = useForm()

  const { mutateAsync:generateOtpMutation } = useMutation({ 
    mutationFn: generateOtp,
  })
  const { mutateAsync:createPaymentMethodAsync } = useMutation({ 
    mutationFn: createPaymentMethod,
  })

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
      ...formData,
      otp: otp.toString(),
    }

    try {
      const mutation = await createPaymentMethodAsync({data: payload})
      if(!mutation.isSucceed) throw mutation
      formInstance.reset()
      router.push('/host-dashboard/payouts')
    }
    catch (error) {
      console.log('fn handleOtpSubmit. return catch -', error)
      return error
    }
  },[createPaymentMethodAsync, router, formData, formInstance])

  const handleSubmit = useCallback(async (data:Record<string, any>) => {
    try {
      setFormData(prev => ({...prev, ...data}))
      if(formState === 'method_selection') 
        setFormState('user_info')
      else if(formState === 'user_info') {
        await handleGenerateOtp()
        setFormState('otp')
      } else if(formState === 'otp') {
        return
      }
    } catch(err) {
      console.log(err)
    }
    
  }, [formState, handleGenerateOtp])

  const handleBack = useCallback(async (data:Record<string, any>) => {
    if(formState === 'user_info' ) 
      setFormState('method_selection')
    else if(formState === 'otp') {
      setFormState('user_info')
    } else {
      router.push('/host-dashboard/payouts')
    }
    
  }, [formState, router])


  return (
    <div className='basic-info max-w-lg m-auto p-2 mt-12'>
      <div className='flex'>
        <ArrowLeft size={20} className='mt-1 me-2 cursor-pointer' onClick={handleBack}/>
        {helperText[formState]}
      </div>
      {formState !== 'otp' ? 
        <Form
          formInstance={formInstance}
          fields={formFields[formState]}
          onSubmit={handleSubmit}
          className='w-full px-3 sm:px-0'
          inputsContainerClassName='space-y-4 w-full'
          submitButtonLabel=
            {
              <div className='flex flex-row justify-between'>
                <button type='submit' 
                  className='flex flex-row rounded-md items-center bg-[#f66c0e] px-6 pb-2 pt-2.5 text-neutral-50 hover:bg-[#f66c0e] disabled:bg-gray-400 disabled:cursor-not-allowed'>
                Continue
                </button>
              </div>
            }
        /> : <OtpVerification onGenerateOtp={handleGenerateOtp} phoneNumber={userData?.phone_number} onVerifyOtp={handleOtpSubmit} otpExpirationTime={otpExpirationTime || 120}/>}
    </div>
        
  )
}
