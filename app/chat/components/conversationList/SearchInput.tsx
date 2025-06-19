'use client'

import { MagnifyingGlass } from '@phosphor-icons/react'
import { FC, useCallback, useState } from 'react'

interface SearchInputProps {

}

export const SearchInput:FC<SearchInputProps> = () => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = useCallback((status: boolean) => () => {
    setIsFocused(status)
  }, [])

  return (
    <div className={`flex flex-1 items-center py-1.5 bg-gray-50 rounded-full box-border ${isFocused ? 'border-2 border-gray-800' : 'border border-gray-500'}`}>
      <div className='px-3 text-[#202020] rounded-l-full'>
        <MagnifyingGlass size={24} className='shrink-0' />
      </div>
      <input
        className='w-full text-[#202020] rounded-r-full bg-gray-50 focus-visible:outline-0'
        placeholder='Search inbox'
        onFocus={handleFocus(true)}
        onBlur={handleFocus(false)}
      />
    </div>
  )
}


