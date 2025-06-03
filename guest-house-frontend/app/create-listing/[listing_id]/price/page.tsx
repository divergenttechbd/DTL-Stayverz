'use client'
import { useCallback, useEffect, useState } from 'react'
import EditablePriceInput from '~/app/create-listing/[listing_id]/price/components/EditablePriceInput'
import { useNewListingStore } from '~/app/create-listing/store/newListingStore'
import { IParams } from '~/app/create-listing/types'

export default function Home({params}: IParams) {
  const {setData, setTriggerForm, currentListingData } = useNewListingStore()
  const [price, setPrice] = useState<string>(currentListingData.price?.toString() || '1299')
  const [error, setError] = useState<string>('')
  const { guest_service_charge, host_service_charge } = currentListingData

  const trigger = useCallback(() => {
    if(!price) {
      setError('Price can\'t be empty')
      return false
    }

    return true
  }, [price, setError])
  
  useEffect(() => {
    setData({price: parseInt(price)})
  }, [price, setData])

  useEffect(() => {
    setTriggerForm(trigger)
  }, [setTriggerForm, trigger])
  
  return (
    <div className='flex min-h-[80vh] flex-col items-center justify-between p-5 sm:p-24'>
      <div className='mx-auto sm:min-w-[36rem]'>
        <p className='text-[20px] text-center sm:text-[32px] mt-3 font-medium mb-2'>Now, set your price</p>
        <p className='text-[16px] text-center sm:text-[18px] text-gray-500 mb-5'>You can change it anytime</p>
        <div className='w-full sm:w-[60%] m-auto'>
          <EditablePriceInput 
            price={price} 
            setPrice={setPrice} 
            error={error}  
            hostServicePercent={host_service_charge} 
            guestServicePercent={guest_service_charge}
            className='justify-center'
          />
        </div>
      </div>
    </div>
  )
}
