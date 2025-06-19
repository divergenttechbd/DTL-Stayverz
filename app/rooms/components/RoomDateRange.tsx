'use client'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import dayjs, { Dayjs } from 'dayjs'
import { FC, useCallback, useMemo, useState } from 'react'
import { DateRangeWithRoomDataTypes } from '~/app/rooms/components/RoomDetails'
import Month from '~/app/rooms/components/calendar/Month'
import useWindowSize from '~/hooks/useWindowSize'

export type Listing = {
  id: number
  unique_id: string
  title: string
  created_at: string
  status: string
  base_price: number | string
  amenities: any[]
  description: string
}

export type DateRange = {
  startDate: Dayjs | null
  endDate: Dayjs | null
}

type MonthAndYear = {
  month: number
  year: number
}

const RoomDateRange: FC<DateRangeWithRoomDataTypes & { some?: boolean }> = ({ selectedRange, data: calendarData, isSelecting, isPrevious, resetSelected, handleMouseEnter, inSelectedRange, generateDataByMonth, handleMouseClick, some }) => {
  const currentDate = dayjs()
  const [monthAndYear, setMonthAndYear] = useState<MonthAndYear>({ month: currentDate.get('month'), year: currentDate.get('year') })
  const { isMobileView } = useWindowSize()
  const addMonths = useCallback((monthAndYear: MonthAndYear, value: number) => {
    const next = dayjs().set('year', monthAndYear.year).set('month', monthAndYear.month).add(value, 'month')
    return {
      month: next.get('month'),
      year: next.get('year')
    }
  }, [])

  const handleRangeChange = useCallback((val: number) => () => {
    setMonthAndYear(prevState => addMonths(prevState, val))
  }, [addMonths])

  const canGoPrevious = useMemo(() => dayjs().startOf('month') < dayjs().set('year', monthAndYear.year).set('month', monthAndYear.month).startOf('month'), [monthAndYear])
  const canGoNext = useMemo(() => {
    const lastDate = Object.keys(calendarData?.calendar_data || {}).sort()?.pop()
    return lastDate ? dayjs(lastDate).add(-1, 'month').startOf('month') > dayjs().set('year', monthAndYear.year).set('month', monthAndYear.month).startOf('month') : false
  }, [calendarData, monthAndYear.month, monthAndYear.year])

  const data = useMemo(() => generateDataByMonth(monthAndYear.year, monthAndYear.month), [generateDataByMonth, monthAndYear])
  const nextMonthData = useMemo(() => {
    const nextMonthAndYear = addMonths(monthAndYear, 1)
    return generateDataByMonth(nextMonthAndYear.year, nextMonthAndYear.month)
  }, [addMonths, generateDataByMonth, monthAndYear])

  return (
    <div className='flex flex-row'>
      <div className='w-full sm:w-[max-content]'>
        <div className=''>
          <div className='flex justify-between items-center text-center text-2xl font-semibold select-none'>
            <button
              type='button'
              onClick={handleRangeChange(-1)}
              className='disabled:opacity-30 disabled:cursor-not-allowed'
              disabled={!canGoPrevious}
            >
              <CaretLeft />
            </button>
            <h3 className='text-[#202020] text-base font-medium leading-6'>{data.month} {data.year}</h3>
            {!isMobileView &&
              <>
                <div></div>
                <h3 className='text-[#202020] text-base font-medium leading-6'>{nextMonthData.month} {nextMonthData.year}</h3>
              </>}
            <button type='button' onClick={handleRangeChange(1)}
              className='disabled:opacity-30 disabled:cursor-not-allowed'
              disabled={!canGoNext}>
              <CaretRight />
            </button>
          </div>
          <div className='grid sm:grid-cols-2 gap-4' onMouseLeave={handleMouseEnter(null)}>
            <Month some={some} data={calendarData} selectedRange={selectedRange} handleMouseEnter={handleMouseEnter} handleMouseClick={handleMouseClick} inSelectedRange={inSelectedRange} isSelecting={isSelecting} isPrevious={isPrevious} monthData={data} />
            {!isMobileView && <Month some={some} data={calendarData} selectedRange={selectedRange} handleMouseEnter={handleMouseEnter} handleMouseClick={handleMouseClick} inSelectedRange={inSelectedRange} isSelecting={isSelecting} isPrevious={isPrevious} monthData={nextMonthData} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDateRange
