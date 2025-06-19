'use client'
import { CaretLeft, CaretRight, Star } from '@phosphor-icons/react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { getAsQueryString } from '~/lib/utils/url'
import { styles } from '~/styles/classes'

type GuestHouseProps = {
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
  verification_status: string
}

const GuestHouseCard: React.FC<GuestHouseProps> = (props) => {
  const { unique_id, images, title, avg_rating, dateRange = 'Nov 15 - 20', price, guest_count, bedroom_count, bed_count, verification_status } = props
  const searchParams = useSearchParams()

  const verificationStatus = useMemo(() => {
    if(verification_status === 'verified'){
      return 'Verified'
    } else {
      return ''
    }
  },[verification_status])

  const url = useMemo(() => {
    const guests = searchParams.get('guests')?.split(',')
    return `/rooms/${unique_id}${getAsQueryString(
      searchParams.get('check_in') ? {
        check_in: searchParams.get('check_in'), 
        check_out: searchParams.get('check_out'), 
        adult: guests?.[0],
        children: guests?.[1],
        infant: guests?.[2],
      } : {})}`
  }, [searchParams, unique_id])

  return (
    <div className='overflow-hidden'>
      <div>{images.length > 0 ? 
        (<div className='relative'>
          <CardCarousel thumbList={images} path={`/rooms/${unique_id}`}/>
          {verificationStatus !== '' && <span className='absolute bg-white z-[1] top-3 left-2 py-1 px-3 rounded-2xl text-sm font-semibold shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>{verificationStatus}</span>}
        </div>) : 
        <div className='block w-full aspect-[4/3.5] rounded-lg bg-slate-100'></div>
      }</div>
      <Link href={`${url}`} className='flex justify-between items-center mt-4'>
        <span className='text-base font-medium ellipsis-one-line '>{title || 'title'}</span>
        <span className='text-sm flex gap-1 text-black px-2 py-1 rounded-full items-center'><Star size={16} weight='fill' color='#222222' />{avg_rating}</span>
      </Link>
      <Link href={`${url}`} className='text-sm text-gray-500'>
        {`${guest_count} guests · ${bedroom_count} bedroom · ${bed_count} beds`}
      </Link>
      <Link href={`${url}`} className='mt-1 block'>
        <span className='text-base font-medium text-[#202020]'>৳‎{price}</span> <span className='text-sm text-gray-800'>night</span>
      </Link>
    </div>
  )
}

export default GuestHouseCard

type CardCarouselProps = {
  thumbList: string[],
  path: string,
}
const CardCarousel: React.FC<CardCarouselProps> = ({ thumbList, path }) => {
  const sliderRef = useRef<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const totalSlides = sliderRef?.current?.slides?.length || thumbList.length

  return (
    <div className='w-full h-full rounded-lg relative'>
      <Swiper
        ref={sliderRef}
        onSwiper={it => (sliderRef.current = it)}
        className='home-card-slider rounded-lg overflow-hidden relative'
        pagination={true}
        modules={[Navigation, Pagination]}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        slidesPerView={1}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex)
        }}
      >
        {activeIndex !== 0 &&
          <div className={`${styles.flexCenter} absolute top-0 bottom-0 m-auto left-2 z-10 `}>
            <button onClick={() => sliderRef.current?.slidePrev()} className='custom-swiper-nav-btn prev-btn bg-white opacity-[0.8] hover:opacity-[0.9] rounded-full p-2'>
              <CaretLeft size={14} className=' ' color='#000000' />
            </button>
          </div>}

        {((totalSlides - 1) !== activeIndex) &&
          <div className={`${styles.flexCenter} absolute top-0 bottom-0 m-auto right-2 z-10 `}>
            <button onClick={() => sliderRef.current?.slideNext()} className='custom-swiper-nav-btn next-btn bg-white opacity-[0.8] hover:opacity-[0.9] rounded-full p-2'>
              <CaretRight size={14} className=' ' color='#000000' />
            </button>
          </div>}

        {thumbList.map((thumbUrl: string, index: number) => (
          <SwiperSlide key={index + 1} virtualIndex={index} className='w-full h-full' >
            <Link href={path} className='w-full h-full block'>
              {thumbUrl ? <Image
                src={thumbUrl}
                alt={'Room Image'}
                width={400}
                height={250}
                className='object-cover w-full aspect-[4/3.5]'
              /> : <div className='block w-full aspect-[4/3.5] rounded-lg'></div>}
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
