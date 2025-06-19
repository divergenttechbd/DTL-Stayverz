'use client'

import { MapPin, MapPinLine, NavigationArrow } from '@phosphor-icons/react'
import Script from 'next/script'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import useAddressPredictions from '~/app/create-listing/hooks/useAddressPredictions'
import { IAddress } from '~/components/form/inputs/LocationInput/LocationInput'
import Modal from '~/components/modal/Modal'
import { useDetectOutsideClick } from '~/hooks/useDetectOutsideClick'
import { getAddress } from '~/queries/client/map'

interface ILocationSearchProps {
  isLoaded: boolean;
  setAddress: Function;
  search: string;
  setSearch: Function;
  loading: boolean;
  className?: string;
}

const LocationSearch: FC<ILocationSearchProps> = ({
  isLoaded,
  setAddress,
  className,
  search,
  setSearch,
  loading,
}) => {
  const inputBox = useRef<HTMLDivElement>(null)
  const [displaySearchOptions, setDisplaySearchOptions] =
    useState<boolean>(false)
  const [showPermissionModal, setShowPermissionModal] =
    useState<boolean>(false)
  const [isClient, setIsClient] = useState<boolean>(false)

  const getAddressDetails = useCallback(async (latLng: IAddress) => {
    try {
      const address: IAddress = (
        await getAddress({ latitude: latLng.lat, longitude: latLng.lng })
      ).data
      return address
    } catch (err) {
      console.log(err)
    }
  }, [])

  useDetectOutsideClick(inputBox, () => setDisplaySearchOptions(false), true)

  const predictions = useAddressPredictions(search)

  const handleModalClose = () => {
    setShowPermissionModal(false)
  }

  const handleCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then(function (permissionStatus) {
          if (permissionStatus.state !== 'granted') {
            setShowPermissionModal(true)
          }
        })

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const addressDetails = await getAddressDetails({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setSearch(addressDetails?.address)
          setAddress({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: addressDetails?.address,
          })
          setShowPermissionModal(false)
        },
        (error) => {
          console.error(error.message)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  const handleOptionSelect = useCallback(
    async (prediction: IAddress) => {
      try {
        setSearch(prediction.address || '')
        setDisplaySearchOptions(false)
        setAddress({
          address: prediction.address,
          lat: prediction.lat,
          lng: prediction.lng,
        })
      } catch (err) {
        console.log(err)
      } finally {
        setDisplaySearchOptions(false)
      }
    },
    [setAddress, setSearch]
  )

  function wait(timeout: any) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout)
    })
  }
  // async function getLocation(lat: any, long: any) {
  //   console.log(lat, long, 'This is a global function')
  //   const addressDetails = await getAddressDetails({
  //     lat: lat,
  //     lng: long,
  //   })
  //   setSearch(addressDetails?.address)
  //   setAddress({
  //     lat: lat,
  //     lng: long,
  //     address: addressDetails?.address,
  //   })
  //   setShowPermissionModal(false)
  // }
  const getLocation = useCallback(async (lat: any, long: any) => {
    console.log(lat, long, 'This is a global function')
    const addressDetails = await getAddressDetails({
      lat: lat,
      lng: long,
    })
    setSearch(addressDetails?.address)
    setAddress({
      lat: lat,
      lng: long,
      address: addressDetails?.address,
    })
    setShowPermissionModal(false)
  }, [getAddressDetails, setSearch, setAddress])

  useEffect(() => {
    (window as any).getLocation = getLocation
  }, [getLocation])

  return (
    isLoaded && (
      <div className={className} ref={inputBox}>
        <Script id='get-location'>
          {``}
        </Script>
        <Modal
          onClose={handleModalClose}
          show={showPermissionModal}
          title='Permission not Granted'
          modalContainerclassName='w-96'
          titleContainerClassName='items-center justify-center gap-5 p-4 border-b'
          crossBtnClassName='absolute left-4 top-1/2 -translate-y-1/2'
          bodyContainerClassName='p-6'
        >
          Please Grant Permission
        </Modal>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            {loading ? (
              <div
                className='inline-block p-2 h-[16px] w-[16px] animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2'
                role='status'
              />
            ) : (
              <MapPin size={32} className='mr-2' />
            )}
          </div>
          <input
            type='search'
            id='default-search'
            className='block w-full p-4 pl-12 text-sm border border-gray-300 rounded-lg'
            placeholder='Enter your address'
            required
            autoComplete='off'
            value={loading ? 'Loading...' : search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setDisplaySearchOptions(true)}
          />
        </div>

        {/* Show predictions */}
        {displaySearchOptions && (
          <div className='bg-white border border-gray-300 rounded-lg shadow-md max-h-80 overflow-y-auto -mt-3'>
            <div
              key='current_location'
              className='p-2 mt-3 cursor-pointer flex flex-row hover:bg-gray-100'
              onClick={() => {
                if ((window as any).flutterChannel) {
                  (window as any).flutterChannel.postMessage('location')
                  // await wait(5000)
                  // console.log((window as any).flutterLat, (window as any).flutterLong, 'This is a global function-----')
                  // setTimeout((window as any).getLocation, 3000)
                  // setAddress({
                  //   lat: (window as any).flutterLat,
                  //   lng: (window as any).flutterLong,
                  // })
                }
                handleCurrentLocation()
                setDisplaySearchOptions(false)
              }}
            >
              <NavigationArrow size={24} className='mr-2' /> Use Current
              Location
            </div>
            {predictions?.map((prediction) => (
              <div
                key={prediction.address}
                className='p-2 cursor-pointer flex flex-row hover:bg-gray-100'
                onClick={() => handleOptionSelect(prediction)}
              >
                <MapPinLine size={24} className='mr-2' /> {prediction.address}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  )
}

export default LocationSearch
