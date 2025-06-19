import { CaretLeft } from '@phosphor-icons/react/dist/ssr/CaretLeft'
import { CaretRight } from '@phosphor-icons/react/dist/ssr/CaretRight'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import PropertyCard from '~/app/home/components/listing/PropertyCard'
import { getObjectFromSearchParams } from '~/lib/utils/url'
import { getRooms } from '~/queries/client/room'
import { styles } from '~/styles/classes'


const PropertyListCarousel  = () => {
  // ========= INITIALS =========
  const paginationSize = 20
  const searchParams = useSearchParams()
  const filterQueryParam = useMemo(() =>({...getObjectFromSearchParams(searchParams)
  }), [searchParams])


  // ========= DATA =========
  const { data, isFetching } = useQuery({
    queryKey: ['rooms-listing', paginationSize, filterQueryParam],
    queryFn: () =>getRooms({
      params: {
        page_size: paginationSize,
        ...filterQueryParam
      }
    }),
    refetchOnWindowFocus: false
  })

  // ========= SLIDER =========
  const sliderRef = useRef<any>(null)
  const [activeIndex, setActiveIndex] = useState(0) 
  const handleSlideChange = (swiper:any) => {
    setActiveIndex(swiper.activeIndex)
  }

  return ( 
    <div className='w-full h-full'>
      {!isFetching ? 
        <div className='xl:container relative'>
          <div className='swiper-navigation-container '>
            <div className={`${styles.flexCenter} absolute top-0 bottom-0 m-auto left-2 xl:left-0 z-10 `}>
              <button onClick={() => sliderRef.current?.slidePrev()} className={`prev-btn w-8 h-8 bg-white border border-[#F2F2F5] rounded-full ${styles.flexCenter}`} style={{boxShadow: '0px 19px 22.5px 0px #6A85A533'}}>
                <CaretLeft size={14} className=' ' color='#000000' />
              </button>
            </div>
            <div className={`${styles.flexCenter} absolute top-0 bottom-0 m-auto right-2 xl:right-0 z-10 `}>
              <button onClick={() => sliderRef.current?.slideNext()} className={`next-btn w-8 h-8  bg-white border border-[#F2F2F5] rounded-full ${styles.flexCenter}`} style={{boxShadow: '0px 19px 22.5px 0px #6A85A533'}}>
                <CaretRight size={14} className=' ' color='#000000' />
              </button>
            </div>
          </div>
          <Swiper
            ref={sliderRef}
            onSwiper={it => (sliderRef.current = it)}
            className='property-list-wrapper overflow-y-visible px-5'
            pagination={true}
            modules={[Navigation]}
            loop={true}
            autoplay={{
              delay: 300,
              disableOnInteraction: false,
            }}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween:20
              },
              768: {
                slidesPerView: 2,
                spaceBetween:20
              },
              1080: {
                slidesPerView: 3,
                spaceBetween:20
              },
              1280: {
                slidesPerView: 3,
                spaceBetween:30
              },
            }}
            onSlideChange={handleSlideChange}
            spaceBetween={30}
          >
            {
              data?.data?.map((house: any, index: number) => (
                <SwiperSlide key={index + 1} 
                  className='property-slider-item-wrapper w-full' 
                  virtualIndex={index} >
                  <PropertyCard
                    {...house}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div> :
        <div className='xl:container relative'>
          {/* ===================== PROPERTY LIST || SKELETON LOADER =============== */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 px-5'>
            {Array.from({length:3}).map((item, index) => (
              <div key={`property-skeleton-${index}`} className={`stayverz-property-card p-0 overflow-hidden rounded-[6px] flex justify-center items-center flex-col animate-pulse ${index === 1 ? 'hidden sm:block' : '' } ${index === 2 ? 'hidden md:block' : '' }` }>
                <div className='w-full h-[235px] p-0 relative'>
                  <div className='bg-gray-200 w-full h-full animate-pulse'></div>
                </div>
                <div className='w-full pt-8 pb-7 space-y-3'>
                  <div className='flex justify-between items-center gap-3'>
                    <div className='flex justify-start gap-2'>
                      <div className='w-44 h-4 bg-gray-200 animate-pulse'></div>
                    </div>
                    <div className='flex justify-end items-center gap-1'>
                      <div className='w-4 h-3 bg-gray-200 animate-pulse'></div>
                    </div>
                  </div>
                  <div className='flex justify-start items-center gap-2'>
                    <div className='w-20 h-3 bg-gray-200 animate-pulse'></div>
                  </div>
                  <div className='flex justify-start items-center gap-4'>
                    <div className='flex justify-start items-center gap-2'>
                      <div className='w-12 h-3 bg-gray-200 animate-pulse'></div>
                    </div>
                    <div className='flex justify-start items-center gap-2'>
                      <div className='w-12 h-3 bg-gray-200 animate-pulse'></div>
                    </div>
                    <div className='flex justify-start items-center gap-2'>
                      <div className='w-12 h-3 bg-gray-200 animate-pulse'></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>}
    </div>)
}

export default PropertyListCarousel
