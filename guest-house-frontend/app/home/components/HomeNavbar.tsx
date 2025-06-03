'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo } from 'react'
import { DropdownToggler } from '~/app/home/components/DropdownToggler'
import { ExtraNavbarActions } from '~/app/home/components/ExtraNavbarActions'
import NavMenus from '~/app/home/components/NavMenus'

import { DropdownMenu, Navbar } from '~/components/layout/Navbar'
import { AuthStore, useAuthStore } from '~/store/authStore'

export type HomeNavbarDropdownMenu = DropdownMenu & {
  key: 'LOG_IN' | 'SIGN_UP'
}

type HomeNavbarProps = {
  wrapInContainer?: boolean
}

export const HomeNavbar = ({ wrapInContainer = true }: HomeNavbarProps) => {
  const router = useRouter()
  const { isAuthenticated, logOut, userData } = useAuthStore()
  const { u_type: user_type } = userData || {}

  const handleSetActiveDropdown = useCallback((status?: AuthStore['authFlow']) => {
    useAuthStore.setState({ authFlow: status })
  }, [])

  const handleLogout = useCallback(() => {
    logOut()
    if ((window as any).flutterChannel) {
      (window as any).flutterChannel.postMessage('successLogout')
    }
    router.push('/')
  }, [logOut, router])

  const dropdownMenus = useMemo(() => {
    // if is isAuthenticated
    return  [
      { key: 'PROFILE', label: 'Profile', path: '/profile' },
      { key: 'MY_TRIPS', label: 'Trips', path: '/trips' },
      ...user_type === 'guest' ? [
        { key: 'MESSAGES', label: 'Messages', path: '/messages' },
        { key: 'WISHLISTS', label: 'Wishlists', path: '/wishlists'}
      ] : [],
      {
        key: 'CHANGE_PASSWORD', label: 'Change password', onClick: ({ onClose }) => {
          handleSetActiveDropdown('CHANGE_PASSWORD')
          onClose()
        }
      },
      {
        key: 'LOG_OUT', label: 'Log out', onClick: ({ onClose }) => {
          onClose()
          handleLogout()
        }
      },
    ] as HomeNavbarDropdownMenu[]
  }, [handleSetActiveDropdown, handleLogout, user_type])

  useEffect(() => {
    return () => {
      handleSetActiveDropdown()
    }
  }, [handleSetActiveDropdown])

  return (
    <Navbar
      navMenu={<NavMenus />}
      renderDropdownToggler={({ toggle }) => <DropdownToggler onToggle={toggle} />}
      extraAction={<ExtraNavbarActions />}
      dropdownMenus={dropdownMenus}
      showDropdownSection={isAuthenticated ? true : false}
      wrapInContainer={wrapInContainer}
    />
  )
}




