import { Dayjs } from 'dayjs'
import { FC, useCallback, useMemo, useState } from 'react'
import DateSelectedPopover from '~/app/rooms/components/calendar/DateSelectPopover'
import { DATE_FORMAT } from '~/constants/format'
import { DateRange } from '~/hooks/calendar/useCalendar'
import { styles } from '~/styles/classes'

type DayProps = {
  day: Dayjs | null
  previous: boolean
  data: any
  isInSelectedRange: boolean
  isMarginal: boolean | null
  handleMouseEnter: Function
  handleMouseClick: Function
  selectedRange: DateRange
  isInSelectableRange: boolean
}

const Day: FC<DayProps> = ({ day, previous, data, isInSelectableRange, selectedRange, isInSelectedRange, isMarginal, handleMouseEnter, handleMouseClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const draggingStyle = 'bg-gray-100 '
  const selectedStyle = 'bg-[#F15927] text-[#ffffff]'

  const isEndDate = useMemo(() => {
    return day?.format(DATE_FORMAT) == selectedRange?.endDate?.format(DATE_FORMAT)
  }, [day, selectedRange])

  const isStartDate = useMemo(() => {
    return day?.format(DATE_FORMAT) == selectedRange?.startDate?.format(DATE_FORMAT)
  }, [day, selectedRange])

  const minimumNightsSelected = useMemo(
    () => selectedRange.startDate && selectedRange?.endDate?.diff(selectedRange.startDate, 'day')! >= data?.minimum_nights,
    [selectedRange, data])

  const setPopover = useCallback((value: boolean) => () => {
    setIsOpen(value)
  }, [])

  const handleDateClick = useCallback((day: Dayjs | null) => () => {
    if (isStartDate) {
      setPopupMessage('Check-in Date')
      setIsOpen(true)
    } else if (isEndDate) {
      if (day && day?.diff(selectedRange?.startDate) < 0) return
      else if (minimumNightsSelected)
        setPopupMessage('Check-out Date')
      else
        setPopupMessage(`Minimum ${data.minimum_nights} nights`)
      setIsOpen(true)
    } else {
      if (selectedRange?.startDate && !selectedRange?.endDate && day?.diff(selectedRange.startDate, 'day')! < data.minimum_nights) {
        setPopupMessage(`Minimum ${data.minimum_nights} nights`)
        setIsOpen(true)
      }
      handleMouseClick(day)()
    }
  }, [data, handleMouseClick, selectedRange, minimumNightsSelected, isStartDate, isEndDate])

  return (
    <div className='flex grow'>
      <button
        type='button'
        disabled={previous || !isInSelectableRange || (!selectedRange.startDate && (!isInSelectableRange || data?.calendar_data?.[day?.format(DATE_FORMAT) || '']?.is_blocked))}
        className={`grow p-[1px]  basis-0 select-none cursor-pointer
          color-white box-border relative
          disabled:cursor-not-allowed disabled:text-gray-300
          ${day ? '' : 'opacity-0'} 
          ${isInSelectedRange ? isMarginal ? '' : draggingStyle : ''} 
        `}
        onMouseEnter={handleMouseEnter(day)}
        onClick={handleDateClick(day)}
      >
        {isOpen && (
          <DateSelectedPopover setOpen={setPopover} message={popupMessage} />
        )}
        <div className={`aspect-[1/1]  ${styles.flexCenter} ${(isInSelectedRange && isMarginal) ? isEndDate && !minimumNightsSelected ? '!border-[#F15927]' : selectedStyle : 'hover:border-[#F15927]'} 
     sm:w-[40px] sm:h-[40px] rounded-full border border-transparent `}>
          <p className='text-[14px] font-medium min-w-[30px] min-h-[30px] flex justify-center items-center'>
            {day?.get('D') || '-'}
          </p>
        </div>
      </button>
    </div>
  )
}

export default Day
