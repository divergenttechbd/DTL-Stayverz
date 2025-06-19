import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import ReservationContent from '~/app/host-dashboard/components/ReservationContent'
import { ReservationCardSkeleton } from '~/app/host-dashboard/components/loader/ReservationCardSkeleton'
import { IReservationData, IReservationStatInfo, IReservationStats } from '~/app/host-dashboard/components/types'
import Tabs from '~/components/layout/Tabs'
import { getReservationStatesData } from '~/queries/client/reservation'



const ReservationTabs = () => {
  const [activeTab, setActiveTab] = useState('currently_hosting')
  const handleTabClick = useCallback((tab: string) => () => {
    setActiveTab(tab)
  }, [])

  const { data, isLoading ,refetch} = useQuery({
    queryKey: ['reservationContent', activeTab],
    queryFn: () => getReservationStatesData({ params: { event_type: activeTab } })
  })

  const reservationData: IReservationData[] = data?.data || []
  const reservationStats: IReservationStats = useMemo(() => data?.stats || {}, [data?.stats])


  const reservationStatInfo: IReservationStatInfo = useMemo(() => ({
    currently_hosting: { label: `Currently Hosting (${reservationStats?.currently_hosting_count || 0})`, count: reservationStats?.currently_hosting_count },
    upcoming: { label: `Upcoming (${reservationStats?.upcoming_count || 0})`, count: reservationStats?.upcoming_count },
    pending_review: { label: `Pending Review (${reservationStats?.pending_review_count || 0})`, count: reservationStats?.pending_review_count },
    arriving_soon: { label: `Arriving Soon (${reservationStats?.arriving_soon_count || 0})`, count: reservationStats?.arriving_soon_count },
    checking_out: { label: `Checking Out (${reservationStats?.checking_out_count || 0})`, count: reservationStats?.checking_out_count }
  }), [reservationStats])

  const tabs = useMemo(() => [
    {
      key: 'currently_hosting',
      label: reservationStatInfo.currently_hosting.label,
      onClick: handleTabClick('currently_hosting')
    },
    {
      label: reservationStatInfo.checking_out.label,
      key: 'checking_out',
      onClick: handleTabClick('checking_out')
    },
    {
      label: reservationStatInfo.arriving_soon.label,
      key: 'arriving_soon',
      onClick: handleTabClick('arriving_soon')
    },
    {
      label: reservationStatInfo.upcoming.label,
      key: 'upcoming',
      onClick: handleTabClick('upcoming')
    },
    {
      label: reservationStatInfo.pending_review.label,
      key: 'pending_review',
      onClick: handleTabClick('pending_review')
    },
  ], [handleTabClick, reservationStatInfo])



  return (
    <div className='mb-10 sm:mb-0'>
      <div >
        <Tabs
          // classNames='my-5 !border-none text-xs sm:text-sm flex justify-start items-center overflow-x-auto scrollbar-hidden w-full'
          // tabClassName='py-2.5 px-5 mr-2 mb-2 rounded-3xl border hover:border-black border-grayBorder whitespace-nowrap'
          // activeTabClassName='!border-2 !border-black font-semibold'
          activeTabClassName='!border-[#f66c0e] !text-[#f66c0e]'  
          classNames='my-5 text-[14px] font-medium sm:text-[16px] sm:font-regular whitespace-nowrap overflow-x-scroll scrollbar-hidden text-[#9C9C9C]'
          tabs={tabs} activeTab={activeTab} onChange={handleTabClick}
        />
      </div>
      {isLoading ? (
        <div className='flex gap-5'>
          <ReservationCardSkeleton />
          <ReservationCardSkeleton />
          <ReservationCardSkeleton />
        </div>
      ) : (
        <ReservationContent
          refetch={refetch}
          eventType={activeTab}
          reservationContents={reservationData}
          reservationStatInfo={reservationStatInfo}
        />
      )}
    </div>
  )
}

export default ReservationTabs
