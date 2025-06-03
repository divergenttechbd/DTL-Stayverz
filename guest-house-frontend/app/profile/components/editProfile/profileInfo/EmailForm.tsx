import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Form from '~/components/form/Form'
import Button from '~/components/layout/Button'

const EmailForm: FC<any> = ({ data, onSubmit, emailLoading }) => {
  const formInstance = useForm()
  const { setValue } = formInstance
  useEffect(() => {
    setValue('email', data?.email)
  }, [setValue, data])

  return(
    <Form
      fields={[
        {
          key: 'email',
          inputType: 'text',
          label: 'Email',
          required: true,
          validate: value => /\S+@\S+\.\S+/.test(value) || 'Invalid email address'
        }        
      ]}
      onSubmit={onSubmit}
      formInstance={formInstance}
      resetForm={false}
      submitButtonLabel={<div className='w-full border-t border-gray-200 flex justify-end mt-auto py-4 px-5'>
        <Button
          label='Save'
          variant='dark'
          type='submit'
          loading={emailLoading}
        />
      </div>}
      className='mt-2'
      inputsContainerClassName='px-6'
    />
  )
}

export default EmailForm
