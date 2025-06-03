import Image from 'next/image'
import Link from 'next/link'
import sslzDesktop from '~/public/images/sslz/sslz-desktop.png'
import sslzMobile from '~/public/images/sslz/sslz-mobile.png'
import Logo from '~/public/images/stayverz.png'


const Footer = () => {
  return (
    <footer className='stayverz-footer md:mb-0 md:pb-16 py-8 md:py-16'>
      <div className={`xl:container px-4 xl:px-0`}>
        <div className='w-full space-y-10'>
          {/* ===================== FOOTER TOP SECTION ========================== */}
          <div className='w-full flex flex-col lg:flex-row justify-between items-start gap-10'>
            {/* ===================== FOOTER CTA ========================== */}
            <div className='min-w-[250px] max-w-[250px] flex flex-col gap-3'>
              <div className='flex justify-start items-center mb-1'>
                <Image src={Logo} alt='Stayverz-Logo' width={180} height={37} className='w-auto h-auto'/>
              </div>
              <div>
                <p className='text-xs font-medium leading-4 text-[#2D3845]'>Subscribe on our newsletter to get <br className='hidden md:block'/> our news</p>
              </div>
              <form className='stayverz-cta-form border-[0.75px] border-[#F15927] rounded-[10px] p-1 relative'>
                <input type='text'  className='w-full h-full border-none outline-none p-1 bg-inherit text-[9px] font-normal leading-3 text-[#9C9C9C]'/>
                <button type='submit' className='absolute top-[2px] bottom-[2px] right-[2px] text-[11px] text-[#ffffff] font-medium leading-4 tracking-normal text-left py-[4px] px-3 bg-[#F15927] rounded-[8px]'>Subscribe</button>
              </form>
            </div>
            {/* ===================== FOOTER LINKS ========================== */}
            <div className='w-full md:w-auto grid grid-cols-2 sm:grid-cols-4 lg:flex md:justify-end gap-x-10 gap-y-5  md:gap-x-10 md:gap-y-10 lg:gap-x-20 lg:gap-y-20'>
              <ul className='lg:flex-[0.25] space-y-[5px] whitespace-nowrap'>
                <li className=''>
                  <p className='text-xs font-medium leading-4 text-[#2D3845]'>Information</p>
                </li>
                <li>
                  <Link href={'/aboutus'} className='text-[11px] font-normal leading-7 text-[#3F3232]'>About us</Link>
                </li>
                <li>
                  <Link href={'/contact'} className='text-[11px] font-normal leading-7 text-[#3F3232]'>Contact</Link>
                </li>
                <li>
                  <Link href={'/blog'} className='text-[11px] font-normal leading-7 text-[#3F3232]'>Blogs</Link>
                </li>
              </ul>
              <ul className='lg:flex-[0.25] space-y-[5px] whitespace-nowrap'>
                <li className=''>
                  <p className='text-xs font-medium leading-4 text-[#2D3845]'>Useful Links</p>
                </li>
                <li>
                  <Link href={'/terms-and-conditions'} className='text-[11px] font-normal leading-7 text-[#3F3232]'>Terms & Conditions</Link>
                </li>
                <li>
                  <Link href={'/privacy-policy'} className='text-[11px] font-normal leading-7 text-[#3F3232]'>Privacy policy</Link>
                </li>
                <li>
                  <Link href={'/refund-policy'} className='text-[11px] font-normal leading-7 text-[#3F3232]'>Refund Policy</Link>
                </li>
              </ul>
              <ul className='lg:flex-[0.25] space-y-[5px] whitespace-nowrap '>
                <li className=''>
                  <p className='text-xs font-medium leading-4 text-[#2D3845]'>Social</p>
                </li>
                <li>
                  <Link href={'https://www.facebook.com/StayverzApp?mibextid=LQQJ4d'} className='text-[11px] font-normal leading-7 text-[#3F3232]'>Facebook</Link>
                </li>
                <li>
                  <Link href={'https://www.instagram.com/stayverz_app?igsh=Njlyam42MjhxZXZv&utm_source=qr'} className='text-[11px] font-normal leading-7 text-[#3F3232]'>Instagram</Link>
                </li>
                <li>
                  <Link href={'https://youtube.com/@stayverz?si=keQ2lYnA2LV2xjgt'} className='text-[11px] font-normal leading-7 text-[#3F3232]'>Youtube</Link>
                </li>
              </ul>
              <ul className='lg:flex-[0.25] space-y-[5px] whitespace-nowrap '>
                <li className=''>
                  <p className='text-xs font-medium leading-4 text-[#2D3845]'>Social</p>
                </li>             
                <li>
                  <Link href={'https://x.com/stayverzapp?s=21'} className='text-[11px] font-normal leading-7 text-[#3F3232]'>Twitter</Link>
                </li>
                <li>
                  <Link href={'https://www.tiktok.com/@stayverz?_t=8lhvGs1IARL&_r=1'} className='text-[11px] font-normal leading-7 text-[#3F3232]'>Tiktok</Link>
                </li>
                <li>
                  <Link href={'https://www.linkedin.com/company/stayverz/'} className='text-[11px] font-normal leading-7 text-[#3F3232]'>Linkedin</Link>
                </li>
              </ul>
            </div>
          </div>
          {/* ===================== FOOTER BOTTOM SECTION ========================== */}
          <div className='w-full flex flex-col gap-5 md:flex-row md:justify-between md:items-center'>
            {/* <div className='order-2 md:order-1'>
              <p className='text-[11px] text-[#616161] font-medium leading-4'>© Copyright 2024. All right reserved.</p>
            </div>
            <div className='order-1 md:order-2 flex justify-start md:justify-center items-center gap-3'>
              <p className=' text-xs font-medium leading-4 text-[#616161]'>We Accept</p>
              <div className='flex justify-start items-center gap-[0.35rem]'>
                <div className={`flex justify-start md:justify-center items-center`}>
                  <Image src={Bkash} alt='payment-methods' width={110} height={18} className='w-auto h-[18px]'/>
                </div>
                <div className={`flex justify-start md:justify-center items-center`}>
                  <Image src={PaymentMethodImg} alt='payment-methods' width={110} height={18} className='w-auto h-[18px]'/>
                </div>
                <div className={`flex justify-start md:justify-center items-center`}>
                  <Image src={Nagad} alt='payment-methods' width={110} height={18} className='w-auto h-[18px]'/>
                </div>
              </div>
            </div> */}
            <Image src={sslzMobile} alt='payment-methods' className='md:hidden'/>
            <Image src={sslzDesktop} alt='payment-methods' className='hidden md:block'/>

            
          </div>
        </div>
      </div>
      <div className='w-full h-[100px] md:h-[50px] lg:hidden'></div>
    </footer>
  )
}
export default Footer
