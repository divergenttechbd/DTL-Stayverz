import { EnvelopeSimple, FacebookLogo, InstagramLogo, MapPin, PhoneCall, TiktokLogo, WhatsappLogo } from '@phosphor-icons/react'

export default function ContactInfo() {
  return(
    <div className='lg:w-[40%] bg-[#f3f2f1] m-3 rounded-xl p-5 lg:p-10 text-center lg:text-left'>
      <h3 className='text-2xl font-semibold'>Contact Information</h3>
      <p className='text-sm text-grayText lg:text-black lg:text-xl mt-3'>Say Something to start a live chat!</p>
      
      <div className='mt-5 lg:mt-20 flex flex-col gap-4 text-base'>
        <p className='flex-col lg:flex-row flex items-center gap-4'>
          <span><PhoneCall size={32} color='#f15927' weight='fill' /></span>
          09606292909
        </p>
        <p className='flex-col lg:flex-row flex items-center gap-4'>
          <span><WhatsappLogo size={32} color='#f15927' weight='fill' /></span>
          01879997999
        </p>
        <p className='flex-col lg:flex-row flex items-center gap-4'>
          <span><EnvelopeSimple size={32} color='#f15927' weight='fill' /></span>
          Hello@stayverz.com
        </p>
        <p className='flex-col lg:flex-row flex items-center gap-4'>
          <span><MapPin size={32} color='#f15927' weight='fill' /></span>
          97 Meghmallar Suhrawardy Avenue Baridhara Diplomatic Zone Dhaka
        </p>
      </div>

      <div className='mt-10 lg:mt-32 flex gap-5 justify-center lg:justify-start'>
        <a href='https://www.facebook.com/StayverzApp'>
          <FacebookLogo size={32} color='#f15927' weight='fill' />
        </a>
        <a href='https://www.instagram.com/stayverz_app?igsh=NWk2bjBneDk2dzZy'>
          <InstagramLogo size={32} color='#f15927' weight='fill' />
        </a>
        <a href='https://www.tiktok.com/@stayverz?_t=8lhvGs1IARL&_r=1'>
          <TiktokLogo size={32} color='#f15927' weight='fill' />
        </a>
      </div>
    </div>
  )
}
