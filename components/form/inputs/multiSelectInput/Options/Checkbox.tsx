'use client'

import { FC } from 'react'
import { ISelectableOptionProps } from '~/components/form/inputs/multiSelectInput/Options/SelectableCard'


const Checkbox: FC<ISelectableOptionProps> = ({
  item,
  isSelected,
  onSelect,
}) => {
  return (
    <div className='w-full my-3'>
      <div onClick={() => onSelect(item.id)} className='flex justify-start items-center gap-2 w-[max-content] cursor-pointer'>
        <div className={`w-6 h-6 relative rounded-[3px] ${isSelected ? 'bg-[#f66c0e]' : 'border border-[#5e5e5e]'}`}>
          <div className={`absolute w-1.5 h-3 border-r-[0.14rem] border-b-[0.14rem] left-0 right-0 top-1 bottom-0 mx-auto rotate-45 ${isSelected ? 'block' : 'hidden'}`}></div>
        </div>
        <div>
          <p className='text-[16px] text-[#202020]'>{item.name}</p>
        </div>
      </div>
    </div>
  )
}

export default Checkbox
