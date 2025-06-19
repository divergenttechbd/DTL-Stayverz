import { FC } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { ICommonInputMeta } from '~/components/form/types'

export interface ICheckboxInputMeta extends ICommonInputMeta {
  prefix?: string
}
interface ICheckboxInputProps {
  meta: ICheckboxInputMeta
  formInstance: UseFormReturn
  isInvalid: boolean
  checked?: boolean
}
const CheckboxInput: FC<ICheckboxInputProps> = ({
  meta,
  formInstance,
  isInvalid,
  checked=false
}) => {
  const { register, control } = formInstance
  return (
    <div className='relative flex flex-row justify-start items-center  w-full gap-3 cursor-pointer'>
      <input
        type='checkbox'
        className='appearance-none peer relative cursor-pointer w-6 h-6 border border-[rgba(0,0,0,0.5)] rounded-[3px] bg-white checked:bg-[#222222] checked:border-0 checked:text-[#ffffff]'
        id={meta.key}
        placeholder=' '
        {...register(meta.key, { required: meta.required })}
        checked={meta.checked}
      />
      <label htmlFor={meta.key}>
        {meta.label}
      </label>
      <svg
        className='
          absolute 
          w-4 h-4 mt-1 mb-1 ml-[4px]
          hidden peer-checked:block'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='#fff'
        strokeWidth={3}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <polyline points='20 6 9 17 4 12' fill='none' />
      </svg>
    </div>
  )
}
export default CheckboxInput
