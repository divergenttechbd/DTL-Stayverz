import { FC, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHandleModalSubmit } from '~/app/profile/components/editProfile/hooks/useHanldeModalSubmit'
import { IModalFormProps, ModalType } from '~/app/profile/profileType'
import Form from '~/components/form/Form'
import { ITextAreaInputMeta } from '~/components/form/inputs/TextAreaInput'
import Button from '~/components/layout/Button'

const BioForm: FC<IModalFormProps> = ({ data, closeModal }) => {
  const [loading, setLoading] = useState(false)
  const formInstance = useForm()
  const { setValue } = formInstance
  useEffect(() => {
    setValue('bio', data.profile?.bio)
  }, [data.profile?.bio, setValue])

  const handleCloseModal = useCallback(() => {
    formInstance.reset()
    closeModal()
    setLoading(false)
  },[closeModal, formInstance])
  const handleModalSubmit = useHandleModalSubmit(handleCloseModal, setLoading)

  return(
    <Form
      fields={[
        {
          key: 'bio',
          inputType: 'textarea',
          maxCharacter: 500,
          showCharacterCount: true,
        } as ITextAreaInputMeta
      ]}
      onSubmit={(data) => handleModalSubmit(ModalType.BIO, data)}
      formInstance={formInstance}
      resetForm={false}
      submitButtonLabel={<div className='w-full border-t border-gray-200 flex justify-end mt-auto py-4 px-5'>
        <Button
          label='Save'
          variant='dark'
          type='submit'
          loading={loading}
        />
      </div>}
      className='mt-2'
      inputsContainerClassName='px-6'
    />
  )
}

export default BioForm
