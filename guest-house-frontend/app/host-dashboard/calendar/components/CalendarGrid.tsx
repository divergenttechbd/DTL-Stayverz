import React, { useCallback } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { IntervalDetails } from '~/app/host-dashboard/calendar/types'
import { DATE_FORMAT } from '~/constants/format'
import { Week } from '~/hooks/calendar/useCalendar'
import Day from '~/app/host-dashboard/calendar/components/Day'
import useWindowSize from '~/hooks/useWindowSize'

interface CalendarGridProps {
  week: Week;
  bookedIntervals: Record<string, IntervalDetails>;
  year: number;
  onMouseDown: Function;
  onBookingSelect: Function;
  onMouseEnter: Function;
  onMouseUp: Function;
  onTouch: Function;
  inDragRange: Function;
  inSelectedRange: Function;
  isDragging: boolean;
  isPrevious: Function;
  calendarData: any;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  week,
  bookedIntervals,
  year,
  onMouseDown,
  onBookingSelect,
  onMouseEnter,
  onMouseUp,
  onTouch,
  inDragRange,
  inSelectedRange,
  isDragging,
  isPrevious,
  calendarData,
}) => {
  const {isMobileView} = useWindowSize()
  const handleMouseDown = useCallback((day: Dayjs | null, disabled: boolean) => () => {
    if (disabled || isMobileView) return
    else onBookingSelect(undefined)()
    onMouseDown(day)()
  }, [onBookingSelect, isMobileView, onMouseDown])

  const handleMouseEnter = useCallback((day: Dayjs | null, disabled: boolean) => () => {
    if (disabled || isMobileView) return
    else onMouseEnter(day)()
  }, [onMouseEnter, isMobileView])

  const handleMouseUp = useCallback((disabled: boolean) => () => {
    if (disabled || isMobileView) return
    else onMouseUp()()
  }, [onMouseUp, isMobileView])

  const handleTouch = useCallback((day: Dayjs | null, disabled: boolean) => () => {
    if (disabled) return
    else onTouch(day)()
  }, [onTouch])

  return (
    <div className='flex w-full'>
      {week.map((day, dayIndex) => {
        const previous = isPrevious(day)
        const isBooked = calendarData?.[day?.format(DATE_FORMAT) || '']?.is_booked
        const isStartOfAnInterval = bookedIntervals[day?.format(DATE_FORMAT) || '']
        return (
          <Day
            key={dayIndex}
            day={day}
            dayIndex={dayIndex}
            isInDragRange={isDragging && inDragRange(day)}
            isInSelectedRange={inSelectedRange(day)}
            isPrevious={previous}
            isToday={dayjs().isSame(day, 'day')}
            isBlocked={calendarData?.[day?.format(DATE_FORMAT) || '']?.is_blocked}
            isBooked={isBooked}
            isStartOfAnInterval={bookedIntervals[day?.format(DATE_FORMAT) || '']}
            onDayMouseDown={handleMouseDown(day,  previous || isBooked)}
            onDayMouseEnter={handleMouseEnter(day, previous || isBooked)}
            onDayMouseUp={handleMouseUp( previous || isBooked)}
            onTouch={handleTouch(day, previous || isBooked)}
            onBookingSelect={onBookingSelect}
            bookingData={isStartOfAnInterval && bookedIntervals[day?.format(DATE_FORMAT) || '']}
            price={calendarData?.[day?.format(DATE_FORMAT) || '']?.price}
          />
        )
      })}
    </div>
  )
}

export default CalendarGrid
