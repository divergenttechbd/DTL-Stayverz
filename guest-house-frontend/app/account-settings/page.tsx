
'use client'
import { AddressBook, Article, Info } from '@phosphor-icons/react'
import { CaretRight } from '@phosphor-icons/react/dist/ssr/CaretRight'
import { ChatText } from '@phosphor-icons/react/dist/ssr/ChatText'
import { Heart } from '@phosphor-icons/react/dist/ssr/Heart'
import { LockKey } from '@phosphor-icons/react/dist/ssr/LockKey'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import NotificationDropdown from '~/app/all-notification/components/NotificationDropdown'
import Avatar from '~/components/Images/Avatar'
import Button from '~/components/layout/Button'
import { NavigationItem } from '~/components/layout/MobileNavbar'
import ResponsiveNavbar from '~/components/layout/ResponsiveNavbar'
import { useAuthStore } from '~/store/authStore'
import { styles } from '~/styles/classes'

const AccountSettings = () => {
  const router = useRouter()
  const { isAuthenticated, userData, logOut } = useAuthStore()

  const handleRouting = useCallback((pathName: string) => {
    if (isAuthenticated || pathName === '/') {
      router.push(pathName)
    } else {
      useAuthStore.setState({ authFlow: 'LOG_IN' })
    }
  }, [isAuthenticated, router])

  const handleMenuClick = useCallback((menuItem: NavigationItem) => {
    return () => {
      if (menuItem.action) {
        menuItem.action()
      } else {
        handleRouting(menuItem.pathName || '/')
      }
    }
  }, [handleRouting])

  const handleLogout = useCallback(() => {
    logOut()

    if ((window as any).flutterChannel) {
      (window as any).flutterChannel.postMessage('successLogout')
    }

    router.push('/')
  }, [logOut, router])

  const handleSwitchToHost = useCallback(() => {
    useAuthStore.setState({ authFlow: 'HOST_LOG_IN' })
  }, [])


  const menus: NavigationItem[] = useMemo(() => [
    {
      key: 'CHANGE_PASSWORD',
      label: 'Change Password',
      icon: (color: string, size: number) => <LockKey size={size} color={color} />,
      action: () => useAuthStore.setState({ authFlow: 'CHANGE_PASSWORD' })
    },
    {
      key: 'WISHLISTS',
      label: 'My Wishlists',
      icon: (color: string, size: number) => <Heart size={size} color={color} />,
      pathName: '/wishlists',
    },
    {
      key: 'BLOGS',
      label: 'Blogs',
      icon: (color: string, size: number) => <Article size={size} color={color} />,
      pathName: '/blog',
    },
    {
      key: 'ABOUT_US',
      label: 'About Us',
      icon: (color: string, size: number) => <Info size={size} color={color} />,
      pathName: '/aboutus',
    },
    {
      key: 'CONTACT_US',
      label: 'Contact Us',
      icon: (color: string, size: number) => <AddressBook size={size} color={color} />,
      pathName: '/contact',
    },
    {
      key: 'MESSAGES',
      label: 'All Messages',
      icon: (color: string, size: number) => <ChatText size={size} color={color} />,
      pathName: '/messages',
    },
  ], [])


  return (
    <main className='w-full'>
      <ResponsiveNavbar wrapInContainer={false} />
      <div className='pt-navbar'>
        <div className='w-full min-h-screen flex flex-col p-5 pb-[100px] space-y-10'>
          <div className='w-full h-full  space-y-5'>
            {/* PROFILE */}
            <div className='flex justify-between items-center gap-1'>
              <div>
                <h1 className='text-[26px] text-[#202020] font-medium'>
                  Profile
                </h1>
              </div>
              <div className={`${styles.flexCenter}`}>
                {/* <Bell fill='#222222' size={25} /> */}
                <NotificationDropdown/>
              </div>
            </div>
            {/* USER */}
            <Link href={'/profile'} className='flex justify-between items-center pb-4 border-b'>
              <div className='flex justify-start items-center gap-5'>
                <div className='flex justify-center items-center relative'>
                  <div className='border-[2px] rounded-full w-[50px] h-[50px]'>
                    {userData?.image ?
                      <Image
                        src={userData.image}
                        alt='profile-image'
                        fill
                        className='rounded-full relative object-cover'
                      />
                      : <Avatar />}

                  </div>
                </div>
                <div>
                  <h2 className='text-[20px] text-[#202020] font-medium'>
                    {userData?.full_name}
                  </h2>
                  <p className='text-[#717171] text-[14px] font-[600]'>
                    Show profile
                  </p>
                </div>
              </div>
              <div className={`${styles.flexCenter}`}>
                <CaretRight size={20} color='#717171' />
              </div>
            </Link>
            {/* Account */}
            <div className='space-y-5'>
              <div>
                <h2 className='text-[20px] text-[#202020] font-medium'>
                  Account
                </h2>
              </div>
              <ul className='space-y-5'>
                {menus.map((item, index) => (
                  <li onClick={handleMenuClick(item)} key={item.key} className={`flex justify-between items-center pb-4 border-b`}>
                    <div className='flex justify-start items-center gap-3'>
                      <div className={`${styles.flexCenter}`}>
                        {item.icon('#222222', 20)}
                      </div>
                      <p className='text-[#202020] text-[14px]  font-medium'>{item.label}</p>
                    </div>
                    <div className={`${styles.flexCenter}`}>
                      <CaretRight size={20} color='#222222' />
                    </div>
                  </li>
                ))}

              </ul>
            </div>
          </div>

          {/* BUTTON */}
          <div className='space-y-5 h-full'>
            <Button label='Switch to Hosting' variant={'outlined'} className='w-full py-2' onclick={handleSwitchToHost} />
            <Button label='Log Out' variant={'primary'} className='w-full py-3 !text-sm' onclick={handleLogout} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default AccountSettings
