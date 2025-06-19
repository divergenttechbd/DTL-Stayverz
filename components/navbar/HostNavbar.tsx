'use client'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { HomeNavbarDropdownMenu } from '~/app/home/components/HomeNavbar'
import { DropdownMenu, Navbar } from '~/components/layout/Navbar'
import { DropdownToggler } from '~/components/navbar/DropdownToggler'
import HostNavMenu from '~/components/navbar/HostNavMenu'
import { AuthStore, useAuthStore } from '~/store/authStore'
type HostNavbarDropdownMenu = DropdownMenu & {
  key: 'PROFILE' | 'ACCOUNT' | 'SWITCH_TO_GUEST' | 'LOG_OUT'
}
export const HostNavbar = () => {
  const router = useRouter()
  const { userData, isAuthenticated, logOut } = useAuthStore()

  // const handleLogout = useCallback(() => {
  //   logOut()
  //   router.push('/')
  // },[logOut, router])
  const handleLogout = useCallback(async () => {
    try {
      await logOut()
      console.log('Logout successful from navbar handleLogout()')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      router.push('/')
    }
    if ((window as any).flutterChannel) {
      (window as any).flutterChannel.postMessage('successLogout')
    }
  }, [logOut, router])

  const handleSetActiveDropdown = useCallback((status?: AuthStore['authFlow']) => {
    useAuthStore.setState({authFlow: status})
  }, [])

  const handleSwitchToGuest = useCallback(() => {
    useAuthStore.setState({ authFlow: 'GUEST_LOG_IN' })
  }, [])

  const { u_type: user_type } = userData || {}
  const dropdownMenus = useMemo(() => {
    return (user_type === 'guest' || !isAuthenticated) ? [
      { key: 'PROFILE', label: 'Profile', path: '/profile' },
      { key: 'MY_TRIPS', label: 'Trips', path: '/trips' },
      { key: 'MESSAGES', label: 'Messages', path: '/messages' },
      { key: 'WISHLISTS', label: 'Wishlists', path: '/wishlists'},
      {
        key: 'CHANGE_PASSWORD', label: 'Change password', onClick: ({onClose}) => {
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
    ] as HomeNavbarDropdownMenu[] :[
      { key: 'PROFILE', label: 'Profile', path: '/profile'},
      { key: 'ACCOUNT', label: 'Account', path: '/account' },
      {
        key: 'CHANGE_PASSWORD', label: 'Change password', onClick: ({onClose}) => {
          handleSetActiveDropdown('CHANGE_PASSWORD')
          onClose()
        }
      },
      { key: 'SWITCH_TO_GUEST', label: 'Switch to Guest', onClick: handleSwitchToGuest},
      { 
        key: 'LOG_OUT', label: 'Log out', onClick: ({onClose}) => {
          onClose()
          handleLogout()
        }
      }
    ] as HostNavbarDropdownMenu[]
  }, [handleLogout, handleSetActiveDropdown, handleSwitchToGuest, isAuthenticated, user_type])

  return (
    <Navbar
      navMenu={<HostNavMenu />}
      renderDropdownToggler={({toggle}) => <DropdownToggler onToggle={toggle} />}
      dropdownMenus={dropdownMenus}
    />
  )
}





