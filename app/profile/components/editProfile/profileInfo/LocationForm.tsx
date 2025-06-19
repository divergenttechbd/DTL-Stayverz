import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IModalFormProps } from '~/app/profile/profileType'
import Form from '~/components/form/Form'
import Button from '~/components/layout/Button'
import inputTypes from '~/constants/forms/inputTypes'
import { updateProfile } from '~/queries/client/profile'

const LocationForm: FC<IModalFormProps> = ({ data,closeModal }) => {
  const [loading, setLoading] = useState(false)
  const formInstance = useForm()
  const queryClient = useQueryClient()
  const { mutateAsync:locationUpdateMutation } = useMutation({ 
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profileData'] })
    }
  })

  const handleLocationUpdate = useCallback(async (location: any) => {
    const { address, lat, lng } = location.location
    const payload = {      
      address: address,
      latitude: lat,
      longitude: lng      
    }
    try{
      setLoading(true)
      const mutation = await locationUpdateMutation(payload)
      if(!mutation.isSucceed) throw mutation  
      formInstance.reset()
      closeModal()
    } catch(error){
      setLoading(false)
      console.error('Error updating data:', error)
      return error
    }
  },[closeModal, locationUpdateMutation, formInstance])

  return (
    <Form
      fields={[
        {
          key: 'location',
          label: 'Location',
          inputType: inputTypes.LOCATION,
          required: true,
          defaultValue: {
            lat: data.profile?.latitude,
            lng: data.profile?.longitude,
            address: data.profile?.address
          }
        },
      ]}
      onSubmit={handleLocationUpdate} 
      formInstance={formInstance}
      resetForm={false}
      className='mt-2'
      submitButtonLabel={
        <Button
          label='Save'
          variant='dark'
          type='submit'
          loading={loading}
          className='my-3 mx-2'
        />
      }
    />
  )
}

export default LocationForm
