import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin'
import { FC, useCallback } from 'react'
import { SEARCH_TABS } from '~/app/home/constant/tabkeys'
import { dropdownBaseStyles } from '~/app/home/hooks/useAnyWhereSearchMeta'
import { IAddress } from '~/components/form/inputs/LocationInput/LocationInput'
import { SearchType, useListingSearchStore } from '~/store/useListingSearchStore'
import { styles } from '~/styles/classes'

type DestinationDropdownProps = {
  predictions:IAddress[] | undefined
  setActiveSearchTab:Function
  className:string
  searchType:SearchType
}

const DestinationDropdown:FC<DestinationDropdownProps> = (props) => {
  const {predictions, setActiveSearchTab,className, searchType} = props
  const {  setAddress } = useListingSearchStore()
  const handleSetAddress = useCallback((value: IAddress) => setAddress({ ...value }, searchType), [searchType, setAddress])

  return (
    <div className={`${dropdownBaseStyles} ${className || 'left-0 w-[350px] md:w-[450px]'} ${predictions?.length ? 'block' : 'hidden'}`}>
      {predictions?.length ?
        <ul className='py-2 max-h-[400px] overflow-y-auto w-full'>
          {predictions?.map((prediction: any, index: number) =>
            <li onClick={() => {
              setActiveSearchTab(SEARCH_TABS.CHECK_IN)
              handleSetAddress({
                address: prediction.address,
                lat: prediction.latitude,
                lng: prediction.longitude
              })
            }} key={`${prediction.address}-${index + 1}`} className='px-5 py-3 flex justify-start items-center gap-3 cursor-pointer hover:bg-gray-100'>
              <div className={`${styles.flexCenter} bg-gray-200 p-2 rounded-xl w-[45px] h-[45px]`}><MapPin size={22} className='' /></div>
              <div>
                <p className='text-[#222222] text-[14px] leading-6'>{prediction.address}</p>
              </div>
            </li>
          )}
        </ul> : ''}

    </div>
  )
}

export default DestinationDropdown
