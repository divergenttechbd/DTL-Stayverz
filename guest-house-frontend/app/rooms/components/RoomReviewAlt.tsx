'use client'
import { CaretLeft } from '@phosphor-icons/react/dist/ssr/CaretLeft'
import { CaretRight } from '@phosphor-icons/react/dist/ssr/CaretRight'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { IReview } from '~/app/review/types'
import CustomerReview from '~/app/rooms/components/CustomerReview'
import { styles } from '~/styles/classes'

type RoomReviewProps = {
  data: any
  isLoading: boolean
}

const RoomReview:FC<RoomReviewProps> = ({data, isLoading}) => {

  const sliderRef = useRef<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const totalSlides = data?.reviews?.length || 0 
  
  const handleSlideChange = (swiper:any) => {
    setActiveIndex(swiper.activeIndex)
  }

  const [loading, setLoading] = useState<Boolean>(true)

  const handleLoading = useCallback((value:boolean) => {
    setLoading(value)
  },[])

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleLoading(false)
    } ,1000)

    return () => clearTimeout(timeout)
  },[handleLoading])

  return (
    <div className={`${(data?.reviews?.length > 0) ? 'block' : 'hidden'}`}>
      <div className={`w-full pt-10 lg:pt-20 p-5 bg-[#F2F2F5] md:bg-inherit`}>
        <div className='flex flex-col justify-start items-start gap-5'>
          <div className='space-y-5 lg:space-y-20 w-full'>
            <div className={`md:container flex justify-start md:justify-center items-center w-full px-2 md:px-0`}>
              <h1 className='text-[#202020] text-3xl font-semibold leading-10 md:text-4xl md:font-medium md:leading-10'>What Our Guests Say</h1>
            </div>
            {/* CUSTOMER REVIEWS */}
            {/* <div className='grid md:grid-cols-2 gap-y-10 gap-x-20'>
              {data?.reviews?.map((review:IReview) => (
                <CustomerReview key={review.id} review={review} />
              ))}
            </div> */}

            <div className='relative md:py-10 lg:py-20 lg:px-10'>
              <div className='hidden lg:block absolute top-0 bottom-0 left-0 right-0 w-[70%] h-full bg-[#F2F2F5] -z-[1] rounded-[20px] mx-auto'></div>
              
              <Swiper
                ref={sliderRef}
                onSwiper={it => (sliderRef.current = it)}
                className='w-full overflow-y-visible px-2'
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
                    slidesPerView: 1,
                    spaceBetween:20
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween:20
                  },
                  1080: {
                    slidesPerView: 2,
                    spaceBetween:20
                  },
                  1280: {
                    slidesPerView: 3,
                    spaceBetween:30
                  },
                }}
                onSlideChange={handleSlideChange}
                spaceBetween={15}
              >
              
                {!isLoading ?  
                  data?.reviews?.map((review:IReview, index:number) => (
                    <SwiperSlide key={review.id} virtualIndex={index} className={`w-full min-h-[300px] h-auto p-10 shadow-md rounded-[20px] bg-[#ffffff]`}  
                    >
                      <CustomerReview key={review.id} review={review} />

                    </SwiperSlide>
                  )) : 
                  (
                    Array.from({length:4}).map((item, index) =>  (
                      <SwiperSlide key={`skeleton-loader-${index}`} virtualIndex={index} className={`w-full min-h-[300px] h-auto p-10 shadow-md rounded-[20px] bg-[#ffffff]`}  
                      >
                        <div className='space-y-5 w-full animate-pulse'>
                          <div className='flex justify-start items-center gap-4'>
                          
                            <div>
                              <div className='bg-gray-300 w-20 h-4'></div>
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <div className='bg-gray-300 w-full lg:w-[70%] h-4'></div>
                            <div className='bg-gray-300 w-[50%] h-4'></div>
                            <div className='bg-gray-300 w-20 h-4 mt-1'></div>
                          </div>
                          <div className='space-y-5 pt-3'>
                            <div className='flex justify-start items-center gap-2'>
                              <div  className='bg-gray-300 w-6 h-4'></div>
                            </div>
                            {/* Skeleton loader for reviewer name */}
                            <div className='bg-gray-300 w-24 h-4'></div>
                          </div>
                        </div>
    
                      </SwiperSlide>
                    ) ) 
                  )}

              </Swiper>
              {data?.reviews?.length > 3 
              && 
              <div className='swiper-navigation-container relative md:static mt-5 md:mt-0 flex justify-center items-center gap-5'>
                <div className={`${styles.flexCenter} md:absolute md:top-0 md:bottom-0 md:m-auto left-2 xl:left-0 z-10 `}>
                  <button onClick={() => sliderRef.current?.slidePrev()} className={`prev-btn w-8 h-8 bg-white border border-[#F2F2F5] rounded-full ${styles.flexCenter}`} style={{boxShadow: '0px 19px 22.5px 0px #6A85A533'}}>
                    <CaretLeft size={14} className='hover:text-[#f66c0e] text-[#000000]'  />
                  </button>
                </div>
                <div className={`${styles.flexCenter} md:absolute md:top-0 md:bottom-0 md:m-auto right-2 xl:right-0 z-10 `}>
                  <button onClick={() => sliderRef.current?.slideNext()} className={`next-btn w-8 h-8  bg-white border border-[#F2F2F5] rounded-full ${styles.flexCenter}`} style={{boxShadow: '0px 19px 22.5px 0px #6A85A533'}}>
                    <CaretRight size={14}  className='hover:text-[#f66c0e] text-[#000000]'/>
                  </button>
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomReview


