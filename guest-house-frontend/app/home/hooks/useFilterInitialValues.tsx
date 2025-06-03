import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export type LocationWiseSearchSearchedValuesType = {
  price_min: number | null
  price_max: number | null
  place_type__in: string[]
  bedroom_count: (number | string)[]
  bathroom_count: (number | string)[]
  bed_count: (number | string)[]
  listing_amenity__in: (number | string)[]
}

const useFilterInitialValues = () => {
  const search = useSearchParams()

  const filteredValues: LocationWiseSearchSearchedValuesType = useMemo(() => {
    const price_min = search.get('price_min')
    const price_max = search.get('price_max')
    const place_type__in = search.get('place_type__in')
    const bedroom_count = search.get('bedroom_count')
    const bathroom_count = search.get('bathroom_count')
    const bed_count = Number(search.get('bed_count'))
    const listing_amenity__in = search.get('listing_amenity__in')

    const amenityArr: (number | string)[] = listing_amenity__in
      ? listing_amenity__in?.split(',')?.map(el => Number(el))?.filter(el => !isNaN(el))
      : []

    const placeTypeArr: (string)[] = place_type__in
      ? place_type__in?.split(',')?.filter(el => !!el)
      : []


    return {
      price_min: price_min ? Number(price_min) : null,
      price_max: price_max ? Number(price_max) : null,
      place_type__in: placeTypeArr,
      bedroom_count: bedroom_count ? [Number(bedroom_count)] : [''],
      bathroom_count: bathroom_count ? [Number(bathroom_count)] : [''],
      bed_count: bed_count ? [Number(bed_count)] : [''],
      listing_amenity__in: amenityArr,
    }
  }, [search])



  return {
    initialValues: filteredValues,
  }
}

export default useFilterInitialValues
