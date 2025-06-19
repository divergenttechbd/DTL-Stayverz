import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin'
import { NavigationArrow } from '@phosphor-icons/react/dist/ssr/NavigationArrow'
import { FC, useCallback, useState } from 'react'
import { SEARCH_TABS } from '~/app/home/constant/tabkeys'
import { dropdownBaseStyles } from '~/app/home/hooks/useAnyWhereSearchMeta'
import { IAddress } from '~/components/form/inputs/LocationInput/LocationInput'
import Modal from '~/components/modal/Modal'
import { getAddress } from '~/queries/client/map'
import { SearchType, useListingSearchStore } from '~/store/useListingSearchStore'
import { styles } from '~/styles/classes'

type DestinationDropdownProps = {
  predictions:IAddress[] | undefined
  setActiveSearchTab:Function
  className:string
}

const NearbyDestinationDropdown:FC<DestinationDropdownProps> = (props)=> {
  const {predictions, setActiveSearchTab,className} = props
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false)
  const {  setAddress } = useListingSearchStore()
  const handleSetAddress = useCallback((value: IAddress) => setAddress({ ...value }, SearchType.nearby), [setAddress])

  const handleCurrentLocation = useCallback(async () => {
    if (navigator.geolocation) {
      navigator.permissions.query(
        { name: 'geolocation' }
      ).then(function (permissionStatus) {
        if (permissionStatus.state !== 'granted') {
          setShowPermissionModal(true)
        }
      })

      navigator.geolocation.getCurrentPosition(
        async position => {
          const data = await getAddress({ latitude: position.coords.latitude, longitude: position.coords.longitude })
          handleSetAddress({
            // address: prediction.address,
            address: data?.data?.address,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setShowPermissionModal(false)
        },
        error => {
          console.error(error.message)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }
  ,[handleSetAddress])

  return (
    <div className={`${dropdownBaseStyles} ${className || 'left-0 w-[450px]'} ${predictions?.length ? 'block' : ''}`}>
      <Modal
        onClose={() => setShowPermissionModal(false)}
        show={showPermissionModal}
        title='Permission not Granted'
        modalContainerclassName='w-96'
        titleContainerClassName='items-center justify-center gap-5 p-4 border-b'
        crossBtnClassName='absolute left-4 top-1/2 -translate-y-1/2'
        bodyContainerClassName='p-6'
      >
        Please Grant Permission
      </Modal>

      <li onClick={() => {
        handleCurrentLocation()
        setActiveSearchTab(SEARCH_TABS.RADIUS)
      }} className='px-5 py-3 flex justify-start items-center gap-3 cursor-pointer hover:bg-gray-100'>
        <div className={`${styles.flexCenter} bg-gray-200 p-2 rounded-xl w-[45px] h-[45px]`}><NavigationArrow size={22} className='' /></div>
        <div>
          <p className='text-[#222222] text-[14px] leading-6'>Use Current Location</p>
        </div>
      </li>

      {predictions?.length ?
        <ul className='py-2 max-h-[400px] overflow-y-auto w-full'>
          {predictions?.map((prediction: any, index: number) =>
            <li onClick={() => {
              setActiveSearchTab(SEARCH_TABS.RADIUS)
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

export default NearbyDestinationDropdown
