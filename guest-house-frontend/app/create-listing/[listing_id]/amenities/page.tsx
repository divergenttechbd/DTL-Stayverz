'use client'
import { useCallback, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { IParams } from '~/app/create-listing/types'
import Form, { IFormProps } from '~/components/form/Form'
import { IOptionProps } from '~/components/form/inputs/multiSelectInput/MultiSelectInput'
import useAmenitiesFields from '~/app/create-listing/hooks/useAmenitiesFields'
import { useNewListingStore } from '~/app/create-listing/store/newListingStore'

export default function CreateListingAmenities({params}: IParams) {
  const formInstance = useForm()
  const {setValue, getValues, trigger} = formInstance

  const {setData, setTriggerForm, currentListingData, metaData} = useNewListingStore()
  const fields = useAmenitiesFields(metaData.amenities)
  const watchAllFields = useWatch({control: formInstance.control})

  useEffect(() => {
    setData(getValues())
  }, [getValues, setData, watchAllFields])


  useEffect(() => {
    setValue('amenities', currentListingData.amenities?.length ?  currentListingData.amenities.map(({amenity}:{amenity: IOptionProps}) => amenity.id) : [])
    setValue('standoutAmenities', currentListingData.amenities?.length ?  currentListingData.amenities.map(({amenity}:{amenity: IOptionProps}) => amenity.id) : [])
    setValue('safetyItems', currentListingData.amenities?.length ?  currentListingData.amenities.map(({amenity}:{amenity: IOptionProps}) => amenity.id) : [])
  }, [currentListingData, setValue])


  useEffect(() => {
    setTriggerForm(trigger)
  }, [trigger, setTriggerForm])

  const handleSubmit: IFormProps['onSubmit'] = useCallback((data) => console.log(data), [])
  
  return (
    <div className='flex min-h-[80vh] flex-col justify-between p-5 sm:p-0'>
      <div className='mx-auto max-w-[36rem]'>
        <p className='text-[32px] mt-3 font-medium mb-2'>Tell guests what your place has to offer</p>
        <p className='text-[18px] text-gray-500 mb-5'>You can add more amenities after you publish your listing</p>
        <Form
          formInstance={formInstance}
          fields={fields}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
