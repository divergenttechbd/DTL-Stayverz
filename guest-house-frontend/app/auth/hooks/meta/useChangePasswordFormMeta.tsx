'use client'

import { useMemo } from 'react'
import inputTypes from '~/constants/forms/inputTypes'

export function useChangePasswordFormMeta(formInstance: any) {
  const changePasswordFields = useMemo(() => {
    return [
      {
        key: 'old_password',
        label: 'Old password',
        inputType: inputTypes.PASSWORD,
        required: true,
      },
      {
        key: 'new_password',
        label: 'New password',
        inputType: inputTypes.PASSWORD,
        required: true,
      },
      {
        key: 'confirm_password',
        label: 'Confirm Password',
        inputType: inputTypes.PASSWORD,
        required: true,
        validate: (value: string) => value === formInstance.getValues('new_password') || 'The passwords do not match'
      },
    ]
  }, [formInstance])

  return [changePasswordFields]
}
