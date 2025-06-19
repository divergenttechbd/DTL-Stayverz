import { FC, useCallback, useMemo } from 'react'
import Tabs from '~/components/layout/Tabs'

interface IEarningTabsProps {
  activeTab: string
  onChange: (tab: string) => void
}
const EarningTabs: FC<IEarningTabsProps> = ({ activeTab, onChange }) => {
  const handleTabClick = useCallback((key: string) => () => {
    onChange(key)
  }, [onChange])

  const tabs = useMemo(() => [
    {
      label: 'Completed Payouts',
      key: 'paid',
      onClick: handleTabClick('paid')
    },
    {
      label: 'Upcoming Payouts',
      key: 'unpaid',
      onClick: handleTabClick('unpaid')
    },
  ], [handleTabClick])
  return (
    <Tabs 
      // activeTabClassName='!border-[#f66c0e] !text-[#f66c0e]' 
      // classNames='mt-5 text-[14px] font-semibold sm:text-[16px] sm:font-regular' 
      activeTabClassName='!border-[#f66c0e] !text-[#f66c0e]'  
      classNames='my-5 text-[14px] font-medium sm:text-[16px] sm:font-regular whitespace-nowrap overflow-x-scroll scrollbar-hidden text-[#9C9C9C]'
      tabs={tabs} activeTab={activeTab} onChange={onChange} />
  )
}

export default EarningTabs
