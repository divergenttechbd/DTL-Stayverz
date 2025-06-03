'use client'

import { useMemo } from 'react'
import inputTypes from '~/constants/forms/inputTypes'

export function useConfirmPasswordFormMeta(formInstance: any) {
  const confirmPasswordFields = useMemo(() => {
    return [
      {
        key: 'password',
        label: 'Password',
        inputType: inputTypes.PASSWORD,
        required: true,
      },
      {
        key: 'confirmPassword',
        label: 'Confirm Password',
        inputType: inputTypes.PASSWORD,
        required: true,
        validate: (value: string) => value === formInstance.getValues('password') || 'The passwords do not match'
      },
    ]
  }, [formInstance])

  return [confirmPasswordFields]
}
