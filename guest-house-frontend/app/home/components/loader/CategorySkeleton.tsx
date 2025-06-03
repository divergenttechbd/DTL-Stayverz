import { FC, memo } from 'react'

const CategorySkeletonComponent: FC = () => {
  return (
    <div className='animate-pulse flex flex-col items-center justify-center space-y-1'>
      <div className='w-[24px] h-[24px] rounded-full bg-slate-300 block'></div>
      <div className='w-10 h-2 rounded-sm bg-slate-300 block'></div>
    </div>
  )
}

export const CategorySkeleton = memo(CategorySkeletonComponent)
