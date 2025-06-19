'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo } from 'react'
import { DropdownToggler } from '~/app/home/components/DropdownToggler'
import { DropdownMenu, Navbar } from '~/components/layout/Navbar'
import { AuthStore, useAuthStore } from '~/store/authStore'

type HomeNavbarDropdownMenu = DropdownMenu & {
  key: 'LOG_IN' | 'SIGN_UP'
}

export const CheckoutNavbar = () => {
  const router = useRouter()
  const { isAuthenticated, logOut } = useAuthStore()

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
    return isAuthenticated ?
      [
        { key: 'PROFILE', label: 'My Profile', path: '/profile' },
        { key: 'MY_TRIPS', label: 'Trips', path: '/trips' },
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
      ] as HomeNavbarDropdownMenu[] :
      [
        {
          key: 'LOG_IN', label: 'Log in', onClick: ({ onClose }) => {
            handleSetActiveDropdown('LOG_IN')
            onClose()
          }
        },
        {
          key: 'SIGN_UP', label: 'Sign up', onClick: ({ onClose }) => {
            handleSetActiveDropdown('SIGN_UP')
            onClose()
          }
        },
      ] as HomeNavbarDropdownMenu[]
  }, [isAuthenticated, handleSetActiveDropdown, handleLogout])

  useEffect(() => {
    return () => {
      handleSetActiveDropdown()
    }
  }, [handleSetActiveDropdown])

  return (
    <Navbar
      renderDropdownToggler={({ toggle }) => <DropdownToggler onToggle={toggle} />}
      dropdownMenus={dropdownMenus}
      wrapInContainer={true}
    />
  )
}




