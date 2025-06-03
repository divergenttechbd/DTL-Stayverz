'use client'

import { useMemo } from 'react'
import CardUserType from '~/app/auth/components/signup/CardUserType'
import Guest from '~/components/Images/Guest'
import GuestActive from '~/components/Images/GuestActive'
import GuestHouse from '~/components/Images/GuestHouse'
import GuestHouseActive from '~/components/Images/GuestHouseActive'
import inputTypes from '~/constants/forms/inputTypes'

export function useSignInFormMeta(disableRole = false) {
  const signInFields = useMemo(() => {
    return [
      {
        key: 'userRole',
        inputType: inputTypes.MULTI_SELECT,
        maxSelection: 1,
        required: true,
        CustomOption: CardUserType,
        disabled: disableRole,
        options: [
          {
            id: 'host',
            name: 'Login as Host',
            icon: <GuestHouse />,
            iconActive: <GuestHouseActive />,
          },
          {
            id: 'guest',
            name: 'Login as Guest',
            icon: <Guest />,
            iconActive: <GuestActive />,
          },
        ],
        className: '',
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
    ]
  }, [disableRole])

  return [signInFields]
}
