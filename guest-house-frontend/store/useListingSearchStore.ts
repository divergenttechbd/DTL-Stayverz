import { create } from 'zustand'
import { GuestCounts } from '~/app/rooms/components/guestDropdown/GuestDropDown'
import { IAddress } from '~/components/form/inputs/LocationInput/LocationInput'

interface ListingStore {
  anywhere: {
    address: IAddress
    check_in: string | undefined | null
    check_out: string | undefined | null
    guests: GuestCounts,
    // isNearby: boolean
  },
  nearby: {
    address: IAddress
    radius: number | null
    check_in: string | undefined | null
    check_out: string | undefined | null
    guests: GuestCounts,
    // isNearby: boolean
  },
  setAddress: (address: IAddress, searchType: SearchType) => void
  setRadius: (radius: number | null, searchType: SearchType) => void
  setCheckInAndCheckOut: ({ check_in, check_out }: CheckInAndCheckOutType, searchType: SearchType) => void
  setGuestsNumber: (guests: GuestCounts, searchType: SearchType) => void
}


type CheckInAndCheckOutType = { check_in?: string | null, check_out?: string | null }
export type SearchType = 'anywhere' | 'nearby'
export const SearchType: Record<SearchType, SearchType> = {
  anywhere: 'anywhere',
  nearby: 'nearby',
}

export const useListingSearchStore = create<ListingStore>((set, get) => {
  return {
    anywhere: {
      address: { lat: null, lng: null, address: '' },
      check_in: null,
      check_out: null,
      guests: { adult: 0, children: 0, infant: 0, pets: 0 },
    },
    nearby: {
      address: { lat: null, lng: null, address: '' },
      radius: null,
      check_in: null,
      check_out: null,
      guests: { adult: 0, children: 0, infant: 0, pets: 0 },
    },

    setAddress: (address, searchType) => {
      set((state) => ({
        [searchType]: {
          ...state[searchType],
          address
        }
      }))
    },

    setRadius: ((radius, searchType) => {
      set((state) => ({
        [searchType]: {
          ...state[searchType],
          radius
        }
      }))
    }),

    setCheckInAndCheckOut: ({ check_in = null, check_out = null }, searchType) => {
      set((state) => ({
        [searchType]: {
          ...state[searchType],
          check_in,
          check_out,
        }
      }))
    },

    setGuestsNumber: (guests, searchType) => {
      set((state) => ({
        [searchType]: {
          ...state[searchType],
          guests
        }
      }))
    },

  }
})
