import { FC, ReactNode, useState } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { ICommonInputMeta } from '~/components/form/types'

export interface ITextAreaInputMeta extends ICommonInputMeta {
  maxCharacter: number
  rows?: number
  showCharacterCount?: boolean
  helperText?: ReactNode
  placeholder: string
}

interface ITextAreaInputProps {
  meta: ITextAreaInputMeta
  formInstance: UseFormReturn
  isInvalid: boolean
}

const TextAreaInput: FC<ITextAreaInputProps> = ({
  meta,
  formInstance,
  isInvalid,
}) => {
  const { register, control } = formInstance
  const [isFocused, setIsFocused] = useState(false)
  const data = useWatch({ name: meta.key, control: control })

  const handleFocusBlur = (focused: boolean) => {
    setIsFocused(focused)
  }
  
  return (
    <div className='relative'>
      {meta.helperText}
      <textarea
        rows={meta.rows}
        id={meta.key}
        onFocus={() => handleFocusBlur(true)}
        onBlurCapture={() => handleFocusBlur(false)}
        className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-[#202020] bg-transparent rounded-lg border 
        focus:outline-none focus:ring-0 peer'
        placeholder={meta.placeholder}
        {...register(meta.key, { required: meta.required, maxLength: meta.maxCharacter })}
      />
      <label
        htmlFor={meta.key}
        className={`absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 ${
          !(isFocused || data) ? ' text-xl text-gray-600 translate-y-0 scale-75 translate-y-[-5px] ' : ' text-sm '
        }`}
      >
        {meta.label}
      </label>
      {meta.showCharacterCount && <div className='m-2 text-[12px] text-gray-500'>{data?.length || 0}{meta.maxCharacter && '/'}{meta.maxCharacter}</div>}      
    </div>
  )
}

export default TextAreaInput
