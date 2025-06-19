'use client'
import { FC } from 'react'
import { HomeNavbar } from '~/app/home/components/HomeNavbar'
import MobileNavbar from '~/components/layout/MobileNavbar'
import useWindowSize from '~/hooks/useWindowSize'
import { useAppStore } from '~/store/appStore'

type ResponsiveNavbarPropsType = {
  showMobileNav?: boolean
  wrapInContainer?: boolean
  showDesktopNavInMobileView?: boolean
}

const ResponsiveNavbar: FC<ResponsiveNavbarPropsType> = ({ showMobileNav = true, wrapInContainer = true, showDesktopNavInMobileView = true }) => {
  const { isMobileView } = useWindowSize()
  const { extendedNavbar,fullScreenSearch } = useAppStore()
  // 
  return (
    <div>
      {!fullScreenSearch && 
      <>
        {(showDesktopNavInMobileView  || !isMobileView) &&  <HomeNavbar wrapInContainer={wrapInContainer} />} 
        {(showMobileNav  && isMobileView ) &&  <MobileNavbar />  }
      </>
        
      }
    </div>
  )
}

export default ResponsiveNavbar
