import { FC } from 'react'
import { ISelectableOptionProps } from '~/components/form/inputs/multiSelectInput/Options/SelectableCard'

const LanguageCheckbox:FC<ISelectableOptionProps> = ({
  item,
  isSelected,
  onSelect,
}) => {
  return (
    <div 
      onClick={() => onSelect(item.id)} 
      className='flex justify-between items-center border-b border-gray-400 py-5 cursor-pointer'
    >
      <span className='text-[16px] text-[#202020]'>{item.name}</span>
      <div className={`w-6 h-6 relative rounded-[3px] ${isSelected ? 'bg-[#222222]' : 'border border-[#5e5e5e]'}`}>
        <div className={`absolute w-1.5 h-3 border-r-[0.14rem] border-b-[0.14rem] left-0 right-0 top-1 bottom-0 mx-auto rotate-45 ${isSelected ? 'block' : 'hidden'}`}></div>
      </div>
    </div>
  )
}


export default LanguageCheckbox
