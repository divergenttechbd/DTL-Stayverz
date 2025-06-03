'use client'
import { Calendar, CheckSquare, Pencil } from '@phosphor-icons/react'
import SummaryCard from '~/app/create-listing/[listing_id]/receipt/components/SummaryCard'
import { useNewListingStore } from '~/app/create-listing/store/newListingStore'
import { IParams } from '~/app/create-listing/types'


export default function Receipt({params}: IParams) {
  const {currentListingData} = useNewListingStore()
  
  return (
    <div className='flex min-h-[80vh] flex-col items-center justify-between p-5 sm:p-24'>
      <div className='mx-auto max-w-[48rem]'>
        <p className='text-[20px] sm:text-[32px] mt-3 font-medium mb-2 w-full'>Review your listing</p>
        <p className='text-[16px] sm:text-[18px] text-gray-500 mb-5'>Here&apos;s what we&apos;ll show to guests. Make sure everything looks good.</p>
        <div className='flex flex-col sm:flex-row justify-center items-center gap-10'>
          <SummaryCard className='w-full sm:w-1/2' data={currentListingData}/>
          <div className='sm:w-1/2'>
            <p className='text-[22px] font-semibold mb-4'>What&apos;s next?</p>
            <div className='flex flex-row mb-4'>
              <CheckSquare size={48}/>
              <div className='ml-5'>
                <p className='text-[18px] font-semibold'>Confirm a few details and publish</p>
                <p className='text-[14px]'>We&apos;ll let you know if you need to verify your identity or register with the local government.</p>
              </div>
            </div>
            <div className='flex flex-row mb-4'>
              <Calendar size={48}/>
              <div className='ml-5'>
                <p className='text-[18px] font-semibold'>Set up your calendar</p>
                <p className='text-[14px]'>Choose which dates your listing is available. It will be visible 24 hours after you publish.</p>
              </div>
            </div>
            <div className='flex flex-row mb-4'>
              <Pencil size={48}/>
              <div className='ml-5'>
                <p className='text-[18px] font-semibold'>Adjust your settings</p>
                <p className='text-[14px]'>Set <span className='font-semibold capitalize'>house rules</span>, select a <span className='font-semibold capitalize'>cancellation policy</span>, choose <span className='font-semibold capitalize'>guest count</span>, and more.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
