'use client'

import { FC, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useForgetPasswordFormMeta } from '~/app/auth/hooks/meta/useForgotPasswordFormMeta'
import Form from '~/components/form/Form'
import { generateOtp } from '~/queries/client/auth'

type ForgotPasswordFormType = {
  onSuccess: Function
}
const ForgotPasswordForm: FC<ForgotPasswordFormType> = ({ onSuccess }) => {
  const formInstance = useForm()
  const [forgotPasswordFields] = useForgetPasswordFormMeta()

  const handleSubmit = useCallback(
    async (formData: any) => {
      try {
        const payload = {
          phone_number: formData?.phoneNumber,
          u_type: formData?.userRole[0],
          scope: 'reset_password'
        }
        const res: any = await generateOtp(payload)
        if (!res?.isSucceed) throw res
        onSuccess('RESET_PASS_OTP', { ...formData, phoneNumber: formData?.phoneNumber, userRole: formData?.userRole[0] }, res?.data?.valid_till, res?.data?.otp)
      } catch (error: any) {
        console.error(error)
        return error
      }
    },
    [onSuccess]
  )

  return <div className=''>
    <Form
      formInstance={formInstance}
      fields={forgotPasswordFields}
      submitButtonLabel={
        <button className='bg-[#f66c0e] mt-2 text-white font-medium py-2 px-4 rounded-[8px] w-full'>
          Continue
        </button>
      }
      onSubmit={handleSubmit}
      resetForm={false}
    />

  </div>
}


export default ForgotPasswordForm
