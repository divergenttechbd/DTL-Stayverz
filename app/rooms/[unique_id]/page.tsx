'use client'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import HostDetails from '~/app/rooms/components/HostDetails'
import RoomBanners from '~/app/rooms/components/RoomBanners'
import RoomDetails from '~/app/rooms/components/RoomDetails'
import RoomReview from '~/app/rooms/components/RoomReview'

import useCalendar from '~/hooks/calendar/useCalendar'
import { getRoomDetails } from '~/queries/client/room'


import ThingsToKnow from '~/app/rooms/components/ThingsToKnow'
import RoomDetailsSkeleton from '~/app/rooms/components/loader/RoomDetailsSkeleton'
import Footer from '~/components/layout/Footer'


const HomePage = ({ params }: { params: { unique_id: string } }) => {

  const { data, refetch, error, isLoading } = useQuery({ queryKey: ['room-details', params.unique_id], queryFn: () => getRoomDetails({ params: { unique_id: params.unique_id } }) })
  const { selectedRange, isSelecting, isPrevious, resetSelected, handleMouseEnter, inSelectedRange, generateDataByMonth, handleMouseClick, setSelectedRange } = useCalendar(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.has('check_in') && searchParams.has('check_out')) {
      setSelectedRange({ startDate: dayjs(searchParams.get('check_in')), endDate: dayjs(searchParams.get('check_out')) })
    }
  }, [searchParams, setSelectedRange])


  return (
    <div className='relative sm:py-5'>
      {isLoading? <RoomDetailsSkeleton/> : 
        <div className='space-y-5 md:space-y-10'>
          {/* =========== BANNER SECTION =========== */}
          <RoomBanners data={data} />
          {/* =========== ROOM DETAILS SECTION ===========*/}
          <div className='sm:hidden px-5 xl:px-0 xl:container'>
            <div className='w-full border-b mt-3'></div>
          </div>
          <RoomDetails
            selectedRange={selectedRange}
            isSelecting={isSelecting}
            isPrevious={isPrevious}
            resetSelected={resetSelected}
            handleMouseEnter={handleMouseEnter}
            inSelectedRange={inSelectedRange}
            generateDataByMonth={generateDataByMonth}
            handleMouseClick={handleMouseClick}
            setSelectedRange={setSelectedRange}
            data={data}
          />

          {/* =========== SECTION END BORDER ===========*/}
          <div className='px-5 xl:px-0 xl:container pt-5'>
            <div className={`w-full border-b`}></div>
          </div>
          {/* =========== HOST DETAILS SECTION =========== */}
          <HostDetails    
            selectedRange={selectedRange}
            isSelecting={isSelecting}
            isPrevious={isPrevious}
            resetSelected={resetSelected}
            handleMouseEnter={handleMouseEnter}
            inSelectedRange={inSelectedRange}
            generateDataByMonth={generateDataByMonth}
            handleMouseClick={handleMouseClick}
            setSelectedRange={setSelectedRange}
            data={data} />
          <div className='px-5 xl:px-0 xl:container pt-5'><div className='w-full border-b'></div></div>
          {/* =========== REVIEW SECTION =========== */}
          <RoomReview data={data} isLoading={isLoading}/>
          <div className='px-5 xl:px-0 xl:container pt-5'><div className='w-full border-b'></div></div>
          {/* =========== THINGS TO KNOW =========== */}
          <ThingsToKnow data={data} />
          {/* ===================== FOOTER ========================== */}
          <Footer/>
        </div> }
    </div>
  )
}

export default HomePage


