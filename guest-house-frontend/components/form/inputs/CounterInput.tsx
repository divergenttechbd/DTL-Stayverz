'use client'

import { Minus, Plus } from '@phosphor-icons/react'
import { FC, useCallback } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { ICommonInputMeta } from '~/components/form/types'


export interface ICounterInputMeta  extends ICommonInputMeta {
  description?: string;
}

interface CounterProps {
  meta: ICounterInputMeta;
  formInstance: UseFormReturn;
  isInvalid: boolean;
}

const CounterInput: FC<CounterProps> = ({
  meta,
  formInstance,
  isInvalid,
}) => {
  const {control} = formInstance
  
  const onIncrement = useCallback((value: number, onChange: Function) => () => {
    onChange(value + 1)
  }, [])

  const onReduce = useCallback((value: number, onChange: Function) => () => {
    if (value === 0) return    
    onChange(value - 1)
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
            <div
              onClick={onReduce(value, onChange)}
              className='select-none w-10 h-10 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 cursor-pointer hover:opacity-80 transition'
            >
              <Minus />
            </div>
            <div className='select-none font-light text-xl text-neutral-600'>
              {value}
            </div>
            <div
              onClick={onIncrement(value, onChange)}
              className='select-none w-10 h-10 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 cursor-pointer hover:opacity-80 transition'
            >
              <Plus />
            </div>
          </div>
        )}/>
    </div>
  )
}
 
export default CounterInput
