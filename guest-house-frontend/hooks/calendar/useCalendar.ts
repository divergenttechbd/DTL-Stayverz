
import dayjs, { Dayjs } from 'dayjs'
import { useCallback, useState } from 'react'

export type DateRange = {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
};

export type Week = (Dayjs | null)[];
export type Month = {
  month: string | number;
  weeks: Week[];
};

const useCalendar = (draggingEnabled=true) => {
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isSelecting, setIsSelecting] = useState<boolean>(false)
  const [hoverEnd, setHoverEnd] = useState<Dayjs | null>(null)
  const [dragRange, setDragRange] = useState<{ startDate: Dayjs | null; endDate: Dayjs | null }>({
    startDate: null,
    endDate: null,
  })

  const generateDataByYear = useCallback((year: number) => {
    return {
      year,
      data: [...Array(12).keys()].map((m) => {
        const date = dayjs().startOf('year').set('month', m).set('year', year)
        const startDay = Number(date.format('d'))
        const totalWeeks = Math.ceil((startDay + date.daysInMonth()) / 7)

        const weeks = Array.from({ length: totalWeeks }, (_, weekIndex) => {
          const startOfWeek = date.startOf('month').add(weekIndex * 7, 'days')
          return Array.from({ length: 7 }, (_, dayIndex) => {
            const currentDate = startOfWeek.add(dayIndex - startDay, 'days')
            return currentDate.isSame(date, 'month') ? currentDate : null
          })
        })

        return {
          month: date.format('MMMM'),
          weeks,
        }
      }),
    }
  }, [])

  const generateDataByMonth = useCallback((year: number, month: number) => {
    const date = dayjs().set('year', year).set('month', month).startOf('month')
    const startDay = Number(date.format('d'))
    const totalWeeks = Math.ceil((startDay + date.daysInMonth()) / 7)

    const weeks = Array.from({ length: totalWeeks }, (_, weekIndex) => {
      const startOfWeek = date.startOf('month').add(weekIndex * 7, 'days')
      return Array.from({ length: 7 }, (_, dayIndex) => {
        const currentDate = startOfWeek.add(dayIndex - startDay, 'days')
        return currentDate.isSame(date, 'month') ? currentDate : null
      })
    })
    return {
      month: date.format('MMMM'),
      year: date.get('year'),
      weeks,
    }
  }, [])

  const handleMouseDown = useCallback((date: Dayjs | null) => () => {
    setIsDragging(true)
    setDragRange({ startDate: date, endDate: date })
  }, [])

  const handleMouseEnter = useCallback((date: Dayjs | null) => () => {
    setHoverEnd(date)
    if (draggingEnabled && isDragging) {
      setDragRange((prevDragRange) => ({
        ...prevDragRange,
        endDate: date,
      }))
    }
  }, [draggingEnabled, isDragging])

  const handleMouseUp = useCallback(() => () => {
    setIsDragging(false)
    dragRange.startDate === selectedRange?.startDate && dragRange.endDate === selectedRange?.endDate ?
      setSelectedRange({startDate: null, endDate: null}) : setSelectedRange(dragRange)
  }, [dragRange, selectedRange?.endDate, selectedRange?.startDate])

  const handleTouch = useCallback((date: Dayjs | null) => () => {
    if(selectedRange.startDate && selectedRange.startDate?.isSame(selectedRange.endDate)) {
      setSelectedRange({startDate: selectedRange.startDate, endDate: date})
    } else {
      setSelectedRange({startDate: date, endDate: date})
    }
  }, [selectedRange])

  const handleMouseClick = useCallback((date: Dayjs | null) => () => {
    if(!date) return
    if(selectedRange.startDate && !selectedRange.endDate) {
      setIsSelecting(false)
      setSelectedRange(prev => ({...prev, endDate: date}))
    } else {
      setIsSelecting(true)
      setSelectedRange({startDate: date, endDate: null})
    }
  }, [selectedRange.endDate, selectedRange.startDate])

  const inDragRange = useCallback((fullDate: Dayjs) => {
    return fullDate && dragRange.startDate && dragRange.endDate && fullDate >= dragRange.startDate && fullDate <= dragRange.endDate.add(1, 'hour')
  }, [dragRange])

  const inSelectedRange = useCallback((fullDate: Dayjs) => {
    if(!draggingEnabled && isSelecting) {
      return fullDate && selectedRange.startDate && hoverEnd && fullDate >= selectedRange.startDate && fullDate <= hoverEnd.add(1, 'hour')
    }
    return fullDate && selectedRange.startDate && selectedRange.endDate && fullDate >= selectedRange.startDate && fullDate <= selectedRange.endDate.add(1, 'hour')
  }, [draggingEnabled, hoverEnd, isSelecting, selectedRange.endDate, selectedRange.startDate])

  const resetSelected = useCallback(() => {
    setSelectedRange({endDate: null, startDate: null})
  }, [])

  const isPrevious = useCallback((fullDate: Dayjs) => {
    const currentDate = dayjs().subtract(1, 'day')
    return fullDate?.isBefore(currentDate)
  }, [])

  return {
    selectedRange,
    isDragging,
    generateDataByYear,
    inSelectedRange,
    inDragRange,
    dragRange,
    resetSelected,
    generateDataByMonth,
    handleTouch,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    isPrevious,
    handleMouseClick,
    isSelecting,
    setSelectedRange
  }
}

export default useCalendar

