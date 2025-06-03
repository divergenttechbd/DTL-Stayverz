import React, { FC, useCallback, useEffect, useState } from 'react'
import { GoogleMap } from '@react-google-maps/api'
import { IAddress } from '~/components/form/inputs/LocationInput/LocationInput'
import { getAddress } from '~/queries/client/map'

const containerStyle = {
  width: '100%',
  height: '50vh',
}

const center = {
  lat: 23.8041,
  lng: 90.4152,
}

interface IMapProps {
  isLoaded: boolean,
  address: IAddress,
  setDraggedOnce: Function;
  setAddress: Function;
  setLoading: Function;
  setSearch: Function;
}


const Map:FC<IMapProps> = ({ isLoaded, address, setAddress, setSearch, setDraggedOnce, setLoading }) => {  
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const getAddressDetails = useCallback(async (latLng: IAddress) => {
    try {
      const address:IAddress = (await getAddress({latitude: latLng.lat, longitude: latLng.lng})).data
      console.log(address)
      return address
    } catch (err) {
      console.log(err)
    }
  }, [])

  const onDrag = useCallback(async () => {
    if(address.lat)
      setDraggedOnce(true)
    setLoading(true)
    const currentLocation = await getAddressDetails({lat: map?.getCenter()?.lat(), lng: map?.getCenter()?.lng()})
    setAddress({...currentLocation, lat: map?.getCenter()?.lat(), lng: map?.getCenter()?.lng()})
    setLoading(false)
    setSearch(currentLocation?.address)
  }, [address, getAddressDetails, map, setAddress, setDraggedOnce, setLoading, setSearch])

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    map.setZoom(17)
    setMap(map)
  }, [])

  const onZoomChanged = useCallback(() => {
    if(map)
      map.panBy(0, 0)
  }, [map])

  useEffect(() => {
    if(map) {
      window.google.maps.event.clearInstanceListeners(map)
      map.addListener('dragend', onDrag)
      map.addListener('zoom_changed', onZoomChanged)
    }
  }, [map, onDrag, onZoomChanged])

  useEffect(() => {
    if(address?.lat) {
      map?.panTo({lat: address.lat, lng: address.lng!})
    }
  }, [address, map])

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null) 
  }, [])
 
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      options={{
        zoomControl: true,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        maxZoom: 19,
        minZoom: 4,
        gestureHandling: 'greedy'
      }}
      zoom={16}
      onLoad={onLoad}
      onUnmount={onUnmount}
      mapContainerClassName='w-full'
    >
    </GoogleMap>
  ) : (
    <></>
  )
}

export default React.memo(Map)
