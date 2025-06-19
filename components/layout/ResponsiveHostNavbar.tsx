'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { FC, useMemo } from 'react'
import MobileNavbar from '~/components/layout/MobileNavbar'
import { HostNavbar } from '~/components/navbar/HostNavbar'
import useWindowSize from '~/hooks/useWindowSize'

type ResponsiveHostNavbarPropsType = {
  showMobileNav?: boolean
  wrapInContainer?: boolean
}

const mobileNavbarPaths = [
  '/host-dashboard',
  '/host-dashboard/calendar-listings',
  '/host-dashboard/reservations',
  '/host-dashboard/earnings',
  '/host-dashboard/menu',
  '/host-dashboard/inbox',
  '!/host-dashboard/inbox?conversation_id',
  '/profile',
  '/profile/verify-profile',
  '/blog',
  '/contact',
  '/aboutus'
]

const ResponsiveHostNavbar: FC<ResponsiveHostNavbarPropsType> = ({ showMobileNav = true, wrapInContainer = true }) => {
  const { isMobileView } = useWindowSize()
  const currentPath = usePathname()
  const searchParams = useSearchParams()
  const isValidMobileNavbarPaths = useMemo(() => {
    let result = false
    for (const pathWithParams of mobileNavbarPaths) {
      const [path, ...pathParams] = pathWithParams.split('?')
      const isOmit = path.startsWith('!')
      const sanitizedPath = path.replace(/\!/, '')
      if (sanitizedPath === currentPath) {
        const isValid = !pathParams.length || pathParams.every(i => searchParams.get(i))
        result = isOmit ? !isValid : isValid
      }
    }
    return result
  }, [currentPath, searchParams])
  return (
    <>
      {isMobileView ?
        showMobileNav && isValidMobileNavbarPaths ?
          <MobileNavbar /> : null
        :
        <HostNavbar />
      }
    </>
  )
}

export default ResponsiveHostNavbar
