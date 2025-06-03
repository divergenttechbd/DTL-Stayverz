import { ArrowCircleLeft } from '@phosphor-icons/react/dist/ssr/ArrowCircleLeft'
import { XCircle } from '@phosphor-icons/react/dist/ssr/XCircle'
import React from 'react'
import { SEARCH_TABS } from '~/app/home/constant/tabkeys'
import { styles } from '~/styles/classes'

type SearchHeaderProps = {
  activeTab: string
  handleModalClose: () => void
  setActiveTab: (tab: string) => void
  aciveSearchType: string
  onSearchTypeClick: (searchType: string) => void
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  activeTab,
  handleModalClose,
  setActiveTab,
  aciveSearchType,
  onSearchTypeClick,
}) => {
  return (
    <div className='flex-1 px-5 pt-5'>
      <div className='flex justify-start items-center'>
        {activeTab !== SEARCH_TABS.DESTINATION ? (
          <button onClick={handleModalClose} className={`${styles.flexCenter}`}>
            <XCircle fill='#222222' size={30} className='opacity-[1]' />
          </button>
        ) : (
          <button onClick={() => setActiveTab('')} className={`${styles.flexCenter}`}>
            <ArrowCircleLeft fill='#222222' size={30} className='opacity-[1]' />
          </button>
        )}
        <div className='w-full mx-auto'>
          <ul className='flex justify-center items-center gap-4'>
            {/* {searchTypeMeta.map((item, index) => (
              <li
                key={`${item.id}-${index + 1}`}
                onClick={() => onSearchTypeClick(item.id)}
                className={`text-[16px] pb-1 font-[600] ${aciveSearchType === item.id ? 'text-[#202020]  border-[#222222] border-b' : 'text-gray-500'}`}>
                {item.name}
              </li>
            ))} */}
            <li className='text-[16px] pb-1 font-[600] text-[#202020]  border-[#222222]'>Search</li>
          </ul>
        </div>
      </div>
    </div>

  )
}

export default SearchHeader
