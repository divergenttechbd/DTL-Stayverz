import { CaretDown } from '@phosphor-icons/react'
import React from 'react'

type DropdownTogglerProps = {
 onToggle: React.MouseEventHandler<HTMLButtonElement>;
 title: string;
}
export const DropdownToggler = ({ onToggle, title }: DropdownTogglerProps) => {
  return (
    <button className='flex  py-2 sm:py-2.5 px-4 sm:px-5 mr-2 mb-2 text-sm font-medium text-[#202020] hover:border-black hover:outline-2 rounded-full border border-gray-400' type='button' onClick={onToggle}>
      <span className='sr-only'>Open user menu</span>
      <span className='text-sm flex items-center'>
        <p className='border-r border-gray-700 pr-2 mr-2 max-w-[170px] sm:max-w-[200px] text-[12px] sm:text-[14px] ellipsis-one-line'>{title}</p>
        <CaretDown/>
      </span>
    </button>
  )
}
