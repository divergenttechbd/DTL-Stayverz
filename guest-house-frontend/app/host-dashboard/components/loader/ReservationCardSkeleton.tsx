import { memo } from 'react'

const ReservationCardSkeletonComponent = () => {
  return (
    <div className='animate-pulse w-[300px] border border-slate-300 rounded-xl h-[170px]'>
      <div className='p-5'>
        <div className='flex justify-between mb-4 gap-6'>
          <svg className='w-[40px] h-[40px] text-slate-300' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z'/>
          </svg>
          <div className='flex flex-col gap-1 w-full'>
            <div className='h-2.5 bg-slate-300 rounded-sm w-full mb-4'></div>
            <div className='h-2.5 bg-slate-300 rounded-sm w-full mb-4'></div>
          </div>
        </div>
        <div className='w-20 h-2 rounded-sm bg-slate-300 block mb-4'></div>
        <div className='w-20 h-2 rounded-sm bg-slate-300 block mb-4'></div>
      </div>
    </div>
  )
}

export const ReservationCardSkeleton = memo(ReservationCardSkeletonComponent)
