'use client'
import { Libraries, useJsApiLoader } from '@react-google-maps/api'
import { FC, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import MapMarker from '~/assets/icons/map-marker.svg'
import Image from 'next/image'
import Map from '~/components/form/inputs/LocationInput/Map'
import LocationSearch from '~/components/form/inputs/LocationInput/LocationSearch'
import { ICommonInputMeta } from '~/components/form/types'
import { Controller } from 'react-hook-form'

export interface IAddress {
  address?: string;
  address_bn?: string;
  area?: string;
  area_bn?: string;
  city?: string;
  city_bn?: string;
  id?: number | undefined;
  lat: number | undefined | null;
  lng: number | undefined | null;
  pType?: string;
  postCode?: number;
  uCode?: string;
};

export interface ILocationInputMeta extends ICommonInputMeta {
  defaultValue?: IAddress;
}

interface ILocationInputProps {
  meta: ILocationInputMeta;
  isInvalid: boolean;
  formInstance: UseFormReturn;
}

const libraries: Libraries = ['places']

const LocationInput: FC<ILocationInputProps> = ({ meta, formInstance, isInvalid }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '',
    libraries
  })

  const [address, setAddress] = useState<IAddress>({ id: undefined, lat: 0, lng: 0, address: '' })
  const [draggedOnce, setDraggedOnce] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (meta.defaultValue) {
      setAddress(meta.defaultValue)
      setSearch(meta.defaultValue?.address || '')
    }
  }, [meta.defaultValue])

  const validateDraggedOnce = (value: any) => {
    return !!address?.lat ? undefined : 'Please select a location'
  }

  return (
    <Controller
      control={formInstance.control}
      name={meta.key}
      rules={{ validate: validateDraggedOnce }}
      defaultValue={meta.defaultValue}
      render={({ field: { value, onChange } }) => (
        <div className='relative'>
          <Map
            setLoading={setLoading}
            isLoaded={isLoaded}
            setSearch={setSearch}
            address={address}
            setDraggedOnce={setDraggedOnce}
            setAddress={(newAddress: IAddress) => {
              setAddress(newAddress)
              onChange(newAddress)
            }}
          />
          <LocationSearch
            loading={loading}
            search={search}
            setSearch={setSearch}
            isLoaded={isLoaded}
            setAddress={(newAddress: IAddress) => {
              setAddress(newAddress)
              onChange(newAddress)
            }}
            className='absolute w-full p-4 top-2 drop-shadow-lg rounded-s-full z-10'
          />
          {!!address?.lat && (
            <div>
              {!draggedOnce && (
                <div className='rounded shadow-lg bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[80px] z-9'>
                  <div className='px-3 py-3'>
                    <p className='text-gray-700 text-[12px]'>
                      Drag the map to select your location
                    </p>
                  </div>
                  <div className='relative flex justify-center'>
                    <div className='bg-white absolute w-3 h-3 transform rotate-45 -mt-2'></div>
                  </div>
                </div>
              )}
              <Image
                height={32}
                width={32}
                src={MapMarker}
                alt=''
                className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[32px] z-9'
              />
            </div>
          )}
        </div>
      )}
    />
  )
}

export default LocationInput
