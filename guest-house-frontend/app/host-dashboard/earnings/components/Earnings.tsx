'use client'
import { useQuery } from '@tanstack/react-query'
import { FC, useCallback, useState } from 'react'
import EarningFilters from '~/app/host-dashboard/earnings/components/EarningFilters'
import EarningList from '~/app/host-dashboard/earnings/components/EarningList'
import EarningTabs from '~/app/host-dashboard/earnings/components/EarningTabs'
import { getEarnings } from '~/queries/client/earnings'

const Earning: FC = () => {
  const [filters, setFilters] = useState<Record<string, any>>()

  const { data: earnings, isFetching } = useQuery({
    queryKey: ['earnings', filters],
    queryFn: () => getEarnings({ params: filters }),
    refetchOnWindowFocus: false
  })

  const handleSetTab = useCallback((key: string) => {
    setFilters(prev => ({ ...prev, status: key }))
  }, [])

  return (
    <div className='sm:w-[95%] mx-auto my-10 pb-[100px] sm:pb-0'>
      <h2 className='text-3xl font-semibold text-[#202020]'>Earnings</h2>
      <EarningTabs activeTab={filters?.status || 'paid'} onChange={handleSetTab} />
      <EarningFilters setFilters={setFilters} />
      <EarningList earnings={earnings?.data} />
    </div>
  )
}

export default Earning
