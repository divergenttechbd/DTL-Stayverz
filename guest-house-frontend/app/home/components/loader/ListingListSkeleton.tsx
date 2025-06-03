import { FC, memo } from 'react'

const ListingListSkeletonComponent: FC = () => {
  return (
    <div className='overflow-hidden animate-pulse space-y-3'>
      <div className='w-full aspect-[4/3.5] rounded-xl bg-slate-300'>
      </div>
      <div className='flex justify-between items-center mt-4'>
        <div className='h-2 bg-slate-300 rounded-sm'></div>
      </div>
      <div className='text-sm text-gray-300'></div>
      <div className='grid grid-cols-3 gap-10'>
        <div className='h-2 bg-slate-300 rounded-sm col-span-2'></div>
        <div className='h-2 w-2 bg-slate-300 rounded-full col-span-1'></div>
      </div>
      <div className='mt-2  grid grid-cols-4 gap-5'>
        <div className='h-2 bg-slate-300 rounded-sm col-span-2'></div>
      </div>
      <div className='mt-2  grid grid-cols-3 gap-5'>
        <div className='h-2 bg-slate-300 rounded-sm col-span-1'></div>
      </div>
    </div>
  )
}

export const ListingListSkeleton = memo(ListingListSkeletonComponent)
