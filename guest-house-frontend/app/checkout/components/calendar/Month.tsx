import { Dayjs } from 'dayjs'
import React, { FC } from 'react'
import { DateRange, Week } from '~/hooks/calendar/useCalendar'
import { DATE_FORMAT } from '~/constants/format'
import { styles } from '~/styles/classes'

export type MonthProps = {
  monthData: any
  inSelectedRange: Function
  isPrevious: Function
  isSelecting: boolean
  handleMouseClick: Function
  handleMouseEnter: Function
  selectedRange: DateRange
  some?:boolean
  data: any
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Month: FC<MonthProps> = ({ monthData, handleMouseEnter, inSelectedRange, data, selectedRange, isSelecting, isPrevious, handleMouseClick ,some}) => {
  const draggingStyle = 'bg-gray-100 '
  const selectedStyle = 'bg-[#222222] text-[#ffffff]'
  
  return monthData ? (
    <div key={monthData.month} className='my-5'>
      <div className='flex'>
        {days.map(d => (
          <div key={d} className=' px-[10px] py-2 justify-center color-white box-border bg-white mb-1 text-[12px] text-[#717171] font-[700]'>
            {d}
          </div>
        ))}
      </div>
      <div>
        <div className='flex flex-col' id={`${monthData.month}_${monthData.year} `}>
          {monthData.weeks.map((week:Week, week_index:number) => {
            return (
              <div key={week_index} className={`flex ${week_index === 0 ? '' : ' grow'}${week_index === monthData.totalWeeks - 1 ? '' : ' grow'}`}>
                {
                  week.map((day:(Dayjs|null), day_index:number) => {
                    const isMarginal = (selectedRange.startDate && selectedRange.startDate?.format('DD-MM-YYYY') === day?.format('DD-MM-YYYY')) || (selectedRange.endDate && selectedRange.endDate?.format('DD-MM-YYYY') === day?.format('DD-MM-YYYY'))
                    const isInSelectedRange = inSelectedRange(day)
                    const previous = isPrevious(day)

                    return (
                      <div
                        key={`${week_index} ${day_index}`}>
                        <button
                          type='button'
                          key={`${week_index} ${day_index}`}
                          disabled={previous || data?.calendar_data?.[day?.format(DATE_FORMAT) || '']?.is_blocked}
                          className={` p-[1px]  basis-0 select-none cursor-pointer
                        color-white box-border
                        disabled:cursor-not-allowed disabled:text-gray-300
                        // ${styles.flexCenter}
                        ${day ? '' : 'opacity-0'} 
                        ${isInSelectedRange ? isMarginal ? ''  : draggingStyle  : ''} 
                      `}
                          onMouseEnter={handleMouseEnter(day)}
                          onClick={handleMouseClick(day)}
                        >
                          <div className={` ${styles.flexCenter} 
                          ${(isInSelectedRange && isMarginal) ? selectedStyle : '' } 
                         w-[40px] h-[40px] rounded-full border border-transparent hover:border-black`}>
                            <p className='text-[14px] font-[600]'>
                              {day?.get('D') || '-'}
                            </p>
                          </div>
                        </button>
                      </div>
                    )
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
