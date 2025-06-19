'use client'
import { Bed, CaretRight, ChalkboardSimple, DoorOpen, FlowerTulip, Hourglass, MapPin } from '@phosphor-icons/react'
import { Bathtub } from '@phosphor-icons/react/dist/ssr/Bathtub'
import { Users } from '@phosphor-icons/react/dist/ssr/Users'
import dayjs from 'dayjs'
import { truncate } from 'lodash'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { FC, useCallback, useEffect, useState } from 'react'
import BookingCard from '~/app/rooms/components/BookingCard'
import ReserveMobile from '~/app/rooms/components/ReserveMobile'
import RoomDateRange from '~/app/rooms/components/RoomDateRange'
import { GuestCounts } from '~/app/rooms/components/guestDropdown/GuestDropDown'
import { useBookingCard } from '~/app/rooms/components/hooks/useBookingCard'
import Avatar from '~/components/Images/Avatar'
import { DateRange } from '~/components/form/inputs/DateRangeInput/DateRangeInput'
import Modal from '~/components/modal/Modal'
import { useModal } from '~/components/modal/hooks/useModal'
import { styles } from '~/styles/classes'


export type DateRangeTypes = {
  inSelectedRange: Function
  isPrevious: Function
  isSelecting: boolean
  handleMouseClick: Function
  handleMouseEnter: Function
  selectedRange: DateRange
  resetSelected: Function
  generateDataByMonth: Function
}


export type RoomDateRangeProps = {
  dateRangeDefaultValue?: DateRange,
  handleChange: (value: DateRange) => void
}

export const getStayingDuration = (value: DateRange) => {

  const startDate = dayjs(value?.startDate)
  const endDate = dayjs(value?.endDate)

  const nights = endDate.diff(startDate, 'day')

  return {
    totalNights: nights > 0 ? nights : 0,
    arrivalDate: startDate.isValid() ? startDate.format('MMM D, YYYY') : 'Arrival Date',
    leavingDate: endDate.isValid() ? endDate.format('MMM D, YYYY') : 'Leaving Date'
  }
}


const RoomDetails: React.FC<any> = (props) => {
  const [isOpen, handleModalOpen, handleModalClose,] = useModal()
  const { selectedRange, data, setSelectedRange} = props
  const [error, handleValidate, minimumNightsSelected, hasDateRangeSelected] = useBookingCard(selectedRange, data)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.has('check_in') && searchParams.has('check_out')) {
      setSelectedRange({ startDate: dayjs(searchParams.get('check_in')), endDate: dayjs(searchParams.get('check_out')) })
    }
  }, [searchParams, setSelectedRange])

  return (
    <>
      {/* =========== RESERVE MOBILE =========== */}
      <ReserveMobile
        {...props}
        isOpen={isOpen}
        handleModalOpen={handleModalOpen}
        handleModalClose={handleModalClose}
      />
      
      <div className='px-5 xl:px-0 xl:container'>
        <div className='flex gap-10 w-full'>
          {/* =========== LEFT SECTION =========== */}
          <div className='flex-[1] space-y-5 sm:space-y-7'>

            {/* =========== TITLE & HOST  =========== */}
            <TitleAndHost data={data} />
            
            {/* =========== HOST AMENITIES =========== */}
            {/* <HostAmenities data={data} /> */}

            {/* =========== ROOM DESCRIPTION =========== */}
            <RoomsDescription data={data} />

            {/* =========== WHERE YOU WILL SLEEP =========== */}
            {/* <WhereYouWillSleep data={data} /> */}

            {/* =========== Amenities =========== */}
            <Amenities data={data} />

            {/* =========== TOTAL NIGHTS =========== */}
            <TotalNights
              {...props}
            />
          </div>
          {/* =========== RIGHT || STICKY SECTION =========== */}
          <div className='hidden lg:block w-full lg:flex-[0.5] relative'>
            {/* CARD */}
            <BookingCard
              {...props}
              error={!minimumNightsSelected || !hasDateRangeSelected ? error : undefined}
              onValidate={handleValidate}
            />
          </div>
        </div>
      </div>

    </>

  )
}

export default RoomDetails




