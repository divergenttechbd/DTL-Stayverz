import { FC } from 'react'
import { SlidersHorizontal } from '@phosphor-icons/react/dist/ssr/SlidersHorizontal'
import { SearchInput } from '~/app/chat/components/conversationList/SearchInput'

interface SearchInboxProps {

}

export const SearchInbox:FC<SearchInboxProps> = () => {
  return (
    <div className='px-6 md:px-8 flex items-center gap-3 pb-4'>
      <SearchInput />
      <SlidersHorizontal size={22} weight='bold' />
    </div>
  )
}

