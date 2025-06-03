import React, { FC, useRef } from 'react'
import { useDetectOutsideClick } from '~/hooks/useDetectOutsideClick'

type DateSelectedPopoverProps = {
  setOpen: Function
  message: string
}

const DateSelectedPopover:FC<DateSelectedPopoverProps> = ({setOpen, message}) => {
  const ref = useRef<HTMLDivElement>(null)
  useDetectOutsideClick(ref, setOpen(false), true)

  return (
    <div ref={ref} className='rounded text-sm w-max shadow-lg border bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60px] z-10'>
      <div className='px-3 py-2'>
        <p>{message}</p>
      </div>
      <div className='relative flex justify-center'>
        <div className='bg-white absolute w-3 h-3 transform rotate-45 -mt-2'></div>
      </div>
    </div>
  )
}

export default DateSelectedPopover
