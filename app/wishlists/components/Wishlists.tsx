'use client'
import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import PropertyCard from '~/app/home/components/listing/PropertyCard'
import { ListingListSkeletonGrid } from '~/app/home/components/loader/ListingListSkeletonGrid'
import { getWishLists } from '~/queries/client/room'

const Wishlists:FC = () => {
  const { data:wishLists, isLoading } = useQuery({
    queryKey: ['wishListData'],
    queryFn: getWishLists
  })
  
  return (
    <div className='mt-7'>
      <h2 className='text-3xl font-medium text-[#202020] text-center mb-10'>My Wishlists</h2>
      {
        isLoading ? <ListingListSkeletonGrid pageSize={10}/> :          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-5 lg:gap-5 pb-20'>
            {
              wishLists?.data.map((wishList:any, index:number) => {          
                return(
                  <PropertyCard
                    key={index}
                    {...wishList?.listing}
                  />
                )
              })
            }
          </div>
      }
    </div>
  )
}

export default Wishlists
