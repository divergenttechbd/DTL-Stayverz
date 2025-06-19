'use client'

import { CheckCircle } from '@phosphor-icons/react/dist/ssr/CheckCircle'
import Image from 'next/image'
import { FC } from 'react'
import { IOptionProps } from '~/components/form/inputs/multiSelectInput/MultiSelectInput'

export interface ISelectableOptionProps {
  item: IOptionProps;
  isSelected: boolean;
  disabled?: boolean;
  onSelect: (itemId: number | string) => void;
}

const SelectableCard: FC<ISelectableOptionProps> = ({
  item,
  isSelected,
  onSelect,
}) => {
  return (
    <div className='w-1/2 sm:w-1/3 p-2'>
      <div
        className={`stayverz-checkbox card cursor-pointer flex items-center justify-center outline outline-1  rounded-lg text-[#202020]  relative  ${
          isSelected
            ? 'outline outline-1 rounded-md !border-[#f66c0e] !text-[#f66c0e] selected '
            : 'outline-gray-300 hover:outline hover:outline-1 hover:border-[#f66c0e] hover:text-[#f66c0e] hover:rounded-lg hover:outline-[#f66c0e]'
        }`}
        onClick={() => onSelect(item.id)}
      >
        {isSelected 
        && 
        <CheckCircle size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px] absolute top-[5px] right-[7px]' color='#FC5F2B'/>}
        <div className='flex flex-col justify-center p-3 sm:p-4 w-full min-h-[120px] sm:min-h-[max-content]'>
          <Image src={`${item.icon}`} alt='' width={32} height={32} />
          {/* <div className='w-full flex justify-center mb-[15px] stayverz-checkbox-icon'><span className='text-center '>{item.icon}</span></div>
          {item?.iconActive && 
          <div className='w-full flex justify-center mb-[15px] stayverz-checkbox-icon selected'><span className='text-center '>{item?.iconActive}</span></div>} */}
          <p className='mt-2 ellipsis-two-line text-[14px] sm:text-[16px] font-medium'>{item.name}</p>
        </div>
      </div>
    </div>
  )
}

export default SelectableCard
