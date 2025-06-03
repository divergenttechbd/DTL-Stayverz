
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menus = [
  {
    label: 'Home',
    path: '/',
    icon: '',
    className:''
    
  },
  {
    label: 'Listing',
    path: '/room-list',
    icon: '',
    active: false
  },
  {
    label: 'Blog',
    path: '/blog',
    icon: '',
    active: false
  },
  {
    label: 'About',
    path: '/aboutus',
    icon: '',
    active: false
  },
  {
    label: 'Contact',
    path: '/contact',
    icon: '',
    active: false
  },
]


const NavMenus = () => {

  const pathname = usePathname()

  return (
    <div className='hidden lg:flex'>
      <ul className='flex justify-center items-center gap-8'>
        {menus.map(item => 
          <li key={item.label}>
            <Link href={item.path} 
              className={`text-sm font-medium leading-6 tracking-normal flex justify-center items-center gap-1 
              ${pathname === item.path  ? 'text-[#202020] px-[20px] py-[8px] rounded-[50px] border border-solid border-gray-300' : 'text-[#616161]'}`}>
              {item.icon || ''} {item.label}
            </Link>
          </li>) 
        }
      </ul>
    </div>)
}
export default NavMenus
