import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FC, useMemo } from 'react'
import { IGuest, IListing } from '~/app/host-dashboard/reservations/types'
import Button from '~/components/layout/Button'
import { UserAvatar } from '~/components/layout/UserAvatar'
import { getObjectFromSearchParams } from '~/lib/utils/url'
import { useAuthStore } from '~/store/authStore'

interface IReservationSummaryProps {
  user: IGuest
  listing: IListing
  checkIn: string
  checkOut: string
  night_count: number
  adult_count: number
  host_pay_out: number
  handleOrder: any
}
const ReservationSummary:FC<IReservationSummaryProps> = ({ user, handleOrder, listing, checkIn, checkOut, night_count, adult_count, host_pay_out}) => {

  const {userData} = useAuthStore()
  const searchParams = useSearchParams()
  const hostingType = getObjectFromSearchParams(searchParams).event_type

  const showHostingType = useMemo(() => hostingType?.toLowerCase() !== 'all', [hostingType])
  const formattedHostingType = useMemo(() => {
    if(hostingType?.toLocaleLowerCase() === 'currently_hosting') {
      return 'currently hosting'
    } else if (hostingType?.toLocaleLowerCase() === 'checking_out'){
      return 'checking out'
    } else if (hostingType?.toLocaleLowerCase() === 'arriving_soon') {
      return 'arriving soon'
    } else if (hostingType?.toLocaleLowerCase() === 'pending_review') {
      return 'pending review'
    } else {
      return hostingType
    }
  },[hostingType])

  return (
    <div className='flex items-center gap-2 border-b-8 border-grayBorder p-6'>
      <div className='w-4/5'>
        {showHostingType && <span className='text-grayText block font-bold text-sm capitalize'>{formattedHostingType}</span>}
        <Link href={`/user/${user.id}`} className='text-lg font-semibold'>{user.full_name}</Link>
        <p className='text-grayText'>{listing.title}</p>
        <p className='text-grayText'>{checkIn} - {checkOut} ({night_count} {night_count <=1 ? 'night' : 'nights'})</p>
        <p className='text-grayText'>
          {adult_count} {adult_count && adult_count > 1 ? 'guests':'guest'} - ৳{host_pay_out}
        </p>

        {handleOrder && userData?.u_type === 'guest' && <Button
          label='Book Now'
          loadingText='Book Now'
          onclick={handleOrder}
          disabled={false}
          className='!py-1 hover:bg-[#f66c0e] hover:text-[#ffffff]'
        />}
      </div>
      <div className='w-1/5'>
        <UserAvatar fullName={user.full_name} image={user.image} />
      </div>
    </div>
  )
}

export default ReservationSummary
