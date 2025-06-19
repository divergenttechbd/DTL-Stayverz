import React, { ReactNode } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { ICommonInputMeta } from '~/components/form/types'

export interface IRadioOption {
  key: string | number;
  label: string;
  description?: ReactNode;
  icon: string;
}

export interface IRadioInputMeta extends ICommonInputMeta {
  options: IRadioOption[];
  prefix?: string;
}

interface IRadioInputProps {
  meta: IRadioInputMeta;
  formInstance: UseFormReturn;
  isInvalid: boolean;
}

const RadioInput: React.FC<IRadioInputProps> = ({ formInstance, meta, isInvalid }) => {
  const { control, getValues } = formInstance

  return (
    <div className='relative'>
      <label className='block text-gray-700'>{meta.label}</label>
      <div className='mt-2'>
        {meta.options.map((option, index) => (
          <span key={option.key}>
            <label>
              <div className='flex items-center cursor-pointer'>
                <Controller
                  name={meta.key}
                  control={control}
                  rules={{
                    required: meta.required ? 'This field is required' : false,
                  }}
                  render={({ field }) => (
                    <div className='flex flex-row w-full text-base leading-6 justify-between items-center'>
                      <div className='py-5 sm:py-7'>
                        <div className='flex gap-3 items-start'>
                          {option.icon}
                          <div>
                            {option.label}
                            {option.description && <div className='text-gray-600 text-sm'>{option.description}</div>}
                          </div>
                        </div>
                      </div>
                      <input
                        type='radio'
                        {...field}
                        value={option.key}
                        checked={getValues(meta.key) === option.key}
                        className='form-radio h-5 w-5 accent-black p-5'
                      />
                    </div>
                  )}
                />
              </div>
            </label>
            {index < meta.options.length - 1 && <hr className='border-t-2'/>}
          </span>
        ))}
      </div>
    </div>
  )
}

export default RadioInput
