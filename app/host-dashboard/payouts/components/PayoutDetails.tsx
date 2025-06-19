'use client'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useState } from 'react'
import EditModal from '~/app/host-dashboard/payouts/components/EditModal'
import PaymentMethod from '~/app/host-dashboard/payouts/components/PaymentMethod'
import { EditModalType, IPaymentMethod } from '~/app/host-dashboard/payouts/types'
import Button from '~/components/layout/Button'
import { getPaymentMethods } from '~/queries/client/paymentMethod'

const PayoutDetails: FC = () => {
  const router = useRouter()
  const { data: paymentMethods } = useQuery({ queryKey: ['paymentMethods'], queryFn: () => getPaymentMethods() })
  const [activeModal, setActiveModal] = useState<EditModalType>(EditModalType.NONE)
  const [selectedMethod, setselectedMethod] = useState<IPaymentMethod>()

  const handleEdit = useCallback((data: IPaymentMethod) => () => {
    setselectedMethod(data)
    setActiveModal(EditModalType.FORM)
  }, [])


  const handleAddPaymentMethod = useCallback(() => {
    router.push('/host-dashboard/payouts/add-payment-method')
  }, [router])


  return (
    <div className='flex-[1] mt-5 sm:mt-10'>
      <h3 className='font-semibold text-xl'>How you will get paid</h3>
      <p className='mb-8'>You can send your money to one or more payout methods. To manage your payout method(s) or assign a taxpayer, use the edit menu next to each payout method.</p>
      <div className='space-y-6'>{paymentMethods?.data?.map((method) => <PaymentMethod key={method.id} method={method} onEdit={handleEdit} />)}</div>
      <Button label='Add Payment Method' variant='dark' className='mt-10' onclick={handleAddPaymentMethod} />
      {selectedMethod && <EditModal setActiveModal={setActiveModal} activeModal={activeModal} setSelectedMethod={setselectedMethod} selectedMethod={selectedMethod} />}
    </div>
  )
}

export default PayoutDetails
