import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Star from '~/components/form/inputs/ratingInput/Star'
import { ICommonInputMeta } from '~/components/form/types'

const stars = [
  {label: 'Terrible', value: 1},
  {label: 'Bad', value: 2},
  {label: 'Ok', value: 3},
  {label: 'Good', value: 4},
  {label: 'Great', value: 5},
]

export interface IRatingInputMeta extends ICommonInputMeta {
  description?: string;
}

interface RatingInputProps {
  meta: IRatingInputMeta;
  formInstance: UseFormReturn;
  isInvalid: boolean;
}

const RatingInput: React.FC<RatingInputProps> = ({ meta, formInstance, isInvalid }) => {
  const { control } = formInstance
  return (
    <div className='flex flex-col items-start py-3'>
      <div className='text-2xl font-semibold'>{meta.label}</div>
      <div className='font-light text-gray-600'>{meta.description}</div>

      <Controller
        name={meta.key}
        control={control}
        defaultValue={0}
        render={({ field: { value, onChange } }) => (
          <div className='flex items-center mt-2'>
            {stars.map((star) => (
              <Star isFilled={star.value <= value} onChange={onChange} value={star.value} label={star.label} key={star.value} />
            ))}
          </div>
        )}
      />
    </div>
  )
}

export default RatingInput
