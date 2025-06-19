'use client'
import { CaretLeft } from '@phosphor-icons/react/dist/ssr/CaretLeft'
import { CaretRight } from '@phosphor-icons/react/dist/ssr/CaretRight'
import { Funnel } from '@phosphor-icons/react/dist/ssr/Funnel'
import { SlidersHorizontal } from '@phosphor-icons/react/dist/ssr/SlidersHorizontal'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import FilterModal from '~/app/home/components/FilterModal'
import CategoryFilterAlt from '~/app/home/components/filter/CategoryFilterAlt'
import PropertyListGrid from '~/app/home/components/listing/PropertyListGrid'
import SearchDropdownContainer from '~/app/home/components/search/locationWiseSearchAlt/SearchDropdownContainer'
import useFilterInitialValues from '~/app/home/hooks/useFilterInitialValues'
import Footer from '~/components/layout/Footer'
import ResponsiveNavbar from '~/components/layout/ResponsiveNavbar'
import { useModal } from '~/components/modal/hooks/useModal'
import CheckInImg from '~/public/images/location-filter/check-in.png'
import CheckOutImg from '~/public/images/location-filter/checkout.png'
import DestinationImg from '~/public/images/location-filter/destinations.png'
import PersonImg from '~/public/images/location-filter/person.png'
import { getListingsConfigurations } from '~/queries/client/room'
import { styles } from '~/styles/classes'


const roomFilterMeta = [
  {
    imgUrl: DestinationImg,
    label: 'Destinations',
    placeholder: 'Berlin, Germany',
    className: 'flex-[1.4]',
    value: 'Berlin, Germany',
  },
  {
    imgUrl: CheckInImg,
    label: 'Check In',
    placeholder: 'Add Dates',
    className: 'flex-[1.2]',
    value: '',
  },
  {
    imgUrl: CheckOutImg,
    label: 'Check Out',
    placeholder: 'Add Dates',
    className: 'flex-[1.2]',
    value: '',
  },
  {
    imgUrl: PersonImg,
    label: 'Person',
    placeholder: 'Add Guest',
    className: 'flex-[1.2]',
    value: '',
  },
]

export default function Home() {

  // ========= FILTER INITIALS =========
  const { initialValues } = useFilterInitialValues()
  const [state, handleModalOpen, handleModalClose] = useModal()

  // ========= FILTER API DATA =========
  const { data: listingConfigurationData, isFetching, isRefetching } = useQuery({
    queryKey: ['listing-configuration-room-list'],
    queryFn: () => getListingsConfigurations(),
    refetchOnWindowFocus: false
  })

  // ========= SELECTED FILTER COUNT =========
  const filterCount = useMemo(() => {
    let count = 0
    const obj: any = { ...initialValues }
    Object.keys(initialValues).forEach((key) => {
      const value = obj[key]
      if (Array.isArray(value)) {
        if (value.filter((el: any) => !!el).length > 0) {
          count++
        }
      } else if (value !== null && key !== 'price_min') {
        count++
      }
    })
    return count
  }, [initialValues])

  // ========= TOTAL RESULTS COUNT =========
  const [total, setTotal] = useState(0)

  const handleSetTotal = useCallback((value: number) => {
    setTotal(value)
  },[])


  return (
    <main className='w-full p-0 m-0'>
      <ResponsiveNavbar wrapInContainer={true} />
      <div className='stayverz w-full relative pt-navbar'>
        {/* ===================== NAVIGATION BAR ================== */}
        {/* relative lg:absolute lg:top-0 lg:left-0 lg:right-0 z-10 */}
        {/* ===================== SEARCH & CATEGORY SECTION ===================== */}
        <section className='stayverz-hero py-4 md:py-8 relative bg-[#F8F8F9] md:bg-inherit'>
          <div className={`xl:container px-4 xl:px-0 relative z-[2] `}>
            <div className='flex flex-col items-center justify-center gap-[30px] pt-5 md:pt-0 md:gap-[60px]'>
              <SearchDropdownContainer/>

              {/* ===================== PROPERTY CATEGORY =============== */}
              <div className='w-full mb-4 md:mb-0'>
                <CategoryFilterAlt data={listingConfigurationData?.data} isFetching={isFetching} isRefetching={isRefetching}/>
              </div>
            </div>
          </div>
        </section>
    
        {/* ===================== PROPERTY LIST ============ */}
        <section className='stayverz-our-property py-8 lg:py-16'>
          <div className={`xl:container px-4 xl:px-0`}>
            {/* ===================== SECTION BODY =============== */}
            <div className='stayverz-section-body space-y-5 w-full  xl:max-w-[90%] mx-auto'>
              {/* ===================== RESULTS COUNT & FILTER =============== */}
              <div className='flex justify-between items-center'>
                <div>
                  <p className='text-sm font-medium leading-5  md:text-xl md:font-medium md:leading-8 text-[#616161]'>
                    <span>Search Results</span> 
                    {/* <br className='block md:hidden'/>
                    <span className='text-[#202020] font-medium ml-1'>{total} places</span> */}
                  </p>
                </div>
                <div>
                  {/* FILTER */}
                  <button onClick={handleModalOpen}  className={`border border-[#616161] rounded-[8px] py-2 px-2 ${styles.flexCenter} gap-1  `}>
                    <span className='md:rotate-[-90deg]'>
                      <SlidersHorizontal size={16} color='#000000' className='hidden md:block'/>
                      <Funnel  size={16} color='#000000' className='block md:hidden' />
                    </span>
                    <span className='text-sm md:text-base font-medium leading-5 text-[#2D3845]'>All Filters</span>
                    {filterCount > 0 && 
                  <span className={`rounded-[4px]  min-w-[20px] min-h-[20px] text-[#ffffff] bg-[#2D3845] text-[10px] font-normal leading-[12px] hidden md:flex ${styles.flexCenter}`}>{filterCount}</span>}
                  </button>
                  <FilterModal data={listingConfigurationData?.data} state={state} handleModalClose={handleModalClose} />
                </div>
              </div>

              <PropertyListGrid handleSetTotal={handleSetTotal}/>
            </div>
          </div>
        </section>

        {/* ===================== FOOTER ========================== */}
        <Footer/>
      </div>
    </main>

  )
}


