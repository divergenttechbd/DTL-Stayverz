'use client'

import { List } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { FC, MouseEventHandler, useCallback, useRef, useState } from 'react'
import { useDetectOutsideClick } from '~/hooks/useDetectOutsideClick'

export type DropdownMenu = {
  key: string
  label: React.ReactNode
  path?: string,
  onClick?: (args: {onClose: ()=> void}) => void
}

type DropdownProps = {
  menus: DropdownMenu[],
  renderToggler?: ({toggle,isShown}: {toggle: () => void, isShown: boolean}) => React.ReactNode
  menuClass?: string
}

const Dropdown: FC<DropdownProps> = ({ menus, renderToggler, menuClass }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showMenus, setShowMenus] = useState<boolean>(false)
  
  const handleCloseMenus = useCallback((): void => {
    setShowMenus(false)
  }, [])

  useDetectOutsideClick(containerRef, handleCloseMenus, true)
  
  const handleToggleMenus = useCallback(() => {
    setShowMenus(preValue => !preValue)
  }, [])
  
  return (
    <div ref={containerRef} className='relative'>      
      {renderToggler ? renderToggler({toggle: handleToggleMenus, isShown:showMenus}) : ( 
        <button 
          className='flex items-center gap-x-[15px] border-[1px] border-solid border-[#DDDDDD] rounded-[21px] text-sm p-[5px]' 
          type='button' onClick={handleToggleMenus}>
          <List size={20} />       
        </button>)}
      {showMenus ? (
        <div className={`absolute top-10 z-20 bg-white right-0 rounded-lg shadow  max-w-[200px] mt-4 py-2 ${menuClass || ''} overflow-x-hidden`}>
          <DropdownMenus menus={menus} onClose={handleCloseMenus} />
        </div>
      ) : null}
    </div>
  )
}

interface DropdownMenusProps {
  menus: DropdownMenu[]
  onClose: () => void
}

export const DropdownMenus:FC<DropdownMenusProps> = ({
  menus=[],
  onClose
}) => {
  const router = useRouter()
  const handleClick = useCallback((menu: DropdownMenu) => () => {
    menu?.onClick?.({ onClose })
    if (menu.path) router.push(menu.path)
  }, [onClose, router])

  const handleLinkClick: MouseEventHandler = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation
  }, [])

  return (
    <ul className='text-[#202020] text-sm font-medium'>
      {menus.map((menu) => (
        <li key={menu.key} className='px-4 py-2 hover:bg-gray-100 cursor-pointer ellipsis-one-line whitespace-nowrap'
          onClick={handleClick(menu)}
        >
          {menu.path ? (<a href={menu.path} onClick={handleLinkClick}>{menu.label}</a>) : menu.label}
        </li>
      ))}
    </ul>
  )
}

export default Dropdown
