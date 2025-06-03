import { CaretDown } from '@phosphor-icons/react'
import React from 'react'

type DropdownTogglerProps = {
 onToggle: React.MouseEventHandler<HTMLButtonElement>;
 title: string;
}
export const YearDropdownToggler = ({ onToggle, title }: DropdownTogglerProps) => {
  return (
    <button className='flex py-2 sm:py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-[#202020] hover:border-black hover:outline-2 rounded-full border border-gray-400' type='button' onClick={onToggle}>
      <span className='sr-only'>Open user menu</span>
      <span className='text-sm flex items-center'>
        <p className='border-r border-gray-700 pr-2 mr-2 text-[12px] sm:text-[14px]'>{title}</p>
        <CaretDown/>
      </span>
    </button>
  )
}
