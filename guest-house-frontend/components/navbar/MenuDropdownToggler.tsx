import { FC } from 'react'
import { CaretDown } from '@phosphor-icons/react'

type DropdownTogglerProps = {
  onToggle: () => void;
  isShown: boolean
}
const MenuDropdownToggler:FC<DropdownTogglerProps> = ({ onToggle,isShown }) => {
  return (
    <>
      <button 
        className={`flex text-sm items-center gap-1 py-[10px] px-4 hover:bg-grayBg rounded-[42px] box-border border-2 border-transparent ${ isShown ? '!border-[black]' : '' }`}
        type='button' 
        onClick={onToggle}>
        <span className='sr-only'>Open user menu</span>
        <span className='text-grayText font-semibold'>Menu </span><CaretDown size={13} />
      </button>
    </>
  )
}

export default MenuDropdownToggler
