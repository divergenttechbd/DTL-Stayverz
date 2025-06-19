'use client'

import { useMemo } from 'react'
import CardUserType from '~/app/auth/components/signup/CardUserType'
import Guest from '~/components/Images/Guest'
import GuestActive from '~/components/Images/GuestActive'
import GuestHouse from '~/components/Images/GuestHouse'
import GuestHouseActive from '~/components/Images/GuestHouseActive'
import inputTypes from '~/constants/forms/inputTypes'

export function useSignUpFormMeta(formInstance: any) {
  const signUpFields = useMemo(() => {
    return [
      {
        key: 'userRole',
        inputType: inputTypes.MULTI_SELECT,
        maxSelection: 1,
        required: true,
        CustomOption: CardUserType,
        options: [
          {
            id: 'host',
            name: 'Sign up as Host',
            icon: <GuestHouse />,
            iconActive: <GuestHouseActive />,
          },
          {
            id: 'guest',
            name: 'Sign up as Guest',
            icon: <Guest />,
            iconActive: <GuestActive />,
          }
        ],
        className: '',
          
      },
      {
        key: 'userFullName',
        label: 'Enter Your Name',
        inputType: inputTypes.TEXT,
        required: true,
      },
      {
        key: 'phoneNumber',
        label: 'Phone Number',
        prefix: '+88',
        inputType: inputTypes.TEXT,
        required: true,
        validate: (value:string) => value.length === 11 || 'Phone Number must be 11 characters long',
      },
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

  return [signUpFields]
}
