import { FC } from 'react'
import { ListingListSkeleton } from '~/app/home/components/loader/ListingListSkeleton'

type ListingListSkeletonGridType = {
  pageSize: number
}

export const ListingListSkeletonGrid: FC<ListingListSkeletonGridType> = ({ pageSize }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-8 pb-5`}>
    {Array.from({ length: pageSize }).map((item, index) =>
      <ListingListSkeleton key={index + 1} />
    )}
  </div>)
