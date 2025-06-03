'use client'

import { Check, X } from '@phosphor-icons/react'
import { FC, useCallback } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { ICommonInputMeta } from '~/components/form/types'


export interface IBooleanInputMeta extends ICommonInputMeta {
  description?: string;
}

interface BooleanInputProps {
  meta: IBooleanInputMeta;
  formInstance: UseFormReturn;
  isInvalid: boolean;
}

const BooleanInput: FC<BooleanInputProps> = ({
  meta,
  formInstance,
  isInvalid,
}) => {
  const {control} = formInstance

  const handleChange = useCallback((value: boolean, onChange: Function) => () => {
    onChange(value)
  }, [])

  return ( 
    <div className='flex flex-row items-center justify-between py-3'>
      <div className='flex flex-col'>
        <div className='font-medium text-[18px]'>{meta.label}</div>
        <div className='font-light text-gray-600'>
          {meta.description}
        </div>
      </div>

      <Controller
        name={meta.key}
        control={control}
        defaultValue={0}
        render={({ field: { value, onChange } }) => (
          <div className='flex flex-row items-center gap-4'>
            <button
              type='button'
              onClick={handleChange(false, onChange)}
              className={`select-none w-10 h-10 rounded-full border-[1px] border-gray-400 flex items-center justify-center text-gray-500 cursor-pointer hover:opacity-80 transition ${!value && 'text-white bg-black'}`}
            >
              <X />
            </button>
            <button
              type='button'
              onClick={handleChange(true, onChange)}
              className={`select-none w-10 h-10 rounded-full border-[1px] border-gray-400 flex items-center justify-center cursor-pointer hover:opacity-80 text-gray-500 transition ${value && 'text-white bg-black'}`}
            >
              <Check />
            </button>
          </div>
        )}/>
    </div>
  )
}
 
export default BooleanInput
