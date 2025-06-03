import startCase from 'lodash/startCase'
import Image from 'next/image'
import React, { FC } from 'react'
import { IPaymentMethod } from '~/app/host-dashboard/payouts/types'
import Button from '~/components/layout/Button'
import Bank from '~/public/logo/bank.svg'
import Bkash from '~/public/logo/bkash.svg'
import Nagad from '~/public/logo/nagad.svg'
import Rocket from '~/public/logo/rocket.svg'

type PaymentMethodProps = {
  method: IPaymentMethod
  onEdit: Function
}

const PaymentMethod:FC<PaymentMethodProps> = ({method, onEdit}) => {
  const logo = {
    bank: Bank,
    bkash: Bkash,
    nagad: Nagad,
    rocket: Rocket,
  }
  return (
    <div className='flex justify-between items-center'>
      <div className='flex items-center gap-3'>
        <Image src={logo[method.m_type]} width={48} height={48} alt='logo' />
        <div>
          <div className='flex items-center'>
            <h5 className='font-semibold text-normal'>{startCase(method.m_type)}</h5>
            {method.is_default && <span className='text-xs ms-4 p-1 bg-gray-200 rounded-md border font-semibold'>DEFAULT</span>}
          </div>
          <p className='text-sm'>{method.account_name}, {method.bank_name && `${method.bank_name},`} {method.account_no}</p>
        </div>
      </div>
      <div>
        <Button variant='outlined' label='Edit' onclick={onEdit({...method})}/>
      </div>
    </div>
  )
}

export default PaymentMethod
