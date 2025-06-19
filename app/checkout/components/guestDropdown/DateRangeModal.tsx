'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FC, useCallback, useEffect } from 'react'
import RoomDateRange from '~/app/rooms/components/RoomDateRange'
import Button from '~/components/layout/Button'
import Modal from '~/components/modal/Modal'
import { DATE_FORMAT } from '~/constants/format'
import useCalendar, { DateRange } from '~/hooks/calendar/useCalendar'
import { rangeFormatter } from '~/lib/utils/formatter/dateFormatter'
import { getAsQueryString, getObjectFromSearchParams } from '~/lib/utils/url'

type DateRangeModalProps = {
  onClose: () => void
  showModal: boolean
  data: any
  defaultValue: DateRange | undefined
}

const DateRangeModal: FC<DateRangeModalProps> = ({ showModal, onClose, data, defaultValue }) => {
  const { selectedRange, isSelecting, isPrevious, resetSelected, handleMouseEnter, inSelectedRange, generateDataByMonth, handleMouseClick, setSelectedRange } = useCalendar(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSubmit = useCallback(() => {
    router.push(`${pathname}${getAsQueryString({
      ...getObjectFromSearchParams(searchParams),
      start_date: selectedRange.startDate?.format(DATE_FORMAT),
      end_date: selectedRange.endDate?.format(DATE_FORMAT),
      check_in: selectedRange.startDate?.format(DATE_FORMAT),
      check_out: selectedRange.endDate?.format(DATE_FORMAT)
    })}`)
    onClose()
  }, [onClose, pathname, router, searchParams, selectedRange])

  useEffect(() => {
    if (defaultValue?.startDate) {
      setSelectedRange(defaultValue)
    }
  }, [defaultValue, setSelectedRange])

  return (
    <Modal
      show={showModal}
      onClose={onClose}
      modalContainerclassName='slide-in-bottom w-[95%] sm:w-auto h-auto rounded-2xl'
      crossBtnClassName='ml-4 mt-5'
      bodyContainerClassName='max-h-[80vh] overflow-y-scroll scrollbar-hidden px-3'
      header={<h4 className='text-2xl font-medium mb-2'>{rangeFormatter(selectedRange.startDate, selectedRange.endDate)}</h4>}
    >
      <div className='space-y-5 sm:px-10 mb-10'>
        <RoomDateRange
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
          isSelecting={isSelecting}
          isPrevious={isPrevious}
          resetSelected={resetSelected}
          handleMouseEnter={handleMouseEnter}
          inSelectedRange={inSelectedRange}
          generateDataByMonth={generateDataByMonth}
          handleMouseClick={handleMouseClick}
          data={data}
        />
        <div className='flex gap-2 justify-end'>
          <div className='flex justify-end items-center'>
            <button onClick={resetSelected} className='text-[#202020] text-[16px] font-semibold underline hover:bg-[rgba(0,0,0,0.01)] py-1 px-2 rounded-md'>Clear Dates</button>
          </div>
          <div className='flex justify-end items-center'>
            <Button onclick={handleSubmit} label='Save' type='button' variant='dark' />
          </div>
        </div>
      </div>
    </Modal>

  )
}

export default DateRangeModal


