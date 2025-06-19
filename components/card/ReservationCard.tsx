import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { FC, useMemo } from 'react'

interface IReservationCardProps {
  eventType?: string
  guestImage?: string
  guestName?: string
  checkIn?: string
  checkOut?: string
  listingName?: string
  chatId?: string
  className?: string
  onClickHandler?: () => void
  reviewOnClick?: () => void
}

const ReservationCard: FC<IReservationCardProps> = ({
  eventType,
  guestImage,
  guestName,
  checkIn,
  checkOut,
  listingName,
  chatId,
  onClickHandler,
  className,
  reviewOnClick
}) => {

  const checkInDate = useMemo(() => dayjs(checkIn).format('MMM D'), [checkIn])
  const checkOutDate = useMemo(() => dayjs(checkOut).format('MMM D'), [checkOut])


  return (
    <div className={`w-[300px] shadow-sm border border-[#EFEFEF] rounded-xl ${className} hover:bg-[#FCFDFF]`}>
      <div onClick={onClickHandler} className='inline-block w-full  cursor-pointer'>
        <div className='flex justify-start items-start mb-4 gap-3 px-5 pt-6 '>
          {guestImage ?
            (<div className=''>
              <Image src={guestImage} alt='guest' height={48} width={48} className='min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px] rounded-full' />
            </div>) :
            (<svg className='min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px] text-gray-200 dark:text-gray-400' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z' />
            </svg>
            )}
          <div className='space-y-1 w-full'>
            <p className='text-base font-medium text-[#f66c0e]'>{eventType}</p>
            <p className='text-xs font-medium  text-[#9C9C9C]'>{guestName}</p>
          </div>
        
        </div>
        <div className='px-5 '>
          <p className='text-base font-semibold text-[#202020]'>{checkInDate} - {checkOutDate}</p>
          <span className='text-sm font-medium text-[#9C9C9C] ellipsis-one-line'>{listingName}</span>
        </div>
        <div className='mt-8 px-5 pb-6 '>
          {
            eventType?.trim() === 'Pending Review' ?  
              <button onClick={reviewOnClick}  className='text-[#f66c0e] border border-[#f66c0e] hover:bg-[#f66c0e] hover:text-[#ffffff] px-4 py-2 leading-6 rounded-lg font-medium text-sm w-full mt-2  flex justify-center items-center'>Review</button> :  
              <Link 
                href={`/host-dashboard/inbox?conversation_id=${chatId}`} 
                className='text-[#f66c0e] border border-[#f66c0e] hover:bg-[#f66c0e] hover:text-[#ffffff] px-4 py-2 leading-6 rounded-lg font-medium text-sm w-full mt-2  flex justify-center items-center'
                onClick={(event)=>event.stopPropagation()}
              >Message</Link>
          }
        </div>
      </div>
    </div>
  )
}

export default ReservationCard
