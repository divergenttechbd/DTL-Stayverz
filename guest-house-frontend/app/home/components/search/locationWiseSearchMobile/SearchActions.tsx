import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass'
import React from 'react'

type SearchActionsProps = {
  clearAllSearches: () => void
  handleSubmit: () => void
}

const SearchActions: React.FC<SearchActionsProps> = ({ clearAllSearches, handleSubmit }) => {
  return (
    <div className='w-full bg-white border-t py-2 px-6'>
      <div className='flex justify-between items-center'>
        <div className='w-full flex justify-start'>
          <button onClick={clearAllSearches} className='text-[#202020] text-[16px] font-semibold underline'>
            Clear All
          </button>
        </div>
        <button
          onClick={handleSubmit}
          className='bg-[#f66c0e] mt-2 text-white font-medium py-2 px-5 rounded-[8px] disabled:cursor-not-allowed'
        >
          <div className='flex justify-start items-center gap-1'>
            <MagnifyingGlass fill='#ffffff' size={20} />
            Search
          </div>
        </button>
      </div>
    </div>
  )
}

export default SearchActions
