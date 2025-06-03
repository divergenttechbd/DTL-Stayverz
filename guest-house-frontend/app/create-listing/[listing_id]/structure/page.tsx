'use client'
import { useCallback, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import useStructureFields from '~/app/create-listing/hooks/useStructureFields'
import { useNewListingStore } from '~/app/create-listing/store/newListingStore'
import { IParams } from '~/app/create-listing/types'
import Form, { IFormProps } from '~/components/form/Form'

export default function Home({params}: IParams) {
  const formInstance = useForm()
  const watchAllFields = useWatch({ control: formInstance.control })
  const { setData, setTriggerForm, metaData,currentListingData } = useNewListingStore()

  const fields = useStructureFields(metaData.categories)

  useEffect(() => {
    setData(formInstance.getValues())
  }, [formInstance, setData, watchAllFields])

  useEffect(() => {
    setTriggerForm(formInstance.trigger)
  }, [formInstance, setTriggerForm])


  useEffect(() => {
    formInstance.setValue('category', currentListingData.category ?  [currentListingData.category] : [])
  }, [currentListingData, formInstance])


  const handleSubmit: IFormProps['onSubmit'] = useCallback(
    (data) => console.log(data),
    []
  )

  

  return (
    <div className='flex min-h-[80vh] flex-col justify-between px-5 sm:px-0'>
      <div className='mx-auto sm:min-w-[36rem]'>
        <p className='text-[20px] sm:text-[32px] mt-3 font-medium mb-2'>
          Which of these best describes your place?
        </p>
        <Form
          formInstance={formInstance}
          fields={fields}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
