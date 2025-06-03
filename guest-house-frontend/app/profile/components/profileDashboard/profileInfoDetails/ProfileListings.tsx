import { Star } from '@phosphor-icons/react/dist/ssr/Star'
import { FC, useCallback } from 'react'
import { IProfileListing } from '~/app/profile/profileType'
import ListingCard from '~/components/card/ListingCard'
import Carousel from '~/components/carousel/Carousel'
import useWindowSize from '~/hooks/useWindowSize'

const ListingCarousel = Carousel<IProfileListing>
interface IProfileListingsProps {
  listings: IProfileListing[] | undefined
  firstName: string | undefined
}

const ProfileListings: FC<IProfileListingsProps> = ({ listings, firstName }) => {
  const { isMobileView } = useWindowSize()
  const renderListingSlide = useCallback((listing: IProfileListing) => {
    return (
      <ListingCard
        bodyContainerClass='!border-none'
        cardLink={`/host-dashboard/listing/${listing?.unique_id}/edit`}
        imageClass='!rounded-xl mb-2'
        cardImage={listing?.cover_photo}
        cardImageAlt={listing?.title}
      >
        <div className='flex justify-between items-center'>
          <p className='text-[15px] font-medium tracking-tight text-[#202020]'>{listing?.title}</p>
          <div className='flex gap-1 items-center'>
            <Star weight='fill' size={16} color='#202020'/>
            <span className='text-[15px] font-medium'>{(listing?.avg_rating).toFixed(2)}</span>
          </div>
        </div>
        <p className='mb-2 font-normal text-grayText whitespace-nowrap overflow-hidden text-ellipsis text-[15px]'>{listing?.address}</p>
      </ListingCard>
    )
  }, [])

  return (
    <>
      <div className='mb-5 relative'>
        <h3 className='text-2xl font-medium mb-8'>{firstName}&apos;s listings</h3>
        <div className='flex flex-col gap-2'>
          <ListingCarousel
            carouselItems={listings}
            slidesCountPerView={isMobileView ? 1 : 3}
            slidesGap={20}
            renderItem={renderListingSlide}
          />
        </div>
      </div>
    </>
  )
}

export default ProfileListings
