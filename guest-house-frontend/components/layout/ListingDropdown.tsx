'use client'

import { List } from '@phosphor-icons/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, MouseEventHandler, useCallback, useRef, useState } from 'react'
import { useDetectOutsideClick } from '~/hooks/useDetectOutsideClick'

export type ListingDropdownMenu = {
  key: string
  imgUrl: string
  label: React.ReactNode
  path?: string,
  onClick?: (args: {onClose: ()=> void}) => void
}

type DropdownProps = {
  menus: ListingDropdownMenu[],
  renderToggler?: ({toggle,isShown}: {toggle: () => void, isShown: boolean}) => React.ReactNode
  menuClass?: string
}

const ListingDropdown: FC<DropdownProps> = ({ menus, renderToggler, menuClass }) => {
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
        <div className={`absolute top-10 z-20 bg-white right-0 rounded-lg shadow min-w-[300px]  max-w-[300px] mt-4 ${menuClass || ''} overflow-x-hidden`}>
          <ListingDropdownMenus menus={menus} onClose={handleCloseMenus} />
        </div>
      ) : null}
    </div>
  )
}

interface ListingDropdownMenusProps {
  menus: ListingDropdownMenu[]
  onClose: () => void
}

export const ListingDropdownMenus:FC<ListingDropdownMenusProps> = ({
  menus=[],
  onClose
}) => {
  const router = useRouter()
  const handleClick = useCallback((menu: ListingDropdownMenu) => () => {
    menu?.onClick?.({ onClose })
    if (menu.path) router.push(menu.path)
  }, [onClose, router])

  const handleLinkClick: MouseEventHandler = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation
  }, [])

  return (
    <ul className='w-full h-[450px] overflow-y-auto scrollbar-hidden'>
      {menus.map((menu) => (
        <li key={menu.key} className='py-4 pl-4 pr-2 hover:bg-gray-50 cursor-pointer flex justify-start items-center gap-3'
          onClick={handleClick(menu)}
        >
          <div className='flex justify-start items-center min-w-[70px] max-w-[70px]'>
            <Image src= {menu.imgUrl} alt={menu.key}  height={100} width={100} className='rounded-md aspect-[16/11] object-cover'/>
          </div>
          <div className=''>
            <span className=' font-semibold text-[#222222] text-[16px] ellipsis-one-line'>{menu.path ? (<a href={menu.path} onClick={handleLinkClick}>{menu.label}</a>) : menu.label}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ListingDropdown
