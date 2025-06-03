'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Logo from '~/public/images/stayverz.png'

const SiteBranding = () => {
  const router = useRouter()

  return ( 

   
    <Image
      onClick={() => router.push('/')}
      src={Logo} alt='stayverz logo' width={140} height={27} className='max-w-[140px] h-auto cursor-pointer'
    />
  
  )
}
export default SiteBranding
