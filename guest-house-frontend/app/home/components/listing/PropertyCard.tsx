'use client'
import { Bathtub } from '@phosphor-icons/react/dist/ssr/Bathtub'
import { Bed } from '@phosphor-icons/react/dist/ssr/Bed'
import { CaretLeft } from '@phosphor-icons/react/dist/ssr/CaretLeft'
import { CaretRight } from '@phosphor-icons/react/dist/ssr/CaretRight'
import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin'
import { Star } from '@phosphor-icons/react/dist/ssr/Star'
import { User } from '@phosphor-icons/react/dist/ssr/User'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FC, useMemo, useRef, useState } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { getAsQueryString } from '~/lib/utils/url'
import PropertyVerifiedImg from '~/public/images/property/property-verfied.png'
import { styles } from '~/styles/classes'

type PropertyCardType = {
  unique_id: string,
  images: string[],
  title: string,
  avg_rating: number,
  description: string,
  dateRange?: string,
  price: number,
  guest_count: number,
  bedroom_count: number,
  bed_count: number,
  bathroom_count: number,
  verification_status:string,
  address:string
}

const PropertyCard:FC<PropertyCardType> = (props) => {
  const { unique_id, images, title, avg_rating, dateRange = 'Nov 15 - 20', price, guest_count, bedroom_count, bed_count , bathroom_count, verification_status, address } = props
  const searchParams = useSearchParams()

  const url = useMemo(() => {
    const guests = searchParams.get('guests')?.split(',')


    return `/rooms/${unique_id}${getAsQueryString(
      searchParams.get('check_in') ? {
        check_in: searchParams.get('check_in'), 
        check_out: searchParams.get('check_out'), 
        ...(guests && guests[0] && { adult: guests?.[0],}),
        ...(guests && guests[1] && { children: guests?.[1],}),
        ...(guests && guests[2] && { infant: guests?.[2],}),

      } : {})}`
  }, [searchParams, unique_id])



  return (
    <div 
      className={`stayverz-property-card p-0 overflow-hidden rounded-[6px] ${styles.flexCenter} flex-col shadow-lg`}
    >
      <div className={`w-full h-[220px] p-0 relative`}  style={{boxShadow: `${images.length > 0 ? '0px 12.75px 41.25px 0px #60646436' : 'none'}`}}>
        {(images.length > 0 ) ?
          <PropertyItemCarousel thumbList={images} path={url} /> : 
          <div className='bg-gray-200 w-full h-full'></div>}
        <div className={`absolute left-4 -bottom-4 ${styles.flexCenter} bg-[#ffffff] rounded-[37.5px] py-1 px-5 z-[1]  ${(images.length <= 0 ) ? 'shadow-md' : ''}`}>
          <Link href={url} className='text-[#F15927]'>
            <span className='text-sm font-semibold leading-6'>৳{price}{' '}</span>
            <span className='text-xs font-medium leading-6'>night</span>
          </Link>
        </div>
      </div>
      <div className='w-full pt-8 pb-7 px-4 space-y-2'>
        <div className='flex justify-between items-center gap-3'>
          <Link href={url} className='flex justify-start gap-2 min-w-[90%] max-w-[90%]'>
            <span className='text-sm font-medium leading-6 text-[#2D3845] ellipsis-one-line overflow-hidden max-w-full'>{title}</span>
            {verification_status === 'verified' ? 
              <span className={`${styles.flexCenter}`}>
                <Image src={PropertyVerifiedImg} width={16} height={16} alt='property-verified' className='min-w-[16px] max-w-[16] h-[16px]'/> 
              </span>
              : ''}
          
          </Link>
          <div className='flex justify-end items-center gap-1'>
            <Star size={14} color='#FFA412' weight='fill'/> 
            <span className='text-xs font-semibold leading-4 text-[#2D3845]'>{parseFloat(avg_rating.toFixed(2)) }</span>
          </div>
        </div>
        <div className='flex justify-start items-center gap-2'>
          <span className={`flex justify-start items-center`}>
            <MapPin size={14} color='#616161' className='ml-[-1.5px]'/>
          </span> 
          <span className='text-xs font-normal leading-4 text-[#616161] ellipsis-one-line max-w-[85%]'>{address}</span>
        </div>
        <div className='flex justify-start items-center gap-4'>
          {[
            {
              title: `${bedroom_count} ${bedroom_count <= 1 ? 'bedroom': 'bedrooms'}`,
              icon: <Bed size={14} color='#616161'/>
            },
            {
              title: `${bed_count} ${bed_count <= 1 ? 'bed': 'beds'}`,
              icon: <Bathtub  size={14} color='#616161'/>
            },
            {
              title: `${guest_count} ${guest_count <= 1 ? 'guest': 'guests'}`,
              icon: <User size={14} color='#616161'/>
            },
          ].map((item, index) => (
            <Link href={url} key={`amenity-${item.title}`} className='flex justify-start items-center gap-2'>
              <span className={`${styles.flexCenter}`}>
                {item.icon}
              </span>
              <span className='text-xs font-normal leading-4 text-[#616161] mt-[1px]'>{item.title}</span>
            </Link>
          ))}
        
        </div>
      </div>

    </div>)
}

export default PropertyCard


type PropertyItemCarouselType = {
  thumbList: string[],
  path: string,
}

const PropertyItemCarousel:FC<PropertyItemCarouselType> = ({ thumbList, path }) => {
  const sliderRef = useRef<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const totalSlides = thumbList.length 
  
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
      <div className='swiper-navigation-container invisible group-hover/item:visible transition-all duration-[0.2s] ease-in-out '>
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
      {thumbList.map((item: any, index: number) => (
        <SwiperSlide key={index} virtualIndex={index} className='w-full h-full'
        >
          <Link href={path}  className={` ${styles.flexCenter} w-full h-full overflow-y-hidden`}  
            style={{boxShadow: '0px 10.75px 12.25px 0px #60646436'}}>
            <Image src={item} width={350} height={250} alt='property-name' className='w-full h-full object-cover object-center'/>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