export const TitleAndHost: React.FC<any> = ({ data }) => {
  return (
    <div className={`w-full space-y-5`}>
      <div className='flex justify-start items-center gap-5'>
        <div className={`${styles.flexCenter} relative`}>
          <div className={`border-[2px] rounded-full w-[45px] h-[45px] ${styles.flexCenter}`}>
            {data?.host?.image ?
              <Image
                src={data?.host?.image}
                alt='profile-image'
                fill
                className='rounded-full relative object-cover'
              />
              : <Avatar />}
          </div>
        </div>
        <div className='flex-1 space-y-3'>
          <h2 className='text-lg font-medium leading-7 md:text-xl md:font-medium md:leading-7   text-[#202020]'>
            Entire villa hosted by <Link className='' href={`/user/${data?.host?.id}`}>{data?.host?.full_name}</Link>
          </h2>
          <div className='hidden md:flex justify-start items-center flex-wrap gap-5 ml-[3px]'>
            <div className='flex justify-start items-center gap-2'>
              <span className=''>
                <Users  size={20} color={'#616161'} className='text-[#616161]'/>
              </span>
              <span className='flex justify-start items-center gap-1 text-[#616161] text-base font-normal leading-6 mt-[1px]'>
                {data?.guest_count} {data?.guest_count <= 1 ? 'guest': 'guests'}
              </span>
            </div>
            <div className='flex justify-start items-center gap-2'>
              <span className=''>
                <DoorOpen  size={20} color={'#616161'} className='text-[#616161]'/>
              </span>
              <span className='flex justify-start items-center gap-1 text-[#616161] text-base font-normal leading-6 mt-[1px]'>
                {data?.bedroom_count} {data?.bedroom_count <= 1 ? 'bedroom': 'bedrooms'} 
              </span>
            </div>
            <div className='flex justify-start items-center gap-2'>
              <span className=''>
                <Bed size={20} color={'#616161'} className='text-[#616161]'/>
              </span>
              <span className='flex justify-start items-center gap-1 text-[#616161] text-base font-normal leading-6 mt-[1px]'>
                {data?.bed_count} {data?.bed_count <= 1 ? 'bed': 'beds'} 
              </span>
            </div>
            <div className='flex justify-start items-center gap-2'>
              <span className=''>
                <Bathtub size={20} color={'#616161'} className='text-[#616161]'/>
              </span>
              <span className='flex justify-start items-center gap-1 text-[#616161] text-base font-normal leading-6 mt-[1px]'>
                {data?.bathroom_count} {data?.bathroom_count <= 1 ? 'bath': 'baths'} 
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='flex md:hidden  justify-start items-center flex-wrap gap-3 ml-[3px]'>
        <div className='flex justify-start items-center gap-2'>
          <span className=''>
            <Users  size={20} color={'#616161'} className='text-[#616161]'/>
          </span>
          <span className='flex justify-start items-center gap-1 text-[#616161] text-base font-normal leading-6 mt-[1px]'>
            {data?.guest_count} {data?.guest_count <= 1 ? 'guest': 'guests'}
          </span>
        </div>
        <div className='flex justify-start items-center gap-2'>
          <span className=''>
            <DoorOpen  size={20} color={'#616161'} className='text-[#616161]'/>
          </span>
          <span className='flex justify-start items-center gap-1 text-[#616161] text-base font-normal leading-6 mt-[1px]'>
            {data?.bedroom_count} {data?.bedroom_count <= 1 ? 'bedroom': 'bedrooms'}
          </span>
        </div>
        <div className='flex justify-start items-center gap-2'>
          <span className=''>
            <Bed size={20} color={'#616161'} className='text-[#616161]'/>
          </span>
          <span className='flex justify-start items-center gap-1 text-[#616161] text-base font-normal leading-6 mt-[1px]'>
            {data?.bed_count} {data?.bed_count <= 1 ? 'bed': 'beds'}
          </span>
        </div>
        <div className='flex justify-start items-center gap-2'>
          <span className=''>
            <Bathtub size={20} color={'#616161'} className='text-[#616161]'/>
          </span>
          <span className='flex justify-start items-center gap-1 text-[#616161] text-base font-normal leading-6 mt-[1px]'>
            {data?.bathroom_count} {data?.bathroom_count <= 1 ? 'bath': 'baths'}
          </span>
        </div>
      </div>
      <div className='w-full border-b mt-3'></div>
    </div>
  )
}

