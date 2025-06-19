'use client'
import { useInfiniteQuery, } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import GuestHouseCard from '~/app/home/components/listing/GuestHouseCard'
import { ListingListSkeletonGrid } from '~/app/home/components/loader/ListingListSkeletonGrid'
import useWindowSize, { BreakpointsType } from '~/hooks/useWindowSize'
import { getObjectFromSearchParams } from '~/lib/utils/url'
import { getRooms } from '~/queries/client/room'
import { useAppStore } from '~/store/appStore'


const BREAKPOINT_PAGINATION: Record<BreakpointsType, number> = {
  sm: 6,
  md: 9,
  lg: 9,
  xl: 9,
  '2xl': 9,
}


const RoomList = () => {
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
    getNextPageParam: (lastPage: any, pages: any) => {
      const total = lastPage.meta?.total
      const pageCount = pages.length
      return pageCount * paginationSize < total ? pageCount + 1 : undefined
    },
    getPreviousPageParam: (firstPage: any) => (firstPage.meta?.previous !== null ? firstPage.meta?.previous : undefined),
  })

  // ========= ON SCROLL BOTTOM  =========
  useEffect(() => {
    const onScroll = (event: any) => {
      const { scrollHeight, scrollTop, clientHeight } = event.currentTarget.scrollingElement
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (!isFetching && !isFetchingNextPage && hasNextPage) {
          fetchNextPage()
        }
      }
    }
    document.addEventListener('scroll', onScroll)
    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  })

  return (
    <div className={`mx-auto px-5 sm:px-24  ${fullScreenSearch ? ' h-0 overflow-hidden' : ''}`}>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-12 pb-5'>
        {data?.pages?.map(page =>
          page.data?.map((house: any, index: number) => (
            <GuestHouseCard
              key={index + 1}
              {...house}
            />
          )))}
      </div>

      {isFetching && (!isFetchingNextPage || isMobileView) && (
        <ListingListSkeletonGrid pageSize={paginationSize} />
      )}
    </div>

  )
}

export default RoomList





