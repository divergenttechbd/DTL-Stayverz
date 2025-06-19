'use client'
import React, { useEffect } from 'react'
import { useState, useCallback } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { useQuery } from '@tanstack/react-query'
import { getRooms } from '~/queries/client/room'
import MapPoint from '~/app/home/components/listing/MapPoint'
import { IAddress } from '~/components/form/inputs/LocationInput/LocationInput'
import LocationSearch from '~/components/form/inputs/LocationInput/LocationSearch'
import { useSearchParams } from 'next/navigation'
import { getObjectFromSearchParams } from '~/lib/utils/url'



const containerStyle = {
  width: '100%',
  height: '90vh',
  margin: 'auto',
  // display: 'felx',
  // justifyContant: 'center',
  // alignItems: 'center'
}

const center = {
  lat: 23.8041,
  lng: 90.4152,
}



const MapListing = () => {

  const searchParams = useSearchParams()
  const filterQueryParam = getObjectFromSearchParams(searchParams)


  const { data: mapListingData } = useQuery({
    queryKey: ['map-listing', filterQueryParam],
    queryFn: () => filterQueryParam ? getRooms({ params: { ...filterQueryParam, page_size: 0  } }) : null
  })


  // ========= MAP =========
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '',
  })
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [address, setAddress] = useState<IAddress>({ lat: null, lng: null, address: '' })
  const [search, setSearch] = useState('')

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    map.setZoom(17)
    setMap(map)
  }, [])

  const onZoomChanged = useCallback(() => {
    if (map)
      map.panBy(0, 0)
  }, [map])

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null)
  }, [])


  useEffect(() => {
    if (address?.lat) {
      map?.panTo({ lat: address.lat, lng: address.lng! })
    }
  }, [address, map])

  useEffect(() => {
    if(!!searchParams.get('latitude') && !!searchParams.get('longitude')) 
      map?.panTo({lat: parseFloat(searchParams.get('latitude') || '0') || center.lat, lng: parseFloat(searchParams.get('longitude') || '0') || center.lng})
  }, [map, searchParams])

  return (
    <div >
      {
        <div className='w-full slide-in-bottom'>
          {
            isLoaded ? (
              <div className='relative'>
                <LocationSearch loading={false} search={search} setSearch={setSearch} isLoaded={isLoaded} setAddress={setAddress} className='absolute w-full p-4 top-2 drop-shadow-lg rounded-s-full z-10' />
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  clickableIcons={false}
                  options={{
                    zoomControl: true,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    streetViewControl: false,
                    maxZoom: 19,
                    minZoom: 4,
                    gestureHandling: 'greedy',
                    styles: [
                      {
                        'featureType': 'poi',
                        'elementType': 'labels',
                        'stylers': [
                          {
                            'visibility': 'off'
                          }
                        ]
                      },
                      {
                        'featureType': 'transit',
                        'stylers': [
                          {
                            'visibility': 'off'
                          }
                        ]
                      },
                    ],
                  }}
                  zoom={13}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  mapContainerClassName='w-full'
                >
                  {mapListingData?.data?.map((house: any) =>
                    (<MapPoint key={house.id} house={house} />))}
                </GoogleMap>
              </div>
            ) : (
              <></>
            )
          }
        </div>
      }
    </div>
  )
}

export default MapListing