export const HostAmenities: React.FC<any> = ({ data }) => (
  <div className={`w-full pb-5 md:pb-9`}>
    <div className='flex flex-col justify-start items-start gap-7'>
      {/* ITEM ONE */}
      <div className='flex justify-start items-center gap-5'>
        <div className={`${styles.flexCenter}`}>
          <DoorOpen size={30} color='#222222' />
        </div>
        <div className='space-y-1'>
          <p className='text-[#202020] text-[16px]  font-[700]'>
            Self check-in
          </p>
          <p className='text-[#717171] text-[14px] font-[500]'>
            Check yourself in with the lockbox.
          </p>
        </div>
      </div>
      {/* ITEM TWO */}
      <div className='flex justify-start items-center gap-5'>
        <div className={`${styles.flexCenter}`}>
          <Hourglass size={30} color='#222222' />
        </div>
        <div className='space-y-1'>
          <p className='text-[#202020] text-[16px]  font-[700]'>
            Rajinder Kaur is a Superhost
          </p>
          <p className='text-[#717171] text-[14px] font-[500]'>
            Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
          </p>
        </div>
      </div>
      {/* ITEM THREE */}
      <div className='flex justify-start items-center gap-5'>
        <div className={`${styles.flexCenter}`}>
          <MapPin size={30} color='#222222' />
        </div>
        <div className='space-y-1'>
          <p className='text-[#202020] text-[16px] font-[700]'>
            Great location
          </p>
          <p className='text-[#717171] text-[14px] font-[500]'>
            100% of recent guests gave the location a 5-star rating.
          </p>
        </div>
      </div>
    </div>
  </div>
)

export const RoomsDescription: React.FC<any> = ({ data }) => {

  const [showFullReview, setShowFullReview] = useState(data?.description?.length < 100)
  const handleToggle = useCallback(() => {
    setShowFullReview(prev => !prev)
  }, []) 


  return (<div className={`w-full`}>
    <div className='flex flex-col justify-start items-start gap-5 '>
      <h2 className='text-[#202020] text-lg font-medium leading-7 tracking-normal text-left md:text-xl md:font-medium md:leading-7'>Description</h2>
      <p className='text-[#202020] text-[16px] font-[400] leading-7'>
        {showFullReview ? data?.description : truncate(data?.description, {'length': 100})}
      </p>
      {!showFullReview && 
      <button onClick={handleToggle} className='text-sm font-medium leading-5 md:text-base md:font-medium md:leading-6  flex justify-start items-center gap-1'>
        <span className=''>Show More</span>
        <CaretRight size={16} />
      </button>}
      
    </div>
    <div className='w-full border-b mt-5'></div>
  </div>)
}

export const WhereYouWillSleep: React.FC<any> = ({ data }) => (
  <div className={`w-full pb-5 md:pb-9`}>
    <div className='flex flex-col justify-start items-start gap-5'>
      <div className='space-y-5'>
        <h2 className='text-lg font-medium leading-7 md:text-xl md:font-medium md:leading-7   text-[#202020]'>
          Where you&lsquo;ll sleep
        </h2>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {/* CARD ONE */}
          <div className='w-[220px] h-full border rounded-2xl p-6 space-y-2'>
            <div className='flex justify-start items-end gap-2'>
              <ChalkboardSimple size={32} color='#222222' />
              <Bed size={30} color='#222222' />
            </div>
            <p className='text-[#202020] text-[16px]  font-[700]'>Bedroom 1</p>
            <p className='text-[#202020] text-[16px]  font-[500] sm:w-[80%]'>1 king bed, 1 floor mattress</p>
          </div>
          {/* CARD TWO */}
          <div className='w-[220px] h-full border rounded-2xl p-6 space-y-2'>
            <div className='flex justify-start items-end gap-2'>
              <ChalkboardSimple size={32} color='#222222' />
              <Bed size={30} color='#222222' />
            </div>
            <p className='text-[#202020] text-[16px]  font-[700]'>Bedroom 2</p>
            <p className='text-[#202020] text-[16px]  font-[500] sm:w-[80%]'>1 king bed, 1 floor mattress</p>
          </div>
          {/* CARD THREE */}
          <div className='w-[220px] h-full border rounded-2xl p-6 space-y-2'>
            <div className='flex justify-start items-end gap-2'>
              <ChalkboardSimple size={32} color='#222222' />
              <Bed size={30} color='#222222' />
            </div>
            <p className='text-[#202020] text-[16px]  font-[700]'>Bedroom 3</p>
            <p className='text-[#202020] text-[16px]  font-[500] sm:w-[80%]'>1 king bed, 1 floor mattress</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)


