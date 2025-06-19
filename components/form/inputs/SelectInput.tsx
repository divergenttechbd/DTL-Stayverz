import { FC, useCallback, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { ICommonInputMeta } from '~/components/form/types'

type Option = {
  label: number | string;
  value: number | string;
}

export interface ISelectInputMeta extends ICommonInputMeta {
  CustomOption?: FC<any>;
  options?: Option[];
  prefix?: string;
}

interface ISelectInputProps {
  meta: ISelectInputMeta;
  formInstance: UseFormReturn;
  isInvalid: boolean;
}

const SelectInput: FC<ISelectInputProps> = ({ meta, formInstance, isInvalid }) => {
  const { register, control } = formInstance
  const [isFocused, setIsFocused] = useState(false)

  const handleFocusBlur = useCallback((focused: boolean) => () => {
    setIsFocused(focused)
  }, [])

  return (
    <div className={`relative ${meta.className}`}>

      <div className='relative'>
        {meta.prefix ? (
          <div className='absolute font-semibold mt-[1px] left-0 b-0 pb-2.5 px-2.5 pt-[14px] text-[#202020] bg-transparent rounded-lg peer'>
            {meta.prefix}
          </div>
        ) : <div></div>}
        <select
          id={meta.key}
          onFocus={handleFocusBlur(true)}
          className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-[#202020] bg-transparent rounded-lg border focus:outline-none focus:ring-0 ${meta?.prefix ? 'pl-16' : ''}`}
          {...register(meta.key, { required: meta.required })}
        >
          <option value='all' className='pl-16'  disabled hidden>
          Select an option
          </option>
          {meta.options?.map((option) => (
            <option key={option.value} className='pl-16' value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <label
        htmlFor={meta.key}
        className={`absolute text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 ${
          !(isFocused || meta.options?.length) ? 'text-xl text-gray-600 translate-y-0 scale-75 translate-y-[-5px]' : 'text-sm'
        }`}
      >
        {meta.label}
      </label>
    </div>
  )
}

export default SelectInput

