import { CaretDown } from '@phosphor-icons/react'
import Image from 'next/image'
import React from 'react'

type ListingDropdownTogglerProps = {
 onToggle: React.MouseEventHandler<HTMLButtonElement>;
 title: string;
 imgUrl: string | null;
}
export const ListingDropdownToggler = ({ onToggle, title ,imgUrl}: ListingDropdownTogglerProps) => {
  return (
    <button 
      className='py-2 sm:py-1.5 px-4 sm:px-2 mr-2 mb-2 hover:border-black hover:outline-2 rounded-full border border-gray-400 min-w-[250px] max-w-[250px]' 
      type='button' 
      onClick={onToggle}
    >
      <div className='w-full flex justify-between items-center gap-1'>
        <div className='flex justify-start items-center relative '>
          <div className='border-[2px] rounded-full w-[35px] h-[35px]'>
            <Image
              src={imgUrl || ''}
              alt='profile-image'
              fill
              className='rounded-full relative object-cover'
            />
          </div>
        </div>
        <div className='flex-1 flex items-center justify-between'>
          <p className='border-r border-gray-700 pr-2 mr-2  min-w-[170px] max-w-[170px] sm:min-w-[150px] sm:max-w-[150px] text-[12px] sm:text-[14px] ellipsis-one-line'>{title}</p>
          <CaretDown/>
        </div>
      </div>
    </button>
  )
}
