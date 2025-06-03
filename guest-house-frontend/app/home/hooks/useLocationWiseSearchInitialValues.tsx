import { useSearchParams } from 'next/navigation'
import { useMemo, useCallback } from 'react'
import { GuestCounts } from '~/app/rooms/components/guestDropdown/GuestDropDown'
import { IAddress } from '~/components/form/inputs/LocationInput/LocationInput'
import { useListingSearchStore } from '~/store/useListingSearchStore'

export type LocationWiseSearchSearchedValuesType = {
  address: IAddress
  check_in: string | null
  check_out: string | null
  radius: number | null
  guests: GuestCounts
  searchType: string | null
}

const useLocationWiseSearchInitialValues = () => {
  const search = useSearchParams()

  const searchedValues: LocationWiseSearchSearchedValuesType = useMemo(() => {
    const latitude = search.get('latitude')
    const longitude = search.get('longitude')
    const address = search.get('address')
    const searchType = search.has('searchType') ? search.get('searchType') : null
    const radius = search.has('radius') ? Number(search.get('radius')) : null
    const check_in = search.get('check_in')
    const check_out = search.get('check_out')
    const guestsParam = search.get('guests')

    let guests: GuestCounts = { adult: 0, children: 0, infant: 0, pets: 0 }

    if (guestsParam) {
      const guestsArray = guestsParam.split(',').map(Number)
      guests = {
        adult: guestsArray[0] || 0,
        children: guestsArray[1] || 0,
        infant: guestsArray[2] || 0,
        pets: guestsArray[3] || 0,
      }
    }

    return {
      address: {
        lat: latitude ? Number(latitude) : null,
        lng: longitude ? Number(longitude) : null,
        address: address ? address.toString() : '',
      },
      radius,
      check_in: check_in ? check_in.toString() : null,
      check_out: check_out ? check_out.toString() : null,
      guests,
      searchType,
    }
  }, [search])

  const setAnywhereValuesToStore = useCallback(() => {
    useListingSearchStore.setState((prev) => ({
      ...prev,
      'anywhere': {
        ...prev['anywhere'],
        address: searchedValues.address,
        check_in: searchedValues.check_in,
        check_out: searchedValues.check_out,
        guests: searchedValues.guests,
      },
    }))
  }, [searchedValues])

  const setNearbyValuesToStore = useCallback(() => {
    useListingSearchStore.setState((prev) => ({
      ...prev,
      'nearby': {
        ...prev['nearby'],
        address: searchedValues.address,
        radius: searchedValues.radius,
        check_in: searchedValues.check_in,
        check_out: searchedValues.check_out,
        guests: searchedValues.guests,
      },
    }))
  }, [searchedValues])


  const resetDefaultValuesToStore = useCallback(() => {
    useListingSearchStore.setState((prev) => ({
      ...prev,
      anywhere: {
        address: { lat: null, lng: null, address: '' },
        check_in: undefined,
        check_out: undefined,
        guests: { adult: 0, children: 0, infant: 0, pets: 0 },
      },
      nearby: {
        address: { lat: null, lng: null, address: '' },
        radius: null,
        check_in: undefined,
        check_out: undefined,
        guests: { adult: 0, children: 0, infant: 0, pets: 0 },
      },
    }))
  }, [])

  return {
    initialValues: searchedValues,
    setAnywhereValuesToStore,
    setNearbyValuesToStore,
    resetDefaultValuesToStore
  }
}

export default useLocationWiseSearchInitialValues
