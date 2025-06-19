'use client'

import Image from 'next/image'
import { FC } from 'react'
import { ISelectableOptionProps } from '~/components/form/inputs/multiSelectInput/Options/SelectableCard'

const SelectableList: FC<ISelectableOptionProps> = ({
  item,
  isSelected,
  onSelect,
}) => {
  return (
    <div className='w-full p-2'>
      <div
        className={`card cursor-pointer flex outline outline-1 rounded-lg text-[#202020] ${
          isSelected
            ? 'outline outline-2 outline-[#f66c0e] rounded-lg !text-[#f66c0e]'
            : 'outline-gray-300 hover:outline hover:outline-2 hover:outline-[#f66c0e] hover:rounded-lg hover:text-[#f66c0e]'
        }`}
        onClick={() => onSelect(item.id)}
      >
        <div className='flex flex-row items-center justify-between p-5 w-full'>
          <div>
            <h1 className='text-[18px] font-medium'>{item.name}</h1>
            <p className='text-[14px]'>{item.short_description}</p>
          </div>
          <Image src={`${item.icon}`} alt='' width={32} height={32} />
        </div>
      </div>
    </div>
  )
}

export default SelectableList
