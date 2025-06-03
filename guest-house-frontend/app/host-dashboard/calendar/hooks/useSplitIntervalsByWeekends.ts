import dayjs from 'dayjs'
import { useCallback } from 'react'
import { IntervalDetails } from '~/app/host-dashboard/calendar/types'
import { DATE_FORMAT } from '~/constants/format'

const useSplitIntervalsByWeekends = () => {
  const splitIntervalsByWeekends = useCallback((data: Record<string, any>): Record<string, IntervalDetails> => {
    const result: Record<string, IntervalDetails> = {}
    const intervals: Record<string, any> = {}
    let currentIntervalStartDate: string | null = null
    let currentIntervalData: Record<string, any> = { booking: null, user: '', invoiceNo: '' }

    Object.keys(data).forEach((date) => {
      const currentDateData = data[date]
      if (currentDateData.is_booked && currentDateData.booking_data) {
        const { booking, user } = currentDateData.booking_data
        const invoiceNo = booking.invoice_no

        if (!currentIntervalStartDate) {
          currentIntervalStartDate = date
          currentIntervalData = { booking, user, invoiceNo }
        } else if (currentIntervalData.invoiceNo !== invoiceNo) {
          // Invoice number changed, create a new interval
          const currentIntervalEndDate = date
          const lengthOfDate = dayjs(currentIntervalEndDate).endOf('day').diff(dayjs(currentIntervalStartDate), 'day')
          intervals[currentIntervalStartDate] = {
            booking_data: currentIntervalData,
            endDate: dayjs(currentIntervalEndDate).format(DATE_FORMAT),
            lengthOfDate,
            color: dayjs(currentIntervalStartDate).isAfter(dayjs())
              ? 'bg-black'
              : dayjs(currentIntervalEndDate).isBefore(dayjs())
                ? 'bg-gray-500'
                : 'bg-[#f66c0e]',
          }
          currentIntervalStartDate = date
          currentIntervalData = { booking, user, invoiceNo }
        } else {
          currentIntervalData.booking = booking
        }
      } else if (currentIntervalStartDate) {
        const currentIntervalEndDate = date
        const lengthOfDate = dayjs(currentIntervalEndDate).endOf('day').diff(dayjs(currentIntervalStartDate), 'day')
        intervals[currentIntervalStartDate] = {
          booking_data: currentIntervalData,
          endDate: dayjs(currentIntervalEndDate).format(DATE_FORMAT),
          lengthOfDate,
          color: dayjs(currentIntervalStartDate).isAfter(dayjs())
            ? 'bg-black'
            : dayjs(currentIntervalEndDate).isBefore(dayjs())
              ? 'bg-gray-500'
              : 'bg-[#f66c0e]',
        }
        currentIntervalStartDate = null
        currentIntervalData = { booking: null, user: '', invoiceNo: '' }
      }
    })

    for (const startDate in intervals) {
      let textAdded = false
      if (intervals.hasOwnProperty(startDate)) {
        const interval = intervals[startDate]
        const endDate = interval.endDate
  
        let currentDate = dayjs(startDate)
  
        while (currentDate.isBefore(dayjs(endDate).add(1, 'day'))) {
          let weekendEndDate = currentDate.endOf('week')
          let endOfInterval = false
  
          if (weekendEndDate.add(1, 'hour').isAfter(dayjs(endDate).endOf('day'))) {
            weekendEndDate = dayjs(endDate).endOf('day')
            endOfInterval = true
          }
          
          const lengthOfDate = weekendEndDate.add(1, 'day').startOf('day').diff(
            currentDate.startOf('day'),
            'day'
          )
  
          const currentDateFormatted = currentDate.format(DATE_FORMAT)
          const showBookingText = !textAdded && (startDate === currentDateFormatted ? 
            !currentDate.isSame(currentDate.endOf('week'), 'day') || interval.lengthOfDate <= 1
              ? true : false : true)
  
          if(showBookingText) textAdded = true
          if (!result[currentDateFormatted]) {
            result[currentDateFormatted] = {
              endDate: weekendEndDate.format(DATE_FORMAT),
              lengthOfDate,
              color: interval.color,
              booking_data: interval.booking_data,
              isStartOfAnInterval: startDate === currentDateFormatted,
              isEndOfAnInterval: endOfInterval,
              showBookingText: showBookingText,
            }
          } else {
            result[currentDateFormatted].isStartOfAnInterval = false
            result[currentDateFormatted].isEndOfAnInterval = endOfInterval
          }
  
          currentDate = weekendEndDate.add(1, 'day')
        }
      }
    }

    return result
  }, [])

  return { splitIntervalsByWeekends }
}

export default useSplitIntervalsByWeekends

