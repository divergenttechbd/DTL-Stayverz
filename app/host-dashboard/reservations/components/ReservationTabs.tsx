import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FC, useCallback, useMemo } from 'react'
import Tabs from '~/components/layout/Tabs'
import { getAsQueryString, getObjectFromSearchParams } from '~/lib/utils/url'

interface IReservationTabsProps {
  activeTab: string;
  onChange: (tab: string) => void;
}
const ReservationTabs:FC<IReservationTabsProps> = ({ activeTab,onChange }) => {
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const handleTabClick = useCallback((key:string) => ()=> {
    const updatedSearchParams = getObjectFromSearchParams(searchParams)
    if (key === '') {
      delete updatedSearchParams.event_type
    } else {
      updatedSearchParams.event_type = key
    }
    router.push(`${pathName}${getAsQueryString(updatedSearchParams)}`)
  },[searchParams, pathName, router])
  
  const tabs = useMemo(()=>[ 
    {
      label: 'All',
      key: 'all',
      onClick: handleTabClick('all')
    },
    {
      label: 'Currently Hosting',
      key: 'currently_hosting',
      onClick: handleTabClick('currently_hosting')
    },
    {
      label: 'Upcoming',
      key: 'upcoming',
      onClick: handleTabClick('upcoming')
    },
    {
      label: 'Completed',
      key: 'completed',
      onClick: handleTabClick('completed')
    },
  ],[handleTabClick])
  return (
    <Tabs  
      // activeTabClassName='!border-[#f66c0e] !text-[#f66c0e]' 
      // classNames='mt-5 text-[14px] font-semibold sm:text-[16px] sm:font-regular whitespace-nowrap overflow-x-scroll scrollbar-hidden' 
      activeTabClassName='!border-[#f66c0e] !text-[#f66c0e]'  
      classNames='my-5 text-[14px] font-medium sm:text-[16px] sm:font-regular whitespace-nowrap overflow-x-scroll scrollbar-hidden text-[#9C9C9C]'
      tabs={tabs} activeTab={activeTab} onChange={onChange}/>
  )
}

export default ReservationTabs
