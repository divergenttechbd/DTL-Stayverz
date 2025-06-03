import { X } from '@phosphor-icons/react'
import { useCallback } from 'react'
import ListingDetails from '~/app/chat/components/conversationDetails/messageMeta/ListingDetails'
import { useConversationDetailsActions, useConversationDetailsActiveMessageMeta } from '~/app/chat/store/conversationDetailsStore'
import ReservationDetails from '~/app/host-dashboard/reservations/components/ReservationDetails'


export const MessageMeta = () => {
  const activeMessageMeta = useConversationDetailsActiveMessageMeta()
  const { setActiveMessageMeta } = useConversationDetailsActions()

  const handleHide = useCallback(() => {
    setActiveMessageMeta(undefined)
  }, [setActiveMessageMeta])
  
  if (!activeMessageMeta) return null

  return (
    <div className={`max-sm:h-screen-dynamic sm:h-content flex flex-col md:border-l-2 sm:basis-2/6 max-sm:fixed max-sm:inset-0 bg-white`}>
      <div className='bg-white flex items-center justify-between w-full max-sm:px-3 border-b'>
        <h4 className='font-medium text-xl px-3 md:px-5 py-6 bg-white'>Reservation Details</h4>
        <button
          onClick={handleHide}
          className={`text-2xl p-1 rounded-2xl hover:bg-gray-100 right-4 sm:hidden block`}>
          <X size={18} />
        </button>
      </div>
      <div className='overflow-y-auto grow'>
        <div className=''>
          {activeMessageMeta.booking?.invoice_no ?
            <ReservationDetails reservationId={activeMessageMeta.booking.invoice_no} />
            : activeMessageMeta.listing && activeMessageMeta.booking && activeMessageMeta.user ?
              <ListingDetails listingId={activeMessageMeta.listing} bookingData={activeMessageMeta.booking} userId={activeMessageMeta.user} />
              : null}
        </div>
      </div>
    </div>
  )
}
