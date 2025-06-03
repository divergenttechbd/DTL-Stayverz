'use client'
import React, { FC, ReactNode } from 'react'
import NotificationDropdown from '~/app/all-notification/components/NotificationDropdown'
import Dropdown from '~/components/layout/Dropdown'
import SiteBranding from '~/components/layout/SiteBranding'
import { useAppStore } from '~/store/appStore'

export type DropdownMenu = {
  key: string
  label: React.ReactNode
  path?: string,
  onClick?: (args: { onClose: () => void }) => void
}

type NavbarProps = {
  className?: string
  renderDropdownToggler: ({ }: { toggle: () => void }) => ReactNode
  dropdownMenus: DropdownMenu[]
  navMenu?: ReactNode
  extraAction?: ReactNode
  wrapInContainer?: boolean
  showDropdownSection?:boolean
}

export const Navbar: FC<NavbarProps> = ({ className, navMenu, renderDropdownToggler, dropdownMenus, extraAction, wrapInContainer = true ,showDropdownSection = true}) => {
  const { extendedNavbar,fullScreenSearch } = useAppStore()
  
  return (
    <div className={`fixed top-0 z-[20] w-full shadow-[0px_4px_4px_0px_#C6B9B917] bg-white py-4 h-navbar transition-all duration-300 ${extendedNavbar ? 'navbar-extended-styles' : ''} ${className} ${fullScreenSearch  ? 'hidden' : 'flex items-center'}`}>
      <div className={`${wrapInContainer ? 'xl:container px-4 xl:px-0' : 'mx-auto px-5  '}  w-full `}> {/* sm:px-24 */}
        <div className='w-full flex justify-between items-center'>
          {/* Left Section */}
          <div className='flex items-center gap-4 w-[102px] h-[32px]'>
            <SiteBranding />
          </div>
          {/* Middle Section */}
          <div className='flex items-center gap-0 mx-auto'>
            {navMenu}
          </div>
          {/* Right Section */}
          <div className='hidden sm:flex items-center gap-3 justify-end'>
            {extraAction}
            {
              showDropdownSection &&  
              (
                <>
                  <NotificationDropdown />
                  <Dropdown menus={dropdownMenus} renderToggler={renderDropdownToggler}  menuClass='!p-0'/>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
