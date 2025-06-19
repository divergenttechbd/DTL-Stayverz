import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { ModalType } from '~/app/profile/profileType'
import { updateProfile } from '~/queries/client/profile'

export const useHandleModalSubmit = ( handleCloseModal: () => void,setLoading:Dispatch<SetStateAction<boolean>> ) => {
  const queryClient = useQueryClient()
  const { mutateAsync:profileUpdateMutation } = useMutation({ 
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profileData'] })
    }
  })
  return useCallback(async (enumType: ModalType, data: Record<string, any>) => {
    const payload = {
      [enumType.toLowerCase()]: data[enumType]
    }

    try{
      setLoading(true)
      const mutation = await profileUpdateMutation(payload)
      if(!mutation.isSucceed) throw mutation      
      handleCloseModal()
    } catch(err){
      setLoading(false)
      console.error(err)
    }

  },[profileUpdateMutation,handleCloseModal, setLoading])

}
