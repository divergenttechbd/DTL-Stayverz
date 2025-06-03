'use client'

import { useRouter } from 'next/navigation'
import { FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useChangePasswordFormMeta } from '~/app/auth/hooks/meta/useChangePasswordFormMeta'
import Form from '~/components/form/Form'
import Button from '~/components/layout/Button'
import customToast from '~/lib/utils/customToast'
import { changePassword } from '~/queries/client/auth'
import { useAuthStore } from '~/store/authStore'


type ChangePasswordFormType = {
  onSuccess: Function;
  handleModalClose: () => void;
};
const ChangePasswordForm: FC<ChangePasswordFormType> = ({ onSuccess,handleModalClose }) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const formInstance = useForm()
  const { getUserData, setIsAuthenticated } = useAuthStore()
  const [changePasswordFields] = useChangePasswordFormMeta(formInstance)
  const submitButtonText = 'Submit'
  
  const handleSubmit = useCallback(
    async (formData: any) => {
      try {
        setLoading(true)
        const res = await changePassword(formData)
        if (!res?.isSucceed) {
          throw res
        }
        getUserData()
        setLoading(false)
        handleModalClose()
        customToast(
          'success',
          'Password has changed!',
          'bottom-right',
          'mb-2'
        )
        return res
      } catch (error: any) {
        setLoading(false)
        return error
      }
    },
    [getUserData, handleModalClose]
  )
  return (
    <div className=''>
      <Form
        formInstance={formInstance}
        fields={changePasswordFields}
        submitButtonLabel={
          <Button
            label={submitButtonText}
            loadingText={submitButtonText}
            variant='regular'
            type='submit'
            loading={loading}
          />
        }
        onSubmit={handleSubmit}
        resetForm={false}
      />
    </div>
  )
}

export default ChangePasswordForm
