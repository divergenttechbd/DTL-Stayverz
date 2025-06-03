'use client'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { Listing } from '~/app/host-dashboard/calendar/components/Calendar'
import galleryImg from '~/assets/images/gallery.jpg'
import { getListings } from '~/queries/client/listing'

const CalendarListing = () => {
  const router = useRouter()
  const { data: listingMenuData } = useQuery({
    queryKey: ['listingMenu', { page_size: 0 }],
    queryFn: () => getListings({params: {status: 'published'}}),
  })

  const handleClick = useCallback((id:string) => {
    return () => {
      router.push(`/host-dashboard/calendar/${id}`)
    }
  },
  [router]
  )
  
  return (
    <div className=''>
      <div className='px-3 mt-5'>
        <h6 className='text-xl font-semibold'>Calendar</h6>
      </div>
      <div className=' w-full space-y-6'>
        <div className='h-full overflow-y-auto  pb-[60px]'>
          {listingMenuData?.data?.map((d:Listing, index:number) => (
            <div 
              key={index} 
              onClick={handleClick(d.unique_id)} 
              className='mx-3 my-5 shadow-md rounded-md cursor-pointer'
            >
              <div className='flex justify-start items-center gap-2 px-3'>
                <div className={`flex justify-start items-center min-w-[70px] max-w-[70px]`}>
                  <Image 
                    className='rounded-md aspect-[16/11] object-cover'
                    src={d?.cover_photo || galleryImg} 
                    width={100} height={100} alt=''/>
                </div>
                <div className=' px-3 py-3 flex flex-col'>
                  <p className='font-semibold text-[#202020] text-[16px] ellipsis-one-line'>{d.title}</p>
                  <p className='font-medium text-gray-500 text-[12px] capitalize'>{d.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarListing
