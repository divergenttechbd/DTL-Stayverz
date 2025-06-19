import { IAddress, ILocationInputMeta } from '~/components/form/inputs/LocationInput/LocationInput'
import { IOptionProps } from '~/components/form/inputs/multiSelectInput/MultiSelectInput'
import inputTypes from '~/constants/forms/inputTypes'

export type AmenitiesType = {
  regular: IOptionProps[],
  stand_out: IOptionProps[],
  safety: IOptionProps[],
}

const useLocationFields = (location: IAddress) => {
  return [
    {
      key: 'location',
      label: 'Location',
      inputType: inputTypes.LOCATION,
      required: true,
      defaultValue: location
    } as ILocationInputMeta,
  ]
}

export default useLocationFields
