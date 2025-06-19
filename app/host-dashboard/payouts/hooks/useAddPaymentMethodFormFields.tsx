import Image from 'next/image'
import { useMemo } from 'react'
import { IPaymentMethod } from '~/app/host-dashboard/payouts/types'
import SelectableList from '~/components/form/inputs/multiSelectInput/Options/SelectableList'
import inputTypes from '~/constants/forms/inputTypes'

import Bank from '~/public/logo/bank.svg'
import Bkash from '~/public/logo/bkash.svg'
import Nagad from '~/public/logo/nagad.svg'
import Rocket from '~/public/logo/rocket.svg'

const useAddPaymentMethodFormFields = (method:IPaymentMethod['m_type']) => {
  return useMemo(() => {
    return {
      method_selection: [
        {
          key: 'm_type',
          inputType: inputTypes.RADIO,
          options: [
            {
              key: 'bank', 
              label: 'Bank', 
              icon: <Image src={Bank} width={48} height={48} alt='logo' />,
              description: <ul className='mt-2 list-disc ml-6'>
                <li>3-5 working days</li>
                <li>No Fees</li>
              </ul>
            },
            {
              key: 'bkash', 
              label: 'Bkash',
              icon: <Image src={Bkash} width={48} height={48} alt='logo' />,
              description: <ul className='mt-2 list-disc ml-6'>
                <li>Instant Transfer</li>
                <li>No Fees</li>
              </ul>
            },
            {
              key: 'nagad', 
              label: 'Nagad',
              icon: <Image src={Nagad} width={48} height={48} alt='logo' />,
              description: <ul className='mt-2 list-disc ml-6'>
                <li>Instant Transfer</li>
                <li>No Fees</li>
              </ul>
            },
            {
              key: 'rocket', 
              label: 'Rocket',
              icon: <Image src={Rocket} width={48} height={48} alt='logo' />,
              description: <ul className='mt-2 list-disc ml-6'>
                <li>Instant Transfer</li>
                <li>No Fees</li>
              </ul>
            },
          ],
          required: true,
          CustomOption: SelectableList,
          maxSelection: 0,
        },
      ],
      user_info: method === 'bank' ? [
        {
          key: 'bank_name',
          label: 'Bank Name',
          inputType: inputTypes.TEXT,
          required: true,
        },
        {
          key: 'branch_name',
          label: 'Branch Name',
          inputType: inputTypes.TEXT,
          required: true,
        },
        {
          key: 'routing_number',
          label: 'Routing Number',
          inputType: inputTypes.TEXT,
          required: true,
        },
        {
          key: 'account_no',
          label: 'Account Number',
          inputType: inputTypes.TEXT,
          required: true,
        },
        {
          key: 'account_name',
          label: 'Account Name',
          inputType: inputTypes.TEXT,
          required: true,
        },
        {
          key: 'is_default',
          labelClassName: 'my-3 font-[500]',
          inputType: inputTypes.CHECKBOX,
          label: 'Set as default',
          className: '',
          checked: true
        }
      ] : [        
        {
          key: 'account_no',
          label: 'Phone Number',
          prefix: '+88',
          inputType: inputTypes.TEXT,
          required: true,
          validate: (value:string) => value.length === 11 || 'Phone Number must be 11 characters long',
        },
        {
          key: 'account_name',
          label: 'Account Name',
          inputType: inputTypes.TEXT,
          required: true,
        },
        {
          key: 'is_default',
          labelClassName: 'my-3 font-[500]',
          inputType: inputTypes.CHECKBOX,
          label: 'Set as default',
          className: '',
          checked: true
        }
      ],
    }
  }, [method])
}

export default useAddPaymentMethodFormFields

