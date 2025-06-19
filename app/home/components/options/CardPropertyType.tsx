'use client'

import { CheckCircle } from '@phosphor-icons/react/dist/ssr/CheckCircle'
import { FC } from 'react'
import { IOptionProps } from '~/components/form/inputs/multiSelectInput/MultiSelectInput'

interface ICardPropertyTypeProps {
  item: IOptionProps
  isSelected: boolean
  onSelect: (itemId: number | string) => void
}

const CardPropertyType: FC<ICardPropertyTypeProps> = ({
  item,
  isSelected,
  onSelect,
}) => {
  return (
    <div className='flex-1 me-2 my-2'>
      <div
        className={`stayverz-checkbox pt-[8px] card cursor-pointer flex items-center justify-center border-[1px] border-solid border-[#B0B0B0] rounded-[8px] relative ${isSelected
          ? 'outline outline-1 rounded-md !border-[#f66c0e] !text-[#f66c0e] selected'
          : 'hover:outline hover:outline-1 hover:rounded-md hover:border-[#f66c0e] hover:text-[#f66c0e]'
        }`}
        onClick={() => onSelect(item.id)}
      >
        {isSelected 
        && 
        <CheckCircle size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px] absolute top-[5px] right-[7px]' color='#FC5F2B'/>}
        <div className='px-2 lg:px-5 py-2 flex flex-col justify-start items-start  w-full text-start content-start rounded-[6px]'>
          {/* <div className='w-full flex justify-start mb-[10px] lg:mb-[15px]'>{item.icon}</div> */}
          <div className='w-full flex justify-start mb-[15px] stayverz-checkbox-icon'><span className='text-center'>{item.icon}</span></div>
          {item?.iconActive && 
          <div className='w-full flex justify-start mb-[15px] stayverz-checkbox-icon selected'><span className='text-center '>{item?.iconActive}</span></div>}
          <p className='ps-1 mb-[10px] text-start text-[12px] leading-[17px] font-medium'>{item.name}s</p>
        </div>
      </div>
    </div>
  )
}

export default CardPropertyType
