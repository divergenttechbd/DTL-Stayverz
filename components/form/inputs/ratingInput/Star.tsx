import { Star as StarIcon } from '@phosphor-icons/react'
import React, { FC, useCallback } from 'react'

type StarProps = {
  onChange: Function
  isFilled: boolean
  value: number
  label: string
}

const Star:FC<StarProps> = ({onChange, value, label, isFilled}) => {
  const handleChange = useCallback((val: number) => () => {
    onChange(val)
  }, [onChange])

  return (
    <div
      className='cursor-pointer flex flex-col justify-center items-center w-12'
      onClick={handleChange(value)}
    >
      <div>{isFilled ? (
        <StarIcon className='text-yellow-500 text-2xl' weight='fill'/>
      ) : (
        <StarIcon className='text-gray-500 text-2xl' />
      )}</div>
      <p className='text-sm font-medium mt-1'>{label}</p>
    </div>
  )
}

export default Star
