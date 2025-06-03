import Image from 'next/image'
import pluralize from 'pluralize'
import { FC, useCallback, useMemo } from 'react'
import { useBookingDetails, useListingDetails } from '~/app/chat/hooks/useListingDetails'
import { useConversationDetailsActions, useConversationDetailsMessgageInputFocused } from '~/app/chat/store/conversationDetailsStore'
import { formatDate, parseDate } from '~/lib/utils/formatter/dateFormatter'
import { Message } from '~/queries/models/conversation'

interface IHeaderProps {
  meta: NonNullable<Message['meta']>
}

export const Header: FC<IHeaderProps> = ({
  meta,
}) => {
  const messageInputFocused = useConversationDetailsMessgageInputFocused()
  const { setActiveMessageMeta } = useConversationDetailsActions()
  const { data: listingDetails } = useListingDetails({listingId: meta.listing, userId: meta.user})
  const { data: bookingDetails } = useBookingDetails({reservationId: meta.booking?.invoice_no})

  const { coverPhoto, title, totalGuest, hostPayout, checkIn, checkOut } = useMemo(() => {
    const coverPhoto = listingDetails?.listing.cover_photo || bookingDetails?.listing?.cover_photo
    const title = listingDetails?.listing.title || bookingDetails?.listing?.title
    const totalGuest = meta.booking?.booking_date?.total_guest_count || bookingDetails?.guest_count
    const hostPayout = meta.booking?.checkout_data?.host_pay_out || bookingDetails?.host_pay_out
    const checkIn = meta.booking?.booking_date ? formatDate(parseDate(meta.booking?.booking_date.check_in, 'YYYY-MM-DD'), 'MMM DD') :
      bookingDetails?.check_in ? formatDate(parseDate(bookingDetails.check_in, 'YYYY-MM-DD'), 'MMM DD') : undefined
    const checkOut = meta.booking?.booking_date ? formatDate(parseDate(meta.booking?.booking_date.check_out, 'YYYY-MM-DD'), 'MMM DD') :
      bookingDetails?.check_out ? formatDate(parseDate(bookingDetails.check_out, 'YYYY-MM-DD'), 'MMM DD') : undefined
    return {
      coverPhoto,
      title,
      totalGuest,
      hostPayout,
      checkIn,
      checkOut
    }
  }, [meta, listingDetails, bookingDetails])

  const handleClick = useCallback(() => {
    setActiveMessageMeta(meta)
  }, [setActiveMessageMeta, meta])

  if (messageInputFocused) return null

  if (!(checkIn && checkOut)) return null

  return (
    <div className='max-sm:flex max-sm:items-center gap-5 border-t -mx-7 pt-2 mt-3 -mb-1 px-7'>
      {coverPhoto ?
        <div className='w-9 h-9 rounded-lg relative'>
          <Image src={coverPhoto} alt='room image' fill className='rounded-lg relative object-cover' />
        </div>
        : null}
      <div className='flex flex-col gap-1'>
        <h4 className='font-medium underline cursor-pointer' onClick={handleClick}>{title}</h4>
        <p className='text-sm'>
          <span>
            {checkIn} - {checkOut}
          </span>
          {totalGuest ? <span> · {totalGuest} {pluralize('guest', totalGuest)}</span> : null}
          {hostPayout ? <span> · ৳{hostPayout.toLocaleString()}</span> : null}
        </p>
      </div>
    </div>
  )
}
