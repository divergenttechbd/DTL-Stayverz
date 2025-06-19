import { useCallback, useMemo, useState } from 'react'
import { DateRange } from '~/components/form/inputs/DateRangeInput/DateRangeInput'

export const useBookingCard = (selectedRange:DateRange, data:RoomDetails|undefined): [string | undefined, () => boolean, boolean, boolean] => {
  const [error, setError] = useState<string>()

  const minimumNightsSelected = useMemo(
    () => selectedRange?.startDate && selectedRange?.endDate?.diff(selectedRange.startDate, 'day')! >= (data?.minimum_nights || 0),
    [selectedRange, data])
  const hasDateRangeSelected = selectedRange?.startDate && selectedRange?.endDate

  const handleValidate = useCallback(() => {
    if(!hasDateRangeSelected) {
      setError('Choose start and end date!')
      return false
    }

    else if(!minimumNightsSelected) {
      setError(`Select minimum ${data?.minimum_nights} nights!`)
      return false
    }

    return true
  }, [data, hasDateRangeSelected, minimumNightsSelected])
  return [error, handleValidate, !!minimumNightsSelected, !!hasDateRangeSelected]
}
