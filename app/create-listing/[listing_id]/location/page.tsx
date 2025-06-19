'use client'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { IParams } from '~/app/create-listing/types'
import Form from '~/components/form/Form'
import { useNewListingStore } from '~/app/create-listing/store/newListingStore'
import useLocationFields from '~/app/create-listing/hooks/useLocationFields'
import { IAddress } from '~/components/form/inputs/LocationInput/LocationInput'

const defaultLocation = {
  'lat': 23.4,
  'lng': 90.9,
  'address': 'Dhaka, Bangladesh'
}

export default function Location({params}: IParams) {
  const formInstance = useForm()
  const watchAllFields = useWatch({control: formInstance.control})
  const {setData, setTriggerForm, currentListingData} = useNewListingStore()
  const [loc, setloc] = useState<IAddress>(defaultLocation)
  const locationFields = useLocationFields(loc)

  useEffect(() => {
    setloc({
      lat: currentListingData.latitude,
      lng: currentListingData.longitude,
      address: currentListingData.address
    })
  }, [currentListingData.address, currentListingData.latitude, currentListingData.longitude])

  useEffect(() => {
    setData(formInstance.getValues())
  }, [formInstance, setData, watchAllFields])

  useEffect(() => {
    setTriggerForm(formInstance.trigger)
  }, [formInstance, setTriggerForm])
  
  return (
    <div className='flex min-h-[80vh] flex-col items-center justify-between'>
      <div className='mx-auto md:max-w-xl w-[95%]'>
        <p className='text-[32px] mt-8 font-medium mb-2'>Where&apos;s your place located?</p>
        <p className='text-[18px] text-gray-500 mb-5'>Your address is only shared with guests after they&apos;ve made a reservation.
        </p>
        
        <Form formInstance={formInstance} 
          onSubmit={(data) => {console.log(data)}} 
          fields={locationFields}
        />
      </div>
    </div>
  )
}
