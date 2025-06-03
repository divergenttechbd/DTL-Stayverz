import debounce from 'lodash/debounce'
import { useCallback, useEffect, useState } from 'react'
import { IAddress } from '~/components/form/inputs/LocationInput/LocationInput'
import { getPlaceSuggestions } from '~/queries/client/map'

export default function useAddressPredictions(input: string): IAddress[] | undefined {
  const [predictions, setPredictions] = useState<IAddress[] | undefined>([])

  const getPlacePredictions = useCallback(async (input: string) => {
    if (!input) {
      setPredictions([])
      return
    }
    const res:IAddress[] = await (await getPlaceSuggestions({place: input})).data?.map((suggestion:any) => ({
      ...suggestion,
      lat: parseFloat(suggestion.latitude || '0'),
      lng: parseFloat(suggestion.longitude || '0'),
    }))
    setPredictions(res)
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedGetPlacePredictions = useCallback(
    debounce((input: string) => {
      getPlacePredictions(input)
    }, 500),
    []
  )

  useEffect(() => {
    debouncedGetPlacePredictions(input)
  }, [debouncedGetPlacePredictions, input])

  return predictions
}
