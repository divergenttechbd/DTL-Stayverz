import dayjs, { Dayjs } from 'dayjs'
import React, { FC, useCallback, useMemo } from 'react'
import { DateRange, Week } from '~/hooks/calendar/useCalendar'
import { DATE_FORMAT } from '~/constants/format'
import Day from '~/app/rooms/components/calendar/Day'

export type MonthProps = {
  monthData: any
  inSelectedRange: Function
  isPrevious: Function
  isSelecting: boolean
  handleMouseClick: Function
  handleMouseEnter: Function
  selectedRange: DateRange
  some?: boolean
  data: any
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Month: FC<MonthProps> = ({ monthData, handleMouseEnter, inSelectedRange, data, selectedRange, isSelecting, isPrevious, handleMouseClick, some }) => {
  const selectableRange = useMemo(() => {
    if (!selectedRange?.startDate || !data?.calendar_data) return { start: null, end: null }
  
    const datesAfterInput = Object.keys(data?.calendar_data || {}).slice(
      Object.keys(data?.calendar_data).indexOf(selectedRange.startDate?.format(DATE_FORMAT)) + 1
    )
  
    const nextBlockedOrBookedIndex = datesAfterInput.findIndex(date => {
      const dayData = data?.calendar_data[date]
      return dayData && (dayData.is_blocked || dayData.is_booked)
    })
  
    const nextSelectableDate = nextBlockedOrBookedIndex !== -1 
      ? datesAfterInput[nextBlockedOrBookedIndex]
      : null
  
    return {
      start: selectedRange.startDate,
      end: nextSelectableDate ? dayjs(nextSelectableDate) : null
    }
  }, [selectedRange, data])
  

  const inSelectableRange = useCallback((day: Dayjs | null) => {
    if (!selectableRange.start || selectedRange?.endDate || !day)
      return true
    if (day.startOf('day') > selectableRange.start.startOf('day'))
      return !selectableRange.end || selectableRange.end >= day
    return false
  }, [selectedRange, selectableRange])

  return monthData ? (
    <div key={monthData.month} className='my-5'>
      <div className='flex'>
        {days.map(d => (
          <div key={d} className='w-full sm:w-auto flex justify-center items-center sm:px-[10px] py-2  color-white box-border bg-white mb-1 text-[12px] text-[#717171] font-[700]'>
            {d}
          </div>
        ))}
      </div>
      <div>
        <div className='w-full flex flex-col' id={`${monthData.month}_${monthData.year} `}>
          {monthData.weeks.map((week: Week, week_index: number) => {
            return (
              <div key={week_index} className={`flex justify-center items-center ${week_index === 0 ? '' : ' grow'}${week_index === monthData.totalWeeks - 1 ? '' : ' grow'}`}>
                {
                  week.map((day: (Dayjs | null), day_index: number) => {
                    const isMarginal = (selectedRange.startDate && selectedRange.startDate?.format('DD-MM-YYYY') === day?.format('DD-MM-YYYY')) || (selectedRange.endDate && selectedRange.endDate?.format('DD-MM-YYYY') === day?.format('DD-MM-YYYY'))
                    const isInSelectedRange = inSelectedRange(day)
                    const previous = isPrevious(day)
                    const isInSelectableRange = inSelectableRange(day)

                    return (
                      <Day key={day ? day?.format(DATE_FORMAT) : `${week_index}_${day_index}_${monthData.year}`} isInSelectableRange={isInSelectableRange} selectedRange={selectedRange} data={data} day={day} isMarginal={isMarginal} isInSelectedRange={isInSelectedRange} previous={previous} handleMouseClick={handleMouseClick} handleMouseEnter={handleMouseEnter} />
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
