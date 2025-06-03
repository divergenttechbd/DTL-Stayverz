'use client'

import { FC } from 'react'
import { IOptionProps } from '~/components/form/inputs/multiSelectInput/MultiSelectInput'

interface IPillSelectProps {
  item: IOptionProps
  isSelected: boolean
  onSelect: (itemId: number | string) => void
  className?: string
}

const PillSelect: FC<IPillSelectProps> = ({
  item,
  isSelected,
  onSelect,
}) => {
  return (
    <div className='my-2 lg:my-5 mr-1'>
      <div
        className={`py-2 lg:py-3 px-5 lg:px-7 card cursor-pointer flex items-center justify-center border-[1px] border-solid border-[#B0B0B0] text-[#222222 rounded-full text-[#202020]  ${isSelected
          ? 'outline outline-1 text-[#ffffff] bg-[#f66c0e] !border-[#f66c0e]'
          : 'hover:outline hover:outline-1 hover:outline-[#f66c0e] hover:border-[#f66c0e] hover:text-[#f66c0e]'
        }`}
        onClick={() => onSelect(item.id)}
      >

        <p className=' text-center text-[12px] font-[600] leading-[17px]'>{item.name}</p>

      </div>
    </div>
  )
}

export default PillSelect
