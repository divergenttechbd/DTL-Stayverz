'use client'
import Image from 'next/image'

import HeroBg from '~/public/images/hero/hero-bg.png'
import HeroGradient from '~/public/images/hero/hero-gradient.png'


import FeatureOneImg from '~/public/images/features/feature-one.png'
import FeatureThreeImg from '~/public/images/features/feature-three.png'
import FeatureTwoImg from '~/public/images/features/feature-two.png'
import PropertyTypeAll from '~/public/images/property-type/all.png'
import PropertyTypeApartment from '~/public/images/property-type/apnartment.png'
import PropertyTypeCabin from '~/public/images/property-type/cabin.png'
import PropertyTypeDormitory from '~/public/images/property-type/dormitory.png'
import PropertyTypeGuestHouse from '~/public/images/property-type/guest-house.png'
import PropertyTypeHome from '~/public/images/property-type/home.png'
import PropertyTypeHotel from '~/public/images/property-type/hotel.png'

import GooglePlayLogo from '~/public/images/download-app/google-play-logo.png'
import MobileMockupMobile from '~/public/images/download-app/mobile-mockup.png'

import { useQuery } from '@tanstack/react-query'
import CategoryFilterAlt from '~/app/home/components/filter/CategoryFilterAlt'
import PropertyListCarousel from '~/app/home/components/listing/PropertyListCarousel'
import PropertyOption from '~/app/home/components/property-option/PropertyOption'
import SearchDropdownContainer from '~/app/home/components/search/locationWiseSearchAlt/SearchDropdownContainer'
import Footer from '~/components/layout/Footer'
import ResponsiveNavbar from '~/components/layout/ResponsiveNavbar'
import { getListingsConfigurations } from '~/queries/client/room'
import { styles } from '~/styles/classes'


