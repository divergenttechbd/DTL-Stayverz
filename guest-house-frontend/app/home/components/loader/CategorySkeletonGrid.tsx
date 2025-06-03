import { CategorySkeleton } from '~/app/home/components/loader/CategorySkeleton'

export const CategoryListSkeletonGrid = () => (
  <div className='w-[400px] flex justify-between mx-auto mb-1'>
    {Array.from({ length: 5 }).map((item, index) => (
      <CategorySkeleton key={`category-loader-${index + 1}`} />
    ))}
  </div>
)