type PropertyItemCarouselType = {
  imgList: any[]
}

const PropertyItemCarousel:FC<PropertyItemCarouselType> = ({imgList}) => {

  const sliderRef = useRef<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const totalSlides = imgList.length 
  
  const handleSlideChange = (swiper:any) => {
    setActiveIndex(swiper.activeIndex)
  }

  return (
    <Swiper
      ref={sliderRef}
      onSwiper={it => (sliderRef.current = it)}
      className={`w-full h-full group/item`}
      pagination={true}
      modules={[Navigation]}
      // loop={true}
      // autoplay={{
      //   delay: 300,
      //   disableOnInteraction: false,
      // }}
      slidesPerView={1}
      onSlideChange={handleSlideChange}
    >
      <div className='swiper-navigation-container invisible group-hover/item:visible transition-all duration-[0.2s] ease-in-out'>
        <div className={`${styles.flexCenter} absolute top-0 bottom-0 m-auto left-2 xl:left-0 z-10 `}>
          {activeIndex > 0 && 
            <button onClick={() => sliderRef.current?.slidePrev()} className={`prev-btn opacity-[0.9] hover:opacity-[1] w-8 h-8 bg-white border border-[#F2F2F5] rounded-full ${styles.flexCenter}`} style={{boxShadow: '0px 19px 22.5px 0px #6A85A533'}}>
              <CaretLeft size={12} className=' ' color='#000000' />
            </button> 
          }
        </div>
        <div className={`${styles.flexCenter} absolute top-0 bottom-0 m-auto right-2 xl:right-0 z-10 `}>
          {activeIndex < totalSlides - 1 && 
          <button onClick={() => sliderRef.current?.slideNext()} className={`next-btn opacity-[0.9] hover:opacity-[1] w-8 h-8  bg-white border border-[#F2F2F5] rounded-full ${styles.flexCenter}`} style={{boxShadow: '0px 19px 22.5px 0px #6A85A533'}}>
            <CaretRight size={12} className=' ' color='#000000' />
          </button> }
          
        </div>
      </div>
      {imgList.map((item: any, index: number) => (
        <SwiperSlide key={index} virtualIndex={index} className={` ${styles.flexCenter} w-full h-full overflow-y-hidden`}  
          style={{boxShadow: '0px 10.75px 12.25px 0px #60646436'}}
        >
          <Image src={item.imgUrl} width={350} height={250} alt='property-name' className='w-full h-full object-cover object-center'/>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
