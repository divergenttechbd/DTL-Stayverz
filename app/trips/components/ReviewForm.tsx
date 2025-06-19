import React, { FC } from 'react'
import { useForm } from 'react-hook-form'
import useReviewFields from '~/app/trips/hooks/useReviewFields'
import Form from '~/components/form/Form'
import Button from '~/components/layout/Button'

type ReviewFormProps = {
  onSubmit: (data: Record<string, any>) => Promise<any> | void
  isLoading: boolean
  className?: string
}

const ReviewForm:FC<ReviewFormProps> = ({ onSubmit, isLoading, className }) => {
  const formInstance = useForm()
  const fields = useReviewFields()

  return (
    <Form
      formInstance={formInstance}
      fields={fields}
      onSubmit={onSubmit}
      className={className}
      submitButtonLabel={
        <div className='w-full border-t border-gray-200 flex justify-end mt-auto py-4'>
          <Button
            label='Save'
            variant='dark'
            type='submit'
            loading={isLoading}
          />
        </div>
      }
    />
  )
}

export default ReviewForm