export default function Home() {

  const { data: listingConfigurationData, isFetching, isRefetching } = useQuery({
    queryKey: ['listing-configuration'],
    queryFn: () => getListingsConfigurations(),
  })

  return (
    <main className='w-full m-0 p-0'>
      <ResponsiveNavbar wrapInContainer={true} />
      <div className='stayverz w-full relative'>
        {/* ===================== HERO SEARCH ===================== */}
        {/* py-8 */}
        <section className='stayverz-hero  md:py-16 relative h-screen flex lg:block justify-center items-center'>
          <Image src={HeroBg} width={1440} height={511} className='stayverz-hero-bg w-full h-auto  absolute top-0 left-0 right-0 bottom-[50px] 2xl:bottom-[185px] m-auto flex justify-center items-center z-0' alt=''/> 
          <Image src={HeroGradient} width={1577} height={645} className='stayverz-hero-gradient absolute w-full h-auto left-0 right-0 top-0 bottom-0 opacity-[50%] flex justify-center items-center z-[1]' alt=''/> 
        
          <div className={`xl:container px-4 xl:px-0 relative z-[2] xl:pt-0 lg:mt-[23vh]`}>
            <div className='flex flex-col items-center justify-center gap-[20px] md:gap-[10px]'>
              <div className='flex items-start justify-center '>
                {/* <h1 className='text-3xl font-semibold text-[#202020] leading-10 md:text-5xl md:font-semibold md:leading-tight md:text-center text-[#202020]'>Unlock The Door To Your <br className='block'/> Perfect Home</h1> */}
                <h1 className='text-4xl font-semibold leading-tight md:text-5xl md:font-semibold md:leading-tight text-center text-[#202020]'>Experience The Comforts Of Your Home<br className='hidden md:block'/>Away From Home</h1>
              </div>
              <div className='flex items-center justify-center text-center'>
                {/* <p className='text-sm font-normal leading-5 md:text-base md:font-normal md:leading-7 text-center  text-[#616161]'>Our experience in matching you with homes that building more than <br className='hidden md:block'/> homes suit your lifestyle.</p> */}
                <p className='font-normal leading-7 text-base md:font-normal md:leading-7 text-center  text-[#616161]'>Your one-stop shop for finding the perfect place to stay or <br className='hidden md:block'/>listing your unique property for rent.</p>
              </div>
              <SearchDropdownContainer/>
            </div>
          </div>
        </section>
        {/* ===================== CHOOSE THE OPTION =============== */}
        <PropertyOption/>
        {/* ===================== OUR POPULAR PROPERTY ============ */}
        <section className='stayverz-our-property py-8 md:py-16 lg:py-[100px]'>
          <div className={``}>
            <div className='w-full space-y-[30px]'>
              {/* ===================== SECTION HEADER =============== */}
              <div className={`stayverz-section-header space-y-[8px] md:space-y-[15px]`}>
                <div className={`${styles.flexCenter}`}>
                  <h2 className='text-3xl font-semibold leading-10 md:text-4xl md:font-bold md:leading-10 text-center text-[#202020]'>
                  Choose From Our Diverse Range<br className='hidden md:block'/>of Properties
                  </h2>
                </div>
                <div className={`${styles.flexCenter}`}>
                  <p className='text-sm font-normal leading-5 text-center text-[#9C9C9C]'>From individual stays to family getaways,<br className='hidden sm:block'/>our properties cater to all your accommodation needs.</p>
                </div>
              </div>
              {/* ===================== SECTION BODY =============== */}
              <div className='stayverz-section-body space-y-10'>
                <div className='xl:container px-4 xl:px-0'>
                  {/* ===================== PROPERTY CATEGORY =============== */}
                  <CategoryFilterAlt data={listingConfigurationData?.data} isFetching={isFetching} isRefetching={isRefetching}/>
                  <div className='hidden w-full overflow-hidden'>
                    <div className={`w-screen lg:w-full flex items-center justify-start lg:justify-center gap-5 overflow-x-scroll lg:overflow-x-hidden scrollbar-hidden`}>

                      {[
                        {
                          imgUrl:PropertyTypeAll,
                          title: 'All',
                          active: true,
                        },
                        {
                          imgUrl:PropertyTypeHome,
                          title: 'Home',
                          active: false,
                        },
                        {
                          imgUrl:PropertyTypeApartment,
                          title: 'Apartment',
                          active: false,
                        },
                        {
                          imgUrl:PropertyTypeGuestHouse,
                          title: 'Guest House',
                          active: false,
                        },
                        {
                          imgUrl:PropertyTypeHotel,
                          title: 'Hotel',
                          active: false,
                        },
                        {
                          imgUrl:PropertyTypeCabin,
                          title: 'Resort',
                          active: false,
                        },
                        {
                          imgUrl:PropertyTypeDormitory,
                          title: 'Dormitory'
                        },
                      ].map((item, index, array) => (
                        <button 
                          key={`property-tab-${index}`}  
                          className={`${index ===0 ? ' lg:ml-0' : '' } ${index === array.length - 1 ? 'mr-10 lg:mr-0' : ''} ${styles.flexCenter} gap-2 cursor-pointer py-3 px-4 border border-solid rounded-[50px] text-sm font-medium leading-5 whitespace-nowrap ${item.active ? 'text-[#ffffff] bg-[#202020]' : 'border-[#EFEFEF] text-[#616161] bg-[#ffffff]'}`}>
                          <span className={`${styles.flexCenter}`}>
                            <Image  src={item.imgUrl} alt={item.title} width={16} height={16} className='min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px]'/>
                          </span>
                          <span>{item.title}</span>
                        </button>))}
                    </div>
                  </div>
                </div>

          

                {/* ===================== PROPERTY LIST || CAROUSEL =============== */}
                <div className='w-full'>
                  <PropertyListCarousel/>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ===================== OUR FEATURES ==================== */}
        <section className='stayverz-our-features py-8 md:py-16 lg:py-[100px]'>
          <div className={`xl:container px-4 xl:px-0`}>
            <div className='w-full space-y-[30px] md:space-y-[60px]'>
              {/* ===================== SECTION HEADER =============== */}
              <div className={`stayverz-section-header space-y-[8px] md:space-y-[15px]`}>
                <div className={`${styles.flexCenter}`}>
                  <h2 className='text-3xl font-semibold leading-10 md:text-4xl md:font-bold md:leading-10 text-center text-[#202020]'>
                Our Features For  <br className=''/> Your Comfort
                  </h2>
                </div>
                <div className={`${styles.flexCenter}`}>
                  <p className='text-sm font-normal leading-5 text-center text-[#9C9C9C]'>These are also locations where it’s easy to feel healthier, happier <br className='hidden sm:block'/> and less stressed than your own home</p>
                </div>
              </div>
              {/* ===================== SECTION BODY =============== */}
              <div className='stayverz-section-body space-y-10'>
                <div className='space-y-5 md:space-y-20 lg:max-w-[80%] mx-auto'>{
                  [
                    {
                      imgUrl: FeatureOneImg,
                      title: 'Flexible Filter ',
                      shortDescription: 'These are also locations where it’s easy to feel healthier, happier and less stressed than in America. And for more destinations on the Global Retirement Index.',
                      reverseColumn: false,
                    },
                    {
                      imgUrl: FeatureTwoImg,
                      title: <>Video Preview to Make a <br className='hidden md:block'/> Right Choice</>,
                      shortDescription: 'These are also locations where it’s easy to feel healthier, happier and less stressed than in America. And for more destinations on the Global Retirement Index.',
                      reverseColumn: true,
                    },
                    {
                      imgUrl: FeatureThreeImg,
                      title: 'Easy Booking And Planing',
                      shortDescription: 'These are also locations where it’s easy to feel healthier, happier and less stressed than in America. And for more destinations on the Global Retirement Index.',
                      reverseColumn: false,
                    },
                  ].map((item, index) => (
                    <div key={`feature-item-${index}`} className={`stayverz-features-item w-full grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 lg:gap-20`}>
                      <div className={`h-[350px] w-full flex justify-center md:justify-start items-center`}>
                        <Image src={item.imgUrl} alt={`${item.title}`} width={400} height={400} className='h-auto max-w-[300px] md:max-w-[350px] lg:max-w-[400px]'/>
                      </div>
                      <div className={`flex justify-start items-center ${item.reverseColumn ? 'md:order-first' : ''}`}>
                        <div className='space-y-3 text-center md:text-left'>
                          <h3 className='text-3xl font-semibold text-[#202020] leading-9'>{item.title}</h3>
                          <p className='text-sm font-normal leading-5 text-[#616161] sm:max-w-[70%] mx-auto md:mr-auto md:ml-0'>{item.shortDescription}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ===================== DOWNLOAD OUT APP ==================== */}
        <section className='stayverz-our-features bg-[#FFF7F5]'>
          <div className={`xl:container px-4 xl:px-0`}>
            <div className='w-full grid grid-cols-1 lg:grid-cols-2 mx-auto '>
              <div className={`flex justify-center lg:justify-start items-center`}>
                <div className='space-y-3 py-7 text-center lg:text-left'>
                  <p className='text-sm font-medium leading-5 text-[#F54748]'>Download our app</p>
                  <h2 className='text-2xl font-semibold leading-9 md:text-5xl md:font-semibold md:leading-[60px] text-[#2D3845]'>
                      Now in Your Pocket, <br className='hidden md:block'/> Save Money!
                  </h2>
                  <p className='text-xs font-normal leading-4 text-[#616161]'>Download from app store or play store and get <span className='font-bold text-[#F15927]'>exciting discount</span> </p>
                
                  <div className='flex justify-center lg:justify-start items-center gap-3 pt-7'>
                    {/* <button className={`bg-[#151D28] text-[#ffffff] rounded-[7.5px] px-3 py-2 ${styles.flexCenter} gap-2 w-[130px]`}>
                      <div className={`${styles.flexCenter}`}>
                        <Image src={AppleLogo} width={18} height={18} alt='AppleLogo' className='w-[16px] h-auto'/>
                      </div>
                      <div className='text-left'>
                        <div className='text-[7px] font-base'>Download on the</div>
                        <div className='text-xs font-medium'>App Store</div>
                      </div>
                    </button> */}
                    <a href='https://play.google.com/store/apps/details?id=com.stayverz.stayverz' className={`bg-[#151D28] text-[#ffffff] rounded-[7.5px] px-3 py-2 ${styles.flexCenter} gap-2 w-[130px]`}>
                      <div className={`${styles.flexCenter}`}>
                        <Image src={GooglePlayLogo} width={18} height={18} alt='AppLogo' className='w-[16px] h-auto'/>
                      </div>
                      <div className='text-left'>
                        <div className='text-[7px] font-base'>GET IT ON</div>
                        <div className='text-xs font-medium'>Google Play</div>
                      </div>
                    </a>

                  </div>
                </div>
              </div>
              <div className={`relative ${styles.flexCenter} p-0 m-0`}>
                <Image src={MobileMockupMobile}  width={600} height={600} className='w-auto sm:w-[320px] md:w-[600px] h-auto' alt='MobileMockupMobile'/>
              </div>
            </div>
          </div>
        </section>
        
        {/* ===================== FOOTER ========================== */}
        <Footer/>
      </div>
    </main>
  )
}



