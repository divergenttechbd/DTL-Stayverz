'use client'

import { CheckCircle } from '@phosphor-icons/react/dist/ssr/CheckCircle'
import { FC } from 'react'
import { ISelectableOptionProps } from '~/components/form/inputs/multiSelectInput/Options/SelectableCard'

const CardUserType: FC<ISelectableOptionProps> = ({
  item,
  isSelected,
  disabled,
  onSelect,
}) => {
  return (
    <div className='w-1/2 p-1 '>
      <div
        className={`stayverz-checkbox pt-[8px] card cursor-pointer flex items-center justify-center border-[1px] border-solid border-[#B0B0B0] text-[#202020] rounded-[8px] relative ${
          isSelected
            ? 'outline outline-1 rounded-md !border-[#f66c0e] !text-[#f66c0e] selected'
            : disabled ? '!text-gray-500 !cursor-not-allowed' : 'hover:outline hover:outline-1 hover:rounded-md hover:border-[#f66c0e] hover:text-[#f66c0e] '
        }`}
        onClick={() => onSelect(item.id)}
      >
        {isSelected 
        && 
        <CheckCircle size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px] absolute top-[5px] right-[7px]' color='#FC5F2B'/>}
        
        <div className='flex flex-col justify-center p-1 w-full text-center content-center rounded-[6px]'>
          <div className='w-full flex justify-center mb-[15px] stayverz-checkbox-icon'><span className='text-center '>{item.icon}</span></div>
          {item?.iconActive && 
          <div className='w-full flex justify-center mb-[15px] stayverz-checkbox-icon selected'><span className='text-center '>{item?.iconActive}</span></div>}
          <p className='mb-[10px] text-center text-[12px] font-medium leading-[17px] '>{item.name}</p>
        </div>
      </div>
    </div>
  )
}

export default CardUserType
