import { CaretLeft } from '@phosphor-icons/react/dist/ssr/CaretLeft'
import { CaretRight } from '@phosphor-icons/react/dist/ssr/CaretRight'
import { ReactNode, useRef, useState } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react'

interface CarouselProps<T> extends SwiperProps {
  carouselItems: T[] | undefined
  slidesCountPerView: number
  slidesGap: number
  renderItem: (item: T) => ReactNode
  navigationClassName?: string
  leftNavigationClassName?: string
  rightNavigationClassName?: string
}
const Carousel = <T,>({ carouselItems, slidesCountPerView, slidesGap, navigationClassName,leftNavigationClassName,rightNavigationClassName, renderItem, ...props }: CarouselProps<T>) => {
  const sliderRef = useRef<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const totalSlides = sliderRef?.current?.slides?.length || carouselItems?.length

  return (
    <div className='w-full h-full'>
      <Swiper
        {...props}
        ref={sliderRef}
        onSwiper={it => (sliderRef.current = it)}
        className='rounded-lg overflow-hidden static'
        modules={[Navigation]}
        slidesPerView={slidesCountPerView}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex)
        }}
        spaceBetween={slidesGap}
      >
        {/* navigations */}
        <div className={`
          flex justify-center items-center absolute top-0 m-auto right-10 z-10 
          ${navigationClassName || ''} ${leftNavigationClassName || ''} ${(carouselItems?.length) !== undefined ? (carouselItems?.length > slidesCountPerView ? '' : 'hidden') : ''}`}>
          <button
            onClick={() => sliderRef.current?.slidePrev()}
            className={`bg-white border border-grayBorder rounded-full p-2 ${activeIndex === 0 ? 'cursor-not-allowed !opacity-50' : ''}`}>
            <CaretLeft size={14} weight='bold' />
          </button>
        </div>

        <div className={`
          flex justify-center items-center absolute top-0 m-auto right-0 z-10 
          ${navigationClassName || ''} ${rightNavigationClassName || ''} ${(carouselItems?.length) !== undefined ? (carouselItems?.length > slidesCountPerView ? '' : 'hidden') : ''}`}>
          <button
            onClick={() => sliderRef.current?.slideNext()}
            className={`bg-white border border-grayBorder rounded-full p-2 ${(totalSlides - 3) === activeIndex ? 'cursor-not-allowed !opacity-50' : ''}`}>
            <CaretRight size={14} weight='bold' />
          </button>
        </div>

        {carouselItems?.map((item, index: number) => (
          <SwiperSlide key={index + 1} virtualIndex={index} className='w-full h-full'>
            {renderItem(item)}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Carousel
