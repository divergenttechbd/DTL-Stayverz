'use client'
import { useQuery } from '@tanstack/react-query'
import RoomDetails from '~/app/checkout/components/RoomDetails'
import { CheckoutNavbar } from '~/app/rooms/components/CheckoutNavbar'
import Container from '~/components/layout/Container'
import useWindowSize from '~/hooks/useWindowSize'
import { getRoomDetails } from '~/queries/client/room'


const HomePage = ({ params }: { params: { unique_id: string } }) => {
  const { data, refetch, error, isLoading } = useQuery({ queryKey: ['room-details', params.unique_id], queryFn: () => getRoomDetails({ params: { unique_id: params.unique_id } }) })
  const { isMobileView } = useWindowSize()
  return (

    <div>
      {!isMobileView && <CheckoutNavbar />}
      <Container>
        <div className='container relative py-5'>
          <div className='space-y-5 sm:space-y-10'>
            <RoomDetails data={data} />
            {/* =========== REVIEW SECTION =========== */}
          </div>
        </div>
      </Container>
    </div>

  )
}

export default HomePage


