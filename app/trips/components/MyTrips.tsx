'use client'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import EmptyState from '~/app/trips/components/EmptyState'
import { ITrip } from '~/app/trips/components/Trip'
import TripList from '~/app/trips/components/TripList'
import { getBookings } from '~/queries/client/bookings'


const MyTrips: React.FC<any> = () => {
  const { data, refetch, error, isLoading } = useQuery({ queryKey: ['tripList'], queryFn: () => getBookings({ params: { page_size: 0 } }) })
  const trips = useMemo(() => {
    return {
      upcoming: data?.data?.filter((trip:ITrip) => dayjs(trip.check_in).isAfter(dayjs().endOf('day')) && trip.status !== 'cancelled'),
      past: data?.data?.filter((trip:ITrip) => dayjs(trip.check_out).isBefore(dayjs().startOf('day')) && trip.status !== 'cancelled'),
      currently_visiting: data?.data?.filter((trip:ITrip) => (dayjs().startOf('day').isSame(dayjs(trip.check_in)) || dayjs().startOf('day').isAfter(dayjs(trip.check_in))) && dayjs().startOf('day').isBefore(dayjs(trip.check_out).endOf('day')) && trip.status !== 'cancelled'),
      cancelled: data?.data?.filter((trip: ITrip) => trip.status === 'cancelled')
    }
  }, [data?.data])

  return (
    <div className='container'>
      <div className='w-full my-6'>
        <h2 className='text-2xl font-medium'>Trips</h2>
        <hr className='my-6'/>
        {!data?.data?.length && <EmptyState/>}
        {!!trips?.upcoming?.length && <TripList trips={trips.upcoming} title='Upcoming'/>}
        {!!trips?.currently_visiting?.length && <TripList trips={trips.currently_visiting} title='Currently Staying'/>}
        {!!trips.past?.length && <TripList trips={trips.past} title='Past Trips'/>}
        {!!trips?.cancelled?.length && <TripList trips={trips.cancelled} title='Cancelled'/>}
      </div>
    </div>
  )
}

export default MyTrips
