// Day.tsx

import { Dayjs } from 'dayjs'
import React from 'react'
import { IntervalDetails } from '~/app/host-dashboard/calendar/types'
import { UserAvatar } from '~/components/layout/UserAvatar'

interface DayProps {
  day: Dayjs | null;
  dayIndex: number;
  isInDragRange: boolean;
  isInSelectedRange: boolean;
  isPrevious: boolean;
  isToday: boolean;
  isBlocked: boolean;
  isBooked: boolean;
  isStartOfAnInterval: IntervalDetails | null;
  onDayMouseDown: () => void;
  onDayMouseEnter: () => void;
  onDayMouseUp: () => void;
  onBookingSelect: Function;
  onTouch: () => void;
  bookingData: IntervalDetails | null;
  price: number
}

const Day: React.FC<DayProps> = ({
  day,
  dayIndex,
  isInDragRange,
  isInSelectedRange,
  isPrevious,
  isToday,
  isBlocked,
  isBooked,
  isStartOfAnInterval,
  onDayMouseDown,
  onDayMouseEnter,
  onDayMouseUp,
  onBookingSelect,
  onTouch,
  bookingData,
  price,
}) => {
  const draggingStyle = isInDragRange ? 'bg-gray-200' : ''
  const selectedStyle = '!bg-[#f66c0e] text-white rounded-lg'
  const isBookingStart = isStartOfAnInterval && bookingData?.isStartOfAnInterval
  const isBookingEnd = isStartOfAnInterval && bookingData?.isEndOfAnInterval
  const showBookingText = isStartOfAnInterval && bookingData?.showBookingText

  return (
    <div
      key={`${dayIndex}`}
      onMouseDown={onDayMouseDown}
      onMouseUp={onDayMouseUp}
      onMouseEnter={onDayMouseEnter}
      onTouchStart={onTouch}
      className={`flex grow basis-0 justify-center items-center border-b border-l ${dayIndex === 6 ? 'border-r' : ''}`}
    >
      <div
        className={`select-none relative color-white py-4 border-gray-300 ${(isPrevious || isBooked) ? 'cursor-not-allowed bg-gray-200' : 'cursor-pointer'
        } w-full ${isBlocked && !isInSelectedRange ? 'bg-gray-100' : ''} ${day ? '' : 'opacity-0'} ${draggingStyle} ${
          isInSelectedRange ? selectedStyle : ''
        } ${isToday ? 'border-black' : ''}`}
      >
        <div className='w-full text-center'>
          <p className={`${isBlocked && 'line-through'} h-full text-[14px] font-semibold sm:font-medium sm:text-[16px]`}>{day?.get('D') || '-'}</p>
          {isBooked && (
            <div
              onMouseDown={onBookingSelect(bookingData?.booking_data?.booking?.invoice_no)}
              style={{
                width: bookingData ? `${bookingData.lengthOfDate * 101 + (isBookingStart && isBookingEnd ? -130 : isBookingStart ? -50 : isBookingEnd ? -80 : 0)}%` : '0%',
              }}
              className={`${bookingData?.color} cursor-pointer z-10 h-8 top-10 items-center absolute ${isBookingStart ? 'ml-[50%] rounded-l-full' : ''} ${
                isBookingEnd ? 'rounded-r-full' : ''
              }`}
            >
              <div className='flex items-center ml-1 gap-1 h-full'>
                {isBookingStart && (
                  <div>
                    <UserAvatar size='xs' fullName={bookingData?.booking_data?.user?.full_name} image={bookingData?.booking_data?.user?.image} />{' '}
                  </div>
                )}
                {showBookingText && (
                  <div className='text-white text-xs font-medium whitespace-nowrap truncate ...'>{bookingData?.booking_data?.user?.full_name}</div>
                )}
              </div>
            </div>
          )}
          {
            price ? (
              <p className='text-xs mt-2'>
                <span>৳</span>
                {price}
              </p>
            ) : (
              <div className='animate-pulse w-10 flex justify-center'>
                <div className='w-6 h-2 rounded-sm bg-slate-300 block my-2'></div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Day
