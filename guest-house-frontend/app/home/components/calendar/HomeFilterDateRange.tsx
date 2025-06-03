'use client'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import dayjs, { Dayjs } from 'dayjs'
import { FC, useCallback, useMemo, useState } from 'react'
import Month from '~/app/home/components/calendar/Month'
import { DateRangeTypes } from '~/app/rooms/components/RoomDetails'
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

const HomeFilterDateRange: FC<DateRangeTypes & { some?: boolean }> = ({ selectedRange, isSelecting, isPrevious, resetSelected, handleMouseEnter, inSelectedRange, generateDataByMonth, handleMouseClick, some }) => {
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



  const data = useMemo(() => generateDataByMonth(monthAndYear.year, monthAndYear.month), [generateDataByMonth, monthAndYear])
  const nextMonthData = useMemo(() => {
    const nextMonthAndYear = addMonths(monthAndYear, 1)
    return generateDataByMonth(nextMonthAndYear.year, nextMonthAndYear.month)
  }, [addMonths, generateDataByMonth, monthAndYear])



  return (
    <div className='flex flex-row w-full sm:w-auto'>
      <div className='w-full sm:w-[max-content]'>
        <div className='flex justify-between items-center text-center text-2xl font-semibold select-none'>
          <CaretLeft className='h-[18px] sm:h-auto' onClick={handleRangeChange(-1)} />
          <h3 className='text-[#202020] text-[12px] sm:text-[16px] font-semibold'>{data.month} {data.year}</h3>
          {!isMobileView && <><div></div>
            <h3 className='text-[#202020] text-[12px] sm:text-[16px] font-semibold'>{nextMonthData.month} {nextMonthData.year}</h3></>}
          <CaretRight className='h-[18px] sm:h-auto' onClick={handleRangeChange(1)} />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 sm:gap-4' onMouseLeave={handleMouseEnter(null)}>
          <Month some={some} selectedRange={selectedRange} handleMouseEnter={handleMouseEnter} handleMouseClick={handleMouseClick} inSelectedRange={inSelectedRange} isSelecting={isSelecting} isPrevious={isPrevious} monthData={data} />
          {!isMobileView && <Month some={some} selectedRange={selectedRange} handleMouseEnter={handleMouseEnter} handleMouseClick={handleMouseClick} inSelectedRange={inSelectedRange} isSelecting={isSelecting} isPrevious={isPrevious} monthData={nextMonthData} />}
        </div>
      </div>
    </div>
  )
}

export default HomeFilterDateRange
