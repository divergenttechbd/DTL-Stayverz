'use client'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import usePrivacyTypeFields from '~/app/create-listing/hooks/usePrivacyTypeFields'
import { useNewListingStore } from '~/app/create-listing/store/newListingStore'
import { IParams } from '~/app/create-listing/types'
import Form from '~/components/form/Form'

export default function Home({params}: IParams) {
  const formInstance = useForm()
  const watchAllFields = useWatch({control: formInstance.control})
  const {setData, setTriggerForm, metaData, currentListingData} = useNewListingStore()
  const fields = usePrivacyTypeFields(metaData.place_types)

  useEffect(() => {
    setData(formInstance.getValues())
  }, [formInstance, setData, watchAllFields])

  useEffect(() => {
    formInstance.setValue('place_type', currentListingData.place_type ?  [currentListingData.place_type] : [])
  }, [currentListingData, formInstance])

  useEffect(() => {
    setTriggerForm(formInstance.trigger)
  }, [formInstance, setTriggerForm])
  
  return (
    <div className='flex min-h-[80vh] flex-col items-center justify-between p-5 sm:p-24'>
      <div className='mx-auto max-w-xl'>
        <p className='text-[24px] sm:text-[32px] mt-3 font-medium mb-2'>Which of these best describes your place?</p>
        <Form
          formInstance={formInstance}
          fields={fields}
          onSubmit={(data) => console.log(data)}
        />
      </div>
    </div>
  )
}
