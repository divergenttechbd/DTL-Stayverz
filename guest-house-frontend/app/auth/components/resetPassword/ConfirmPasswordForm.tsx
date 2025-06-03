'use client'
import { FC, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useConfirmPasswordFormMeta } from '~/app/auth/hooks/meta/useConfirmPasswordFormMeta'
import Form from '~/components/form/Form'

type ConfirmPasswordFormType = {
  onSubmit: Function,
  onSuccess: Function
}
const ConfirmPasswordForm: FC<ConfirmPasswordFormType> = ({ onSubmit, onSuccess }) => {
  const formInstance = useForm()
  const [confirmPasswordFields] = useConfirmPasswordFormMeta(formInstance)

  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        const res = await onSubmit(null, data?.password)
        if (!res?.isSucceed) throw res
        onSuccess()
      } catch (err) {
        console.error(err)
        return err
      }

    },
    [onSubmit, onSuccess],
  )

  return <div className=''>
    <h3 className='mb-[30px] text-center text-[15px] font-[600] leading-[22px] text-[#333333]'>Confirm your new password</h3>
    <Form
      formInstance={formInstance}
      fields={confirmPasswordFields}
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


export default ConfirmPasswordForm
