import Image, { StaticImageData } from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FC, useCallback } from 'react'
import { removeEmptyValue } from '~/lib/utils/object'
import { getAsQueryString, getObjectFromSearchParams } from '~/lib/utils/url'
import PropertyTypeAll from '~/public/images/property-type/all.png'
import Apartment from '~/public/images/property-type/apnartment.png'
import Cabin from '~/public/images/property-type/cabin.png'
import Dormitory from '~/public/images/property-type/dormitory.png'
import GuestHouse from '~/public/images/property-type/guest-house.png'
import Home from '~/public/images/property-type/home.png'
import Hotel from '~/public/images/property-type/hotel.png'
import { styles } from '~/styles/classes'

type CategoryFilterProps = {
  data: any,
  isFetching: Boolean,
  isRefetching: Boolean
}

type CategoryImgListType = {
  [key: string]: StaticImageData;
}

const categoryImgList : CategoryImgListType = {
  'All': PropertyTypeAll,
  'Home': Home,
  'Apartment':Apartment,
  'Guest House': GuestHouse,
  'Dormitory': Dormitory,
  'Hotel': Hotel,
  'Resort': Cabin,
}

const CategoryFilterAlt: FC<CategoryFilterProps> = ({ data, isFetching, isRefetching }) => {

  const pathname = usePathname()
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
      router.push(`${pathname}${filterQuery}` , {scroll:false})
    }
  }, [router, searchParams, pathname])


  return (
    <div className='w-full overflow-hidden'>
      <div className='w-screen lg:w-full flex items-center justify-start lg:justify-center gap-5 overflow-x-scroll lg:overflow-x-hidden scrollbar-hidden' >
        <button 
          onClick={handleSelectCategory(null)}
          key={`room-category-all`}
          className={`lg:ml-0 ${styles.flexCenter} gap-2 cursor-pointer py-3 px-4 rounded-[50px] text-sm font-medium leading-5 whitespace-nowrap ${!categoryId ? 'text-[#ffffff] bg-[#202020]' : 'text-[#616161] bg-[#ffffff] border border-solid border-[#EFEFEF]'}`}>
          <span className={`${styles.flexCenter}`}>
            <Image  src={PropertyTypeAll} alt={'All'} width={16} height={16} className='min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px]'/>
          </span>
          <span>All</span>
        </button>
        {data?.categories?.map((item: any, index: number) => {
          return (
            <button
              onClick={handleSelectCategory(item.id)}
              key={`room-category-${index + 1}`}
              className={`${styles.flexCenter} } ${index === data.categories.length - 1 ? 'mr-10 lg:mr-0' : ''} gap-1 cursor-pointer py-3 px-4  rounded-[50px] text-sm font-medium leading-5 whitespace-nowrap ${categoryId === item?.id?.toString() ? 'text-[#ffffff] bg-[#202020]' : 'border-[#EFEFEF] text-[#616161] bg-[#ffffff] border border-solid'}`}>
              <span className={`${styles.flexCenter}`}>
                <Image src={categoryImgList[item.name] || item.icon} alt={item.name} width={16} height={16} className='min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px]'/>
              </span>
              <span className='text-xs sm:text-sm'>{item.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryFilterAlt



