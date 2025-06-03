'use client'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import dayjs, { Dayjs } from 'dayjs'
import { FC, useCallback, useMemo, useState } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Month from '~/components/form/inputs/DateRangeInput/Month'
import { ICommonInputMeta } from '~/components/form/types'
import useCalendar from '~/hooks/calendar/useCalendar'

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
  month: number;
  year: number;
}

export interface IDateRangeInputMeta extends ICommonInputMeta {
  description?: string;
}

interface DateRangeInputProps {
  meta: IDateRangeInputMeta;
  formInstance: UseFormReturn;
  isInvalid: boolean;
}

export const DateRange:FC<DateRangeInputProps> = ({meta, formInstance}) => {
  const {control, watch} = formInstance

  const {selectedRange, isSelecting, isPrevious, resetSelected, handleMouseEnter, inSelectedRange, generateDataByMonth, handleMouseClick} = useCalendar(false)
  const currentDate = dayjs()
  const [monthAndYear, setMonthAndYear] = useState<MonthAndYear>({month: currentDate.get('month'), year: currentDate.get('year')})

  const addMonths = useCallback((monthAndYear:MonthAndYear, value: number) => {
    const next = dayjs().set('year', monthAndYear.year).set('month', monthAndYear.month).add(value, 'month')
    return {
      month: next.get('month'),
      year: next.get('year')
    }
  }, [])

  const handleClick = useCallback(  (onChange:Function) => (val:Dayjs) => () => {
    handleMouseClick(val)()

    if(selectedRange.startDate && !selectedRange.endDate) {
      // onChange(`${selectedRange.startDate.format(DATE_FORMAT)}|${val.format(DATE_FORMAT)}`)
      onChange({startDate: selectedRange.startDate, endDate: val})
    } else {
      // onChange(`${val.format(DATE_FORMAT)}|null}`)
      onChange({startDate: val, endDate: null})
    }
  }, [handleMouseClick, selectedRange.endDate, selectedRange.startDate])

  const handleRangeChange = useCallback((val:number) => () => {
    setMonthAndYear(prevState => addMonths(prevState, val))
  }, [addMonths])

  const data = useMemo(() => generateDataByMonth(monthAndYear.year, monthAndYear.month), [generateDataByMonth, monthAndYear])
  const nextMonthData = useMemo(() => {
    const nextMonthAndYear = addMonths(monthAndYear, 1)
    return generateDataByMonth(nextMonthAndYear.year, nextMonthAndYear.month)
  }, [addMonths, generateDataByMonth, monthAndYear])

  return (
    <Controller
      name={meta.key}
      control={control}
      render={({ field: { value, onChange } }) => (
        <div className='flex flex-col w-full'>
          <div className='flex justify-between items-center text-center text-2xl font-semibold select-none'>
            <CaretLeft onClick={handleRangeChange(-1)}/>
            <h3>{data.month} {data.year}</h3>
            <div></div>
            <h3>{nextMonthData.month} {nextMonthData.year}</h3>
            <CaretRight onClick={handleRangeChange(1)}/>
          </div>
          <div className='grid grid-cols-2 gap-4' onMouseLeave={handleMouseEnter(null)}>
            <Month selectedRange={selectedRange} handleMouseEnter={handleMouseEnter} handleMouseClick={handleClick(onChange)} inSelectedRange={inSelectedRange} isSelecting={isSelecting} isPrevious={isPrevious} monthData={data}/>
            <Month selectedRange={selectedRange} handleMouseEnter={handleMouseEnter} handleMouseClick={handleClick(onChange)} inSelectedRange={inSelectedRange} isSelecting={isSelecting} isPrevious={isPrevious} monthData={nextMonthData}/>
          </div>
        </div>
      )}
    />
  )
}
