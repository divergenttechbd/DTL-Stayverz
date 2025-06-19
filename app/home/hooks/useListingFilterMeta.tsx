import { DoorOpen } from '@phosphor-icons/react/dist/ssr/DoorOpen'
import { HouseLine } from '@phosphor-icons/react/dist/ssr/HouseLine'
import { Users } from '@phosphor-icons/react/dist/ssr/Users'
import capitalize from 'lodash/capitalize'
import map from 'lodash/map'
import replace from 'lodash/replace'
import { useMemo } from 'react'
import CardPropertyType from '~/app/home/components/options/CardPropertyType'
import PillSelect from '~/app/home/components/options/PillSelect'
import { IGroupInputMeta } from '~/components/form/inputs/GroupInput'
import Checkbox from '~/components/form/inputs/multiSelectInput/Options/Checkbox'
import inputTypes from '~/constants/forms/inputTypes'

type AmenityOption = {
  id: number
  name: string
}

type AmenityMeta = {
  key: string
  label: string
  inputType: string
  options: AmenityOption[]
}

export const bedAndBathroomGroupList = [
  {
    key: 'bedroom_count',
    label: 'Bedrooms',
  },
  {
    key: 'bathroom_count',
    label: 'Bathrooms',
  },
  {
    key: 'bed_count',
    label: 'Beds',
  }
]

const useListingFilterMeta = (data: any) => {
  const priceRangeMeta = useMemo(() => ({
    key: 'price',
    inputType: inputTypes.RANGE_SLIDER,
    label: 'Price Range',
    labelClassName: 'text-[22px] text-[#202020] font-medium mb-3',
    className: 'pb-6 border-b',
    range: [0, 99999],
    minLabel: 'Min Price',
    maxLabel: 'Max Price',
    minPrefix: '৳',
    maxPrefix: '৳'
  }), [])

  const placeTypeMeta = useMemo(() => ({
    // key: 'property-type',
    label: 'Property Type',
    inputType: inputTypes.GROUP_INPUT,
    className: 'pb-6 border-b',
    meta: [
      {
        key: 'place_type__in',
        inputType: inputTypes.MULTI_SELECT,
        // maxSelection: 1,
        CustomOption: CardPropertyType,
        className: 'grid grid-cols-2 sm:grid-cols-3',
        options: [
          {
            id: 'entire_place',
            name: 'Entire Place',
            icon: <HouseLine  size={35} fill='#222222' className='ml-1'/>,
            iconActive: <HouseLine size={35} fill='#f66c0e' className='ml-1'/>,
          },
          {
            id: 'single_room',
            name: 'Single Room',
            icon: <DoorOpen size={35} fill='#222222' className='ml-1'/>,
            iconActive: <DoorOpen size={35} fill='#f66c0e' className='ml-1'/>,
          },
          {
            id: 'shared_room',
            name: 'Shared Room',
            icon: <Users   size={35} fill='#222222' className='ml-1'/>,
            iconActive: <Users size={35} fill='#f66c0e' className='ml-1'/>,
          },
      
        ],
  
      },
    ],
  
  } as IGroupInputMeta), [])
  

  const bedAndBedroomsMeta = useMemo(() => ({
    label: 'Beds and bathrooms',
    inputType: inputTypes.GROUP_INPUT,
    className: 'pb-3 border-b',
    meta: bedAndBathroomGroupList.map((item: { key: string; label: string }, index) => ({
      key: item.key,
      inputType: inputTypes.MULTI_SELECT,
      maxSelection: 1,
      defaultValue: [''],
      CustomOption: PillSelect,
      label: capitalize(item.label),
      labelClassName: 'text-[#202020]',
      options: getBedAndBathOptionsMeta(),
      className: '',
    }))


  } as IGroupInputMeta), [])

  const amenitiesMeta = useMemo(() => ({
    // key: 'listing_amenity__in',
    inputType: inputTypes.GROUP_INPUT,
    label: 'Amenities',
    className: 'mb-10 sm:mb-5 pb-6',
    meta: getAmenitiesMeta(data?.amenities)


  } as IGroupInputMeta), [data?.amenities])


  const filterMeta = [
    priceRangeMeta,
    placeTypeMeta,
    bedAndBedroomsMeta,
    amenitiesMeta,
  ]

  return filterMeta
}

export default useListingFilterMeta


export const getAmenitiesMeta = (amenities: any) => {
  if (!amenities) return []
  if (Object?.keys(amenities)?.length <= 0) return []

  let groupMeta: AmenityMeta[] = Object.keys(amenities).map(amenityGroup => {

    const meta = {
      // key: amenityGroup,
      key: 'listing_amenity__in',
      label: removeUnderscoreAndCapitalize(amenityGroup),
      labelClassName: 'my-3 font-[500]',
      inputType: inputTypes.MULTI_SELECT,
      CustomOption: Checkbox,
      // maxSelection: 0,
      defaultValue: [''],
      className: 'grid grid-cols-1 md:grid-cols-2',
      options: amenities[amenityGroup].map((option: any) => {
        return {
          id: option.id,
          name: option.name,
        }
      })
    }

    return meta
  })


  return groupMeta
}


export const getBedAndBathOptionsMeta = () => {
  const meta = Array.from({ length: 9 }).map((item, index, arr) => {
    const option = {
      id: index > 0 ? index < arr.length - 1 ? index : index + 1 : '',
      name: index > 0 ? index < arr.length - 1 ? `${index}` : `${index}+` : 'Any',
    }
    return option
  })

  return meta
}


function removeUnderscoreAndCapitalize(str: string): string {
  const replacedStr = replace(str, /_/g, ' ')
  const capitalizedWords = map(replacedStr.split(' '), capitalize)
  return capitalizedWords.join(' ')
}