export const Amenities: React.FC<any> = ({ data }) => {

  const [isModalOpen, handleModalOpen, handleModalClose] = useModal()

  return (
    <div className={`w-full`}>
      <div className='flex flex-col gap-7'>
        <h2 className='text-lg font-medium leading-7 md:text-xl md:font-medium md:leading-7   text-[#202020]'>
            House Details
        </h2>
        <div className='flex justify-start gap-4 flex-wrap'>
          {data?.amenities?.map((item: any, index: number) => (index <= 7 &&
              <div key={index + 1} className={`${styles.flexCenter} bg-[#F2F2F5] px-5 py-[0.35rem] rounded-[20px] gap-1`}>
                {item?.amenity?.icon ?
                  <div className={`${styles.flexCenter}`}>
                    <Image src={item?.amenity?.icon} alt='' width={22} height={22} className='w-[22px] h-[22px]' />
                  </div> :
                  <FlowerTulip size={30} color='#222222' />}
                <p className='text-[#616161] text-sm font-normal leading-6'>{item?.amenity?.name}</p>
              </div>))}

        </div>
        <div>
          {data?.amenities?.length >= 8 && <button onClick={handleModalOpen} className='text-[#202020] text-sm font-medium leading-5 md:text-base md:font-semibold md:leading-6  flex justify-start items-center gap-1 px-6 py-2 border border-[#202020] rounded-lg !hidden'>
              Show all {data?.amenities?.length} amenities
          </button>}
        </div>
      </div>
      <div className='w-full border-b mt-5'></div>
      {/* AMENITIES MODAL */}
      <Modal
        show={isModalOpen}
        onClose={handleModalClose}
        modalContainerclassName='w-[90vw] sm:w-[45rem] rounded-xl pt-3'
        titleContainerClassName='items-center justify-center gap-5 p-4'
        crossBtnClassName='absolute left-4 top-1/2 -translate-y-1/2'
        bodyContainerClassName='p-6'
        closeOnOutsideClick={true}
      >
        <div className='overflow-hidden'>
          <div className='space-y-5 max-h-[80vh] overflow-y-auto no-scrollbar'>
            <h2 className='text-lg font-medium leading-7 md:text-xl md:font-medium md:leading-7   text-[#202020]'>
              House Details
            </h2>
            <div className='mx-auto grid gap-y-5 w-full'>
              {data?.amenities?.map((item: any, index: number) => (
                <div key={index + 1} className='flex justify-start items-center gap-3 border-b pb-3'>
                  {item?.amenity?.icon ?
                    <div className={`${styles.flexCenter}`}>
                      <Image src={item?.amenity?.icon} alt='' width={30} height={30} />
                    </div> :
                    <FlowerTulip size={30} color='#222222' />}
                  <p className='text-[#202020] text-[16px]  font-[400]'>{item?.amenity?.name}</p>
                </div>))}

            </div>
          </div>
        </div>
      </Modal>
    </div>
  )


}


export interface DateRangeWithRoomDataTypes extends DateRangeTypes {
  data: any
  className?: string
  onChange?: (values: {
    guests: GuestCounts
    selectedRange: DateRange
  }) => void
  error?: string
  onValidate?: () => boolean
  setSelectedRange: Function
}


export const TotalNights: FC<DateRangeWithRoomDataTypes> = (props) => {
  const { selectedRange, data, resetSelected } = props
  const { totalNights, arrivalDate, leavingDate } = getStayingDuration(selectedRange)

  const clearDates = () => {
    resetSelected()
  }

  return (
    <div className='w-full pt-5'>
      <div className='space-y-5'>
        <div className='space-y-1'>
          <h2 className='text-lg font-medium leading-7 md:text-xl md:font-medium md:leading-7   text-[#202020]'>
            {totalNights} nights in {data?.title}
          </h2>
          <p className=' gap-1 text-[#717171] text-[14px] font-[500]'>
            {arrivalDate} - {leavingDate}
          </p>
        </div>
        <div className={`w-full md:w-[max-content] p-5 rounded-[16px] shadow-md`}>
          <RoomDateRange  {...props} some={true} />
          <div className='flex justify-between items-center'>
            <div className='hidden sm:flex justify-start items-center gap-5 md:gap-10'>
              <div className='flex justify-start items-center gap-3 md:gap-4'>
                <div className='min-w-[12px] max-w-[12px] min-h-[12px] max-h-[12px] rounded-full bg-[#2D3845]'></div>
                <p className='text-sm font-normal leading-6'>Available</p>
              </div>
              <div className='flex justify-start items-center gap-3 md:gap-4'>
                <div className='min-w-[12px] max-w-[12px] min-h-[12px] max-h-[12px] rounded-full bg-[#DCDDE1]'></div>
                <p className='text-sm font-normal leading-6'>Unavailable</p>
              </div>
              <div className='flex justify-start items-center gap-3 md:gap-4'>
                <div className='min-w-[12px] max-w-[12px] min-h-[12px] max-h-[12px] rounded-full bg-[#f66c0e]'></div>
                <p className='text-sm font-normal leading-6'>Selected</p>
              </div>
            </div>
            <button type='button' onClick={clearDates} className='text-[#616161] text-sm font-normal leading-6 hover:bg-[rgba(0,0,0,0.01)] py-1 px-2 rounded-md underline'>Clear Dates</button>
          </div>
        </div>
      </div>
    </div>
  )
}
