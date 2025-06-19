'use client'

import Link from 'next/link'
import { FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSignUpFormMeta } from '~/app/auth/hooks/meta/useSignUpFormMeta'
import Form from '~/components/form/Form'
import Button from '~/components/layout/Button'

type SignUpFormType = {
  onSuccess: Function
  handleSwitch: Function,
  onSubmit: Function
}
const SignUpForm: FC<SignUpFormType> = ({ onSuccess, handleSwitch, onSubmit }) => {
  const [loading, setLoading] = useState(false)
  const formInstance = useForm()
  const [signUpFields] = useSignUpFormMeta(formInstance)

  const handleSubmit = useCallback(
    async (formData: any) => {
      try {
        setLoading(true)
        const payload = {
          userFullName: formData?.userFullName,
          recipient: formData?.phoneNumber,
          userRole: formData?.userRole[0]
        }
        const res: any = await onSubmit(payload)
        if (!res?.isSucceed) throw res
        onSuccess('SIGN_UP_OTP', { ...formData, userRole: formData?.userRole[0] }, res?.data?.valid_till)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        return error
      }
    },
    [onSubmit, onSuccess]
  )

  const handleFormSwitch = useCallback(() => {
    handleSwitch('LOG_IN')
  }, [handleSwitch])

  return <div className=''>
    <Form
      formInstance={formInstance}
      fields={signUpFields}
      submitButtonLabel={
        <Button
          label='Continue'
          variant='regular'
          type='submit'
          loading={loading}
          loadingText='Continue'
        />
      }
      onSubmit={handleSubmit}
      footerContent={<div className='text-center'>
        <p className='mt-2 text-[12px] font-[500] leading-[20px] text-[#000000]'>By Selecting continue, I agree to Stayverz’s<br />
          <Link className='underline underline-offset-1  font-[600]  text-[#194CC3]' href='/terms-and-conditions'>
            Terms of Service
          </Link>, and acknowledge the
          <Link className='underline underline-offset-1 font-[500]  text-[#194CC3]' href='/privacy-policy'> 
            {' '}Privacy Policy
          </Link>
        </p>
      </div>}
      resetForm={false}
    />
    <div className=' mt-[10px] text-center text-[14px] font-[500] leading-[24px] text-[#1F2C37]'>
      Already have an account? <button className='text-[#194CC3] underline underline-offset-1' onClick={handleFormSwitch}>Sign In</button>
    </div>
  </div>
}


export default SignUpForm



