import { HouseSimple } from '@phosphor-icons/react/dist/ssr/HouseSimple'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useCallback } from 'react'
import { CategoryListSkeletonGrid } from '~/app/home/components/loader/CategorySkeletonGrid'
import { removeEmptyValue } from '~/lib/utils/object'
import { getAsQueryString, getObjectFromSearchParams } from '~/lib/utils/url'
import { styles } from '~/styles/classes'

type CategoryFilterProps = {
  data: any,
  isFetching: Boolean,
  isRefetching: Boolean
}

const CategoryFilter: FC<CategoryFilterProps> = ({ data, isFetching, isRefetching }) => {

  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryId = (searchParams.get('category__in'))

  const handleSelectCategory = useCallback((id: number | null) => {
    return () => {
      const data = {
        ...getObjectFromSearchParams(searchParams),
        category__in: id
      }
      const filterQuery = getAsQueryString(removeEmptyValue(data, true))
      router.push(`/${filterQuery}`)
    }
  }, [router, searchParams])

  return (
    <div className='w-full h-full overflow-hidden'>
      <div className='w-full overflow-scroll scrollbar-hidden' >
        {(isFetching && !isRefetching) ?
          <CategoryListSkeletonGrid /> :
          <div className='min-w-[400px] sm:w-[400px]  flex justify-between mx-auto '>
            <button
              onClick={handleSelectCategory(null)}
              key={`room-category-all`}
              className={`
              text-[#202020] 
               hover:opacity-100 
              hover:border-black 
              border-b pb-2 
              flex flex-col items-center justify-between 
              cursor-pointer 
              font-bold 
              ${!categoryId ? 'border-black opacity-100' : 'opacity-70 border-transparent'} `}
            >
              <div className={`${styles.flexCenter}`}>
                <HouseSimple size={26} color='#222222' className='py-1 sm:w-[32px] sm:h-[32px]' />
              </div>
              <span className='text-xs sm:text-sm'>All</span>
            </button>
            {data?.categories?.map((item: any, index: number) => {
              return (
                <button
                  onClick={handleSelectCategory(item.id)}
                  key={`room-category-${index + 1}`}
                  className={`text-[#202020] 
                  hover:opacity-100 
                 hover:border-black 
                 border-b pb-2 
                 flex flex-col items-center justify-between 
                 cursor-pointer 
                 font-bold  
                 ${categoryId === item?.id?.toString() ? 'border-black opacity-100' : 'opacity-70 border-transparent'}`}
                >
                  <div className={`${styles.flexCenter}`}>
                    <Image src={item.icon} alt={item.name} width={24} height={24} className='mx-auto sm:w-[32px] sm:h-[32px]' />
                  </div>
                  <span className='text-xs sm:text-sm'>{item.name}</span>
                </button>
              )
            })}
          </div>}
      </div>
    </div>
  )
}

export default CategoryFilter



