import { FC, ReactNode } from 'react'
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form'

interface IInputErrorProps {
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

const InputError: FC<IInputErrorProps> = ({ error }) => {
  return (
    error &&
    <div className='flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1 mb-4'>
      {error?.type === 'required'
        ? 'This field is required.'
        : error?.type === 'maxLength' ? 'Maximum text length exceeded' :(error?.message as ReactNode)}
    </div>
  )
}

export default InputError
