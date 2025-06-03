import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import Listing from '~/app/host-dashboard/listing/page'
import { rangeFormatter } from '~/lib/utils/formatter/dateFormatter'

type Listing = {
  id: number;
  cover_photo: string;
  title: string;
  address: string;
};

export interface ITrip {
  id: number;
  created_at: string;
  updated_at: string;
  invoice_no: string;
  pgw_transaction_number: string;
  reservation_code: string;
  check_in: string;
  check_out: string;
  night_count: number;
  children_count: number;
  infant_count: number;
  adult_count: number;
  guest_count: number;
  price: number;
  guest_service_charge: number;
  total_price: number;
  paid_amount: number;
  payment_status: string;
  status: string;
  guest: number;
  host: {
    full_name: string;
    phone_number: string;
    id: number;
  };
  listing: Listing;
};

type TripProps = {
  trip: ITrip 
}

const Trip:FC<TripProps> = ({trip}) => {
  return (
    <Link href={`/trips/${trip.invoice_no}`} className='flex text-sm gap-3 p-2 w-full items-center hover:text-gray-600'>
      <div className='rounded-xl'>
        <Image className='rounded-xl object-cover' src={trip.listing.cover_photo} alt={trip.listing.title} width={100} height={80} />
      </div>
      <div className='flex-[1.2] cursor-pointer'>
        <p className='truncate font-medium'>{trip.listing.title}</p>
        <p>Hosted by {trip.host.full_name}</p>
        <p>Hosted by {trip.id}</p>
        <p>{rangeFormatter(dayjs(trip.check_in), dayjs(trip.check_out))}</p>
      </div>
    </Link>
  )
}

export default Trip
