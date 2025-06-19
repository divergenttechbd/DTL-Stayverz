import { FC } from 'react'
import Trip, { ITrip } from '~/app/trips/components/Trip'

type TripListProps = {
  trips: ITrip[],
  title: string
}

const TripList:FC<TripListProps> = ({trips, title}) => {
  return (
    <>
      <h3 className='text-xl font-medium my-4'>{title}</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2'>
        {trips.map(trip => <Trip key={trip.id} trip={trip} />)}
      </div>
    </>

  )
}

export default TripList
