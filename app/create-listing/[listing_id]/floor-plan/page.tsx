'use client'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { IParams } from '~/app/create-listing/types'
import Form from '~/components/form/Form'
import useFloorPlanFields from '~/app/create-listing/hooks/useFloorPlanFields'
import { useNewListingStore } from '~/app/create-listing/store/newListingStore'


export default function FloorPlan({params}: IParams) {
  const formInstance = useForm()
  const fields = useFloorPlanFields()
  const watchAllFields = useWatch({control: formInstance.control})
  const {setData, setTriggerForm, currentListingData} = useNewListingStore()

  useEffect(() => {
    setData(formInstance.getValues())
  }, [formInstance, setData, watchAllFields])

  useEffect(() => {
    formInstance.setValue('guest_count', currentListingData.guest_count)
    formInstance.setValue('bedroom_count', currentListingData.bedroom_count)
    formInstance.setValue('bed_count', currentListingData.bed_count)
    formInstance.setValue('bathroom_count', currentListingData.bathroom_count)
  }, [currentListingData, formInstance])

  useEffect(() => {
    setTriggerForm(formInstance.trigger)
  }, [formInstance, setTriggerForm])
  
  return (
    <div className='flex min-h-[80vh] flex-col items-center justify-between p-5 sm:p-24'>
      <div className='mx-auto max-w-xl'>
        <p className='text-[24px] sm:text-[32px]  mt-3 font-medium mb-2'>Share some basics about your place</p>
        <p className='text-[18px] text-gray-500 mb-5'>You&apos;ll add more details later, like bed types</p>
        <Form
          formInstance={formInstance}
          fields={fields}
          onSubmit={(data) => console.log(data)}
        />
      </div>
    </div>
  )
}
