import { Dayjs } from 'dayjs'
import React, { FC } from 'react'
import { DateRange, Week } from '~/hooks/calendar/useCalendar'

type MonthProps = {
  monthData: any
  inSelectedRange: Function
  isPrevious: Function
  isSelecting: boolean
  handleMouseClick: Function
  handleMouseEnter: Function
  selectedRange: DateRange
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Month: FC<MonthProps> = ({ monthData, handleMouseEnter, inSelectedRange, selectedRange, isSelecting, isPrevious, handleMouseClick }) => {
  const draggingStyle = 'bg-gray-200'
  const selectedStyle = 'text-white rounded-full bg-[#222222]'

  return monthData ? (
    <div key={monthData.month} className='mb-10 mt-'>
      <div className='flex'>
        {days.map(d => (
          <div key={d} className='flex grow py-6 justify-center color-white box-border bg-white border-b text-[12px] sm:text-[16px]'>
            {d}
          </div>
        ))}
      </div>
      <div>
        <div className='flex flex-col' id={`${monthData.month}_${monthData.year}`}>
          {monthData.weeks.map((week:Week, week_index:number) => {
            return (
              <div key={week_index} className={`flex${week_index === 0 ? '' : ' grow'}${week_index === monthData.totalWeeks - 1 ? '' : ' grow'}`}>
                {
                  week.map((day:(Dayjs|null), day_index:number) => {
                    const isMarginal = (selectedRange.startDate && selectedRange.startDate === day) || (selectedRange.endDate && selectedRange.endDate === day)
                    const isInSelectedRange = inSelectedRange(day)
                    const previous = isPrevious(day)
                    return (<button
                      key={`${week_index} ${day_index}`}
                      disabled={previous}
                      className={`m-1 flex grow basis-0 justify-center select-none cursor-pointer
                        color-white box-border
                        disabled:cursor-not-allowed disabled:text-gray-400 disabled:line-through
                        ${day ? '' : 'opacity-0'} 
                        ${isInSelectedRange ? isMarginal ? selectedStyle  : draggingStyle  : ''} 
                      `}
                      onClick={handleMouseClick(day)}
                      onMouseEnter={handleMouseEnter(day)}
                    >
                      <div>
                        <p>{day?.get('D') || '-'}</p>
                      </div>
                    </button>)
                  })                  
                }
              </div>
            )
          })}
        </div>
      </div>
    </div>
  ) : null
}

export default Month
