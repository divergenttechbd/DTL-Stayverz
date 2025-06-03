import dayjs from 'dayjs'
import startCase from 'lodash/startCase'
import { useMemo } from 'react'
import { IPaymentMethod } from '~/app/host-dashboard/payouts/types'
import { IGroupInputMeta } from '~/components/form/inputs/GroupInput'
import { ISelectInputMeta } from '~/components/form/inputs/SelectInput'
import inputTypes from '~/constants/forms/inputTypes'
import { useAuthStore } from '~/store/authStore'

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const useEarningFilterFIelds = (paymentMethods: IPaymentMethod[] | undefined) => {
  const { userData } = useAuthStore()
  return useMemo(() => {
    const years = [...Array(dayjs().add(1, 'y').startOf('year').diff(dayjs(userData?.date_joined).startOf('year'), 'y')).keys()].map(val => dayjs().subtract(val, 'y').format('YYYY'))
    const monthOptions = [{ label: 'Select a Month', value: -1 }].concat(monthNames.map((month, idx) => ({ label: month, value: idx })))
    const yearOptions = [{ label: 'Select a Year', value: -1 }].concat(years.map(year => ({ label: year, value: parseInt(year) })))
    const paymentMethodOptions = [{ label: 'All', value: 0 }].concat(paymentMethods?.map(method => ({ label: `${startCase(method.m_type)}, ${method.account_name}, ${method.account_no}`, value: method.id })) || [])
    return [
      {
        inputType: inputTypes.SELECT,
        className: 'col-span-2',
        key: 'pay_method',
        label: 'Payment Method',
        options: paymentMethodOptions,
      } as ISelectInputMeta,
      {
        key: '',
        inputType: inputTypes.GROUP_INPUT,
        className: 'col-span-2 sm:col-span-1 sm:pb-6  flex items-center mt-2',
        meta: [
          {
            inputType: inputTypes.SELECT,
            key: 'from_month',
            label: 'Month',
            prefix: 'From: ',
            options: monthOptions,
            className: 'w-1/2 sm:w-2/3 me-2',
          } as ISelectInputMeta,
          {
            inputType: inputTypes.SELECT,
            key: 'from_year',
            label: 'Year',
            className: 'w-1/2 sm:w-1/3',
            options: yearOptions || [],
          } as ISelectInputMeta,
        ]
      } as IGroupInputMeta,
      {
        key: '',
        inputType: inputTypes.GROUP_INPUT,
        className: 'col-span-2 sm:col-span-1 sm:pb-6  flex items-center mt-2',
        meta: [
          {
            inputType: inputTypes.SELECT,
            key: 'to_month',
            label: 'Month',
            prefix: 'To: ',
            className: 'w-1/2 sm:w-2/3 me-2',
            options: monthOptions
          } as ISelectInputMeta,
          {
            inputType: inputTypes.SELECT,
            key: 'to_year',
            label: 'Year',
            className: 'w-1/2 sm:w-1/3',
            options: yearOptions || [],
          } as ISelectInputMeta,
        ]
      } as IGroupInputMeta,
    ]
  }, [paymentMethods, userData])
}

export default useEarningFilterFIelds
