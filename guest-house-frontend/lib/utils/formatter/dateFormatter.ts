import DayJS, { Dayjs } from 'dayjs'
import { DATE_FORMAT, TIME_FORMAT } from '~/constants/format'

export const rangeFormatter = (startDate: Dayjs | null, endDate: Dayjs | null) => {
  if(startDate?.toDate()?.toString() === endDate?.toDate()?.toString()) 
    return startDate?.format('MMM DD') || ''
  else if (startDate?.isSame(endDate, 'month')) 
    return `${startDate?.format('MMM DD')} - ${endDate?.format('DD')}`
  else 
    return `${startDate?.format('MMM DD')}-${endDate?.format('MMM DD') || ''}`
}
export const parseDate = (date: string, format?: string) => DayJS(date, format)

export const formatDate = (date: string | Dayjs, format=DATE_FORMAT, ) => DayJS(date).format(format)
export const formatTime = (time: string | Dayjs | Date, format=TIME_FORMAT, ) => DayJS(time).format(format)
