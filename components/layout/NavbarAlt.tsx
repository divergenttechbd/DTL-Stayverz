
import { HouseSimple } from '@phosphor-icons/react/dist/ssr/HouseSimple'
import Image from 'next/image'
import Link from 'next/link'
import Avatar from '~/public/images/avatar.svg'
import MenuIcon from '~/public/images/menu-line-horizontal.svg'
import Logo from '~/public/images/stayverz.png'


const menus = [
  {
    label: 'Home',
    path: '/',
    icon: <HouseSimple size={14} />,
    className:'text-[#202020] border border-solid border-gray-300 px-[12px] py-[8px] rounded-[50px]'
    
  },
  {
    label: 'Listing',
    path: '/room-list',
    icon: '',
    active: false
  },
  {
    label: 'Service',
    path: '#',
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
    path: '#',
    icon: '',
    active: false
  },
]

const NavbarAlt = () => {
  return  (  
    <header 
      className='stayverz-nav hidden md:block  shadow-[0px_4px_4px_0px_#C6B9B917] py-[17px] bg-[#ffffff]'
    >
      <div className={`xl:container px-4 xl:px-0`}>
        <div className='w-full flex items-center justify-between'>
          <Link href={'/'} className='flex justify-start items-center'>
            <Image src={Logo} alt='stayverz logo' width={140} height={27} className='max-w-[140px] h-auto'/>
          </Link>
          <div className='hidden lg:flex'>
            <ul className='flex justify-center items-center gap-8'>
              {menus.map(item => 
                <li key={item.label}>
                  <Link href={item.path} className={`text-sm font-medium leading-6 tracking-normal text-[#616161] flex justify-center items-center gap-1 ${item.className || ''}`}>{item.icon || ''} {item.label}</Link>
                </li>) 
              }
            </ul>
          </div>
          <div className='hidden lg:flex'> 
            <ul className='flex justify-end items-center gap-[10px]'>
              <li className='flex justify-center items-center'>
                <button className='flex justify-center items-center gap-[10px] px-[10px] py-[6px] border border-solid border-[#FDCDBE] rounded-[8px]'>
                  <div className='px-[8px] py-[7px] rounded-[30px]' style={{background:' linear-gradient(182.07deg, rgba(241, 89, 39, 0) -68.03%, rgba(241, 89, 39, 0.46772) -13.86%, #F15927 98.26%)'}}>
                    <Image src={Avatar} alt='login avatar ' width={12} height={15} className='max-w-[12px] h-auto'/>  
                  </div>
                  <div className='text-[#202020] text-sm font-medium'>Login</div>
                </button>
              </li>
              <li className='flex justify-center items-center'>
                <button className='flex justify-center items-center gap-[10px] px-[20px] py-[11px] rounded-[8px] bg-[#F15927]'>
                  <div className='text-[#ffffff] text-sm font-medium'>Sign Up</div>
                </button>
              </li>
            </ul>
          </div>
          <div className='flex lg:hidden justify-center items-center'> 
            <button className='p-[8px]'>
              <Image src={MenuIcon} width={20} height={15} alt='menu' className='max-w-[20px] min-w-[20px] h-auto'/>
            </button>
          </div>
        </div>
      </div>
    </header>)
}

export default NavbarAlt
