'use client'
import { FC, useCallback, useEffect, useState } from 'react'
import useLocationWiseSearchInitialValues from '~/app/home/hooks/useLocationWiseSearchInitialValues'
import { styles } from '~/styles/classes'

const searchType = {
  ANYWHERE: 'anywhere',
  NEARYBY: 'nearby'
}

const searchTypeMeta = [
  {
    id: searchType.ANYWHERE,
    name: 'Anywhere',
  },
  {
    id: searchType.NEARYBY,
    name: 'Near By',
  }
]

export type SearchDropDownProps = {
  onInputSelect: () => void
}

const SearchDropdown: FC<SearchDropDownProps> = ({ onInputSelect }) => {
  const { initialValues } = useLocationWiseSearchInitialValues()
  const [activeSearchType, setActiveSearchType] = useState<string>(searchType.ANYWHERE)
  const handleActiveSearch = useCallback((value: string) => setActiveSearchType(value), [])
  useEffect(() => {
    initialValues.searchType === 'nearby' ? handleActiveSearch(searchType.NEARYBY) : handleActiveSearch(searchType.ANYWHERE)
  }, [initialValues, handleActiveSearch])


  return (
    <div className={`my-3 space-y-4 `}>
      {/* SEARCH TYPE */}
      < div className={`${styles.flexCenter}`}>
        <div className='mx-auto flex items-center justify-between gap-5'>
          {searchTypeMeta.map(item =>
            <button
              key={item.id}
              onClick={() => setActiveSearchType(item.id)}
              className={`text-[14px] text-[#202020] ${activeSearchType === item.id ? 'font-[600]' : 'font-[400]'}`}>
              {item.name}
            </button>
          )}

        </div>
      </div >
    </div >
  )
}

export default SearchDropdown

