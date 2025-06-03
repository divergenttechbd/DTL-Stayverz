'use client'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { IParams } from '~/app/create-listing/types'
import Form from '~/components/form/Form'
import useDescriptionFields from '~/app/create-listing/hooks/useDescriptionFields'
import { useNewListingStore } from '~/app/create-listing/store/newListingStore'

export default function Description({params}: IParams) {
  const formInstance = useForm()
  const fields = useDescriptionFields()
  const watchAllFields = useWatch({control: formInstance.control})
  const {setData, setTriggerForm, currentListingData} = useNewListingStore()

  useEffect(() => {
    setData(formInstance.getValues())
  }, [formInstance, setData, watchAllFields])

  useEffect(() => {
    formInstance.setValue('description', currentListingData.description)
  }, [currentListingData, formInstance])

  useEffect(() => {
    setTriggerForm(formInstance.trigger)
  }, [formInstance, setTriggerForm])
  
  return (
    <div className='flex min-h-[80vh] flex-col items-center justify-between p-5 sm:p-24'>
      <div className='mx-auto sm:min-w-[36rem]'>
        <p className='text-[20px] sm:text-[32px] mt-3 font-medium mb-2'>Create your description</p>
        <p className='text-[16px] sm:text-[18px] text-gray-500 mb-5'>Share what makes your place special.</p>
        <Form
          formInstance={formInstance}
          fields={fields}
          onSubmit={(data) => console.log(data)}
        />
      </div>
    </div>
  )
}
