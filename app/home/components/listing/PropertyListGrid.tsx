import { useInfiniteQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { FC, useCallback, useEffect, useMemo } from 'react'
import PropertyCard from '~/app/home/components/listing/PropertyCard'
import useWindowSize, { BreakpointsType } from '~/hooks/useWindowSize'
import { getObjectFromSearchParams } from '~/lib/utils/url'
import LoadMoreImg from '~/public/images/load-more.png'
import { getRooms } from '~/queries/client/room'
import { useAppStore } from '~/store/appStore'

const BREAKPOINT_PAGINATION: Record<BreakpointsType, number> = {
  sm: 6,
  md: 9,
  lg: 9,
  xl: 9,
  '2xl': 9,
}


const getNumberOfSkeletonCards = (data:any) => {
  let total = 0
  data?.pages.forEach((page:any )=> {
    total += page?.data?.length || 0
  })
  const cardNumber = total%3 !== 0 ? (6 - total%3) : 6
  return  cardNumber
}


const getTotalResults = (data:any) => {
  const total = data?.pages?.[0]?.meta?.total || 0
  return total
}

type PropertyListGridTypes = {
  handleSetTotal: (value: number) => void
}

const PropertyListGrid:FC<PropertyListGridTypes> = ({handleSetTotal}) => {
  const { fullScreenSearch } = useAppStore()
  const { breakpoint, isMobileView } = useWindowSize()
  const paginationSize = BREAKPOINT_PAGINATION[breakpoint as keyof typeof BREAKPOINT_PAGINATION]
  const searchParams = useSearchParams()
  const filterQueryParam = useMemo(() => {
    const data = getObjectFromSearchParams(searchParams)
    const totalGuests = data.guests ?
      data.guests.split(',').reduce((a, c) => (a += +c), 0)
      : 0
    return {
      ...data,
      ...(totalGuests > 0 && { guests: totalGuests })
    }
  }, [searchParams])


  // ========= LISTING DATA =========
  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    
  } = useInfiniteQuery({
    queryKey: ['rooms-listing', paginationSize, filterQueryParam],
    queryFn: ({ pageParam = 1 }) => {
      return getRooms({
        params: {
          page: pageParam, page_size: paginationSize,
          ...filterQueryParam
        }
      })
    },
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage: any, pages: any) => {
      const total = lastPage.meta?.total
      const pageCount = pages.length
      return pageCount * paginationSize < total ? pageCount + 1 : undefined
    },
    getPreviousPageParam: (firstPage: any) => (firstPage.meta?.previous !== null ? firstPage.meta?.previous : undefined),
  })

  const handleLoadMore = useCallback(() => fetchNextPage(),[fetchNextPage])

  useEffect(() => {
    const totalResults =  getTotalResults(data)
    handleSetTotal(totalResults)
  },[data, handleSetTotal])

  return (<div className='w-full space-y-10'>
    {/* ===================== PROPERTY LIST =============== */}
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 w-full'>
      {data?.pages?.map(page =>
        page.data?.map((house: any, index: number) => (
          <PropertyCard
            key={index + 1}
            {...house}
          />
        )))}
      {/* ===================== PROPERTY LIST || SKELETON LOADER =============== */}
      {isFetching &&
        Array.from({length:getNumberOfSkeletonCards(data)}).map((el, index) =>  (   
          <div key={`room-list-skeleton-loader-${index}`} 
            className={`stayverz-property-card p-0 overflow-hidden rounded-[6px] ${index === 2 ? 'hidden lg:flex' : ''} flex justify-center items-center flex-col animate-pulse`}>
            <div className='w-full h-[250px] p-0 relative'>
              <div className='bg-gray-200 w-full h-full animate-pulse'></div>
            </div>
            <div className='w-full pt-8 pb-7 space-y-3'>
              <div className='flex justify-between items-center gap-3'>
                <div className='flex justify-start gap-2'>
                  <div className='w-44 h-4 bg-gray-200 animate-pulse'></div>
                </div>
                <div className='flex justify-end items-center gap-1'>
                  <div className='w-4 h-3 bg-gray-200 animate-pulse'></div>
                </div>
              </div>
              <div className='flex justify-start items-center gap-2'>
                <div className='w-20 h-3 bg-gray-200 animate-pulse'></div>
              </div>
              <div className='flex justify-start items-center gap-4'>
                <div className='flex justify-start items-center gap-2'>
                  <div className='w-12 h-3 bg-gray-200 animate-pulse'></div>
                </div>
                <div className='flex justify-start items-center gap-2'>
                  <div className='w-12 h-3 bg-gray-200 animate-pulse'></div>
                </div>
                <div className='flex justify-start items-center gap-2'>
                  <div className='w-12 h-3 bg-gray-200 animate-pulse'></div>
                </div>
              </div>
            </div>
          </div>))}
    </div>

    {/* ===================== LOAD MORE =============== */}
    {hasNextPage &&  
    <div className='flex justify-center items-center my-5'>
      <button onClick={handleLoadMore} className='flex justify-center items-center gap-[10px] px-[10px] py-[6px] border border-solid border-[#FDCDBE] rounded-[8px]'>
        <div className={`px-[8px] py-[7px] rounded-[30px]`} style={{background:' linear-gradient(182.07deg, rgba(241, 89, 39, 0) -68.03%, rgba(241, 89, 39, 0.46772) -13.86%, #F15927 98.26%)'}}>
          <Image src={LoadMoreImg} alt='login avatar ' width={12} height={15} className={`max-w-[12px] h-auto ${isFetching ? 'animate-spin' : ''}`}/>  
        </div>
        <div className='text-[#202020] text-base font-medium leading-6'>Load More</div>
      </button>
    </div> }
  

  </div>)
}

export default PropertyListGrid
