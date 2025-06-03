import { useMemo } from 'react'
import dayjs from 'dayjs'
import { ITrip } from '~/app/trips/components/Trip'

const useTripDetailsMeta = (trip:ITrip) => {
  const tableData = useMemo(() => {
    if (!trip) return []

    const formattedData = [
      {
        label: 'Invoice',
        value: trip.invoice_no
      },
      {
        label: 'Title',
        value: trip.listing.title
      },
      {
        label: 'Address',
        value: trip.listing.address
      },
      {
        label: 'Host',
        value: trip.host.full_name
      },
      {
        label: 'Check-in',
        value: dayjs(trip.check_in).format('DD MMM, YYYY')
      },
      {
        label: 'Checkout',
        value: dayjs(trip.check_out).format('DD MMM, YYYY')
      },
      {
        label: 'Total nights',
        value: trip.night_count
      },
    ]

    return formattedData
  }, [trip])

  return tableData
}

export default useTripDetailsMeta
