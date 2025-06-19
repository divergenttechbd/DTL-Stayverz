import { FC, useCallback } from 'react'
import { RADIUS } from '~/app/home/constant/nearbyRadius'
import { SEARCH_TABS } from '~/app/home/constant/tabkeys'
import { dropdownBaseStyles } from '~/app/home/hooks/useAnyWhereSearchMeta'
import { SearchType, useListingSearchStore } from '~/store/useListingSearchStore'

type RadiusDropdownProps = {
  setActiveSearchTab:Function
  className: string
}

const RadiusDropdown:FC<RadiusDropdownProps> = (props) => {
  const {setActiveSearchTab,className} = props
  const { nearby, setRadius } = useListingSearchStore()
  const {  radius,} = nearby

  const handleSetRadius = useCallback((value: number | null) => setRadius(value, SearchType.nearby), [setRadius])
  return (
    <div className={`${dropdownBaseStyles} ${className || 'left-[8rem] w-[300px]'} `}>
      <div className='w-full text-center py-2'>
        <p className='text-[16px] text-[#222222] font-[600]'>Search Your Nearby Hosts</p>
      </div>
      <ul className='py-2 max-h-[400px] overflow-y-auto w-full'>
        {RADIUS.map((option: any, index) =>
          <li onClick={() => {
            handleSetRadius(option)
            setActiveSearchTab(SEARCH_TABS.CHECK_IN)
          }} key={option} className={`m-4 py-2 px-5 flex justify-center items-center gap-3 cursor-pointer hover:border-black border-2 rounded-full hover:bg-gray-100 ${radius === option ? 'border-black border-2 bg-gray-100' : ''}`}>
            <p className='text-[#222222] text-[14px] font-[500] leading-6'>Within {option}km near me</p>
          </li>
        )}
      </ul>

    </div>
  )
}

export default RadiusDropdown
