import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import LanguageCheckbox from '~/app/profile/components/editProfile/profileInfo/LanguageCheckbox'
import { languages } from '~/app/profile/constants/languages'
import { IModalFormProps } from '~/app/profile/profileType'
import Form from '~/components/form/Form'
import Button from '~/components/layout/Button'
import inputTypes from '~/constants/forms/inputTypes'
import { updateProfile } from '~/queries/client/profile'

const LangForm: FC<IModalFormProps> = ({ data, closeModal }) => {
  const [loading, setLoading] = useState(false)
  const formInstance = useForm()
  const { setValue } = formInstance
  useEffect(() => {
    setValue('language', data.profile?.languages)
  }, [data.profile?.languages, setValue])

  const [searchInput, setSearchInput] = useState('')
  const filteredLanguages = useMemo(() => {
    if (searchInput.length > 0) {
      return languages.filter(language => 
        language.name.toLowerCase().startsWith(searchInput.toLowerCase())
      )
    }
    return languages
  }, [searchInput])  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchInput(e.target.value)    
  },[])

  const handleCloseModal = useCallback(() => {
    formInstance.reset()
    closeModal()
    setLoading(false)
  },[closeModal, formInstance])

  const queryClient = useQueryClient()
  const { mutateAsync:languageUpdate } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profileData']})
    }
  })

  const handleSubmit = useCallback(async (data:any) => {
    setLoading(true)
    try {
      const payload = {languages: data.language }    
      const mutation = await languageUpdate(payload)
      if(!mutation.isSucceed) throw mutation
      handleCloseModal()
    } catch (error) {
      setLoading(false)
      console.error('Error updating data:', error)
    }
  },[handleCloseModal, languageUpdate])

  return (
    <div className=''>
      <div className='relative mb-5'>
        <div className='relative mb-5 mx-6'>
          <input 
            type='text' 
            value={searchInput}
            onChange={handleSearchChange}
            className='w-full border rounded-full py-2 px-4 pl-10 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50' 
            placeholder='Search languages' 
          />
          <div className='absolute left-4 top-3 text-gray-400'>
            <MagnifyingGlass size={18} />
          </div>
        </div>
      </div>
      <div className=''>
        <Form
          fields={[
            {
              key: 'language',
              inputType: inputTypes.MULTI_SELECT,
              options: filteredLanguages,
              CustomOption: LanguageCheckbox,
              maxSelection: 0,
              className: 'w-full flex flex-col'
            },
          ]}
          onSubmit={handleSubmit}
          formInstance={formInstance}
          resetForm={false}
          actionsContainerClassName='w-full sticky bottom-0 bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] mt-auto py-4 px-5'
          submitButtonLabel={<div className='w-full flex justify-end'>
            <Button
              label='Save'
              variant='dark'
              type='submit'
              loading={loading}
            />
          </div>}
          className='mt-2 relative'
          inputsContainerClassName='h-[500px] overflow-auto px-6'
        />
      </div>
    </div>
  )
}

export default LangForm
