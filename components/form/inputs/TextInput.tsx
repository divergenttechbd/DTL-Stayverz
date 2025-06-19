import { FC, useCallback, useState } from 'react'
import { UseFormReturn, Validate, useWatch } from 'react-hook-form'
import { ICommonInputMeta } from '~/components/form/types'

export interface ITextInputMeta extends ICommonInputMeta {
  validate?: Validate<any, any>
  prefix?: string
}
interface ITextInputProps {
  meta: ITextInputMeta
  formInstance: UseFormReturn
  isInvalid: boolean
}
const TextInput: FC<ITextInputProps> = ({
  meta,
  formInstance,
  isInvalid,
}) => {
  const { register, control } = formInstance
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const watch = useWatch({ name: meta.key, control: control })

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword)
  }, [showPassword])

  const handleFocusBlur = useCallback((focused: boolean) => () => {
    setIsFocused(focused)
  }, [])

  return (
    <div className={`relative`}>
      <div className='relative'>
        <div className='relative'>
          {(isFocused || watch) ? (
            <div className='absolute mt-[1px] left-0 b-0 pb-2.5 px-2.5 pt-4 text-sm text-[#202020] bg-transparent rounded-lg peer'>
              {meta.prefix}
            </div>
          ) : <div></div>}
          <input
            type={showPassword ? 'text' : meta.inputType}
            id={meta.key}
            onFocus={handleFocusBlur(true)}
            onBlurCapture={handleFocusBlur(false)}
            className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-[#202020] bg-transparent rounded-lg border focus:outline-none focus:ring-0 peer ${(isFocused || watch) && meta?.prefix ? 'pl-9' : ''}`}
            placeholder=' '
            {...register(meta.key, { required: meta.required, validate: meta.validate })}
          />
        </div>
        {meta.inputType === 'password' && (
          <button
            type='button'
            className='absolute top-1/2 right-4 transform -translate-y-1/2 text-sm font-medium hover:text-gray-600 cursor-pointer underline'
            onClick={togglePasswordVisibility}
          >
            {!showPassword ? 'Show' : 'Hide'}
          </button>
        )}
      </div>
      <label
        htmlFor={meta.key}
        className={`absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 ${!(isFocused || watch) ? ' text-xl text-gray-600 scale-75 translate-y-[-5px]' : ' text-sm'
        }`}
      >

        {meta.label}
      </label>

    </div>
  )
}
export default TextInput
