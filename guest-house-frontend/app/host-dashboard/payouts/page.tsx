'use client'
import { CaretRight } from '@phosphor-icons/react'
import Link from 'next/link'
import PayoutDetails from '~/app/host-dashboard/payouts/components/PayoutDetails'


const PayoutPage = () => {

  return (
    <div className='max-w-[95%] xl:max-w-[1120px] mx-auto mt-5 sm:mt-10 pb-[100px] sm:pb-0 container'>
      <h2 className='text-3xl font-semibold text-[#202020] border-b pb-5 sm:pb-10'>Payouts</h2>
      <div className='flex flex-col sm:flex-row gap-10 sm:gap-20'>
        <PayoutDetails />
        <div className='flex-[0.4] space-y-4 p-7 sm:mt-10 border rounded-lg'>
          <h3 className='text-xl font-semibold'>Need Help?</h3>
          <div className='flex items-center justify-between underline font-medium cursor-pointer'>
            <Link href={'/host-dashboard/payouts/about-payouts'}>How payouts work</Link>
            <CaretRight />
          </div>
          <div className='flex items-center justify-between underline font-medium cursor-pointer'>
            <Link href={'/host-dashboard/earnings'}>Go to your transaction history</Link>
            <CaretRight />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayoutPage


