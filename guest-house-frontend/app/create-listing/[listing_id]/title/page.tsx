'use client'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { IParams } from '~/app/create-listing/types'
import Form from '~/components/form/Form'
import useTitleFields from '~/app/create-listing/hooks/useTitleFields'
import { useNewListingStore } from '~/app/create-listing/store/newListingStore'

export default function Home({params}: IParams) {
  const formInstance = useForm()
  const watchAllFields = useWatch({control: formInstance.control})
  const {setData, setTriggerForm, currentListingData} = useNewListingStore()
  const fields = useTitleFields()

  useEffect(() => {
    setData(formInstance.getValues())
  }, [formInstance, setData, watchAllFields])

  useEffect(() => {
    formInstance.setValue('title', currentListingData.title)
  }, [currentListingData, formInstance])

  useEffect(() => {
    setTriggerForm(formInstance.trigger)
  }, [formInstance, setTriggerForm])

  return (
    <div className='flex min-h-[80vh] flex-col items-center justify-between p-5 sm:p-24'>
      <div className='mx-auto sm:min-w-[36rem]'>
        <p className='text-[20px] sm:text-[32px] mt-3 font-medium mb-2'>Now let&apos;s give your house a title</p>
        <p className='text-[16px] sm:text-[18px] text-gray-500 mb-5'>Short title works best. Have fun with it - you can always change it later.</p>
        <Form
          formInstance={formInstance}
          fields={fields}
          onSubmit={(data) => console.log(data)}
        />
      </div>
    </div>
  )
}
