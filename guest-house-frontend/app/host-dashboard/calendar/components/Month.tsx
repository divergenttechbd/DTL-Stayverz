import { FC } from 'react'
import CalendarGrid from '~/app/host-dashboard/calendar/components/CalendarGrid'
import WeekHeader from '~/app/host-dashboard/calendar/components/WeekHeader'
import { IntervalDetails } from '~/app/host-dashboard/calendar/types'
import { Week } from '~/hooks/calendar/useCalendar'

type MonthProps = {
  monthData: any;
  year: number;
  onMouseDown: Function;
  onMouseEnter: Function;
  onMouseUp: Function;
  onTouch: Function;
  inDragRange: Function;
  inSelectedRange: Function;
  isPrevious: Function;
  onBookingSelect: Function;
  isDragging: boolean;
  calendarData: any;
  bookedIntervals: Record<string, IntervalDetails>;
};

const Month: FC<MonthProps> = ({
  monthData,
  bookedIntervals,
  year,
  onMouseDown,
  onBookingSelect,
  onMouseEnter,
  onTouch,
  onMouseUp,
  inDragRange,
  inSelectedRange,
  isDragging,
  isPrevious,
  calendarData,
}) => {
  return monthData ? (
    <div key={monthData.month} className='sm:mb-10 sm:mt-4'>
      <h6 className='ml-2 sm:ml-0 text-xl sm:text-2xl sm:mb-2 font-medium'>{monthData.month}</h6>

      <WeekHeader />

      <div className='flex flex-col' id={`${monthData.month}_${year}`}>
        {monthData.weeks.map((week: Week, weekIndex: number) => (
          <CalendarGrid
            key={weekIndex}
            week={week}
            bookedIntervals={bookedIntervals}
            year={year}
            onMouseDown={onMouseDown}
            onBookingSelect={onBookingSelect}
            onMouseEnter={onMouseEnter}
            onMouseUp={onMouseUp}
            onTouch={onTouch}
            inDragRange={inDragRange}
            inSelectedRange={inSelectedRange}
            isDragging={isDragging}
            isPrevious={isPrevious}
            calendarData={calendarData}
          />
        ))}
      </div>
    </div>
  ) : null
}

export default Month
