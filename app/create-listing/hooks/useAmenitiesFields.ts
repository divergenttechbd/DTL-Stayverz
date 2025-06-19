import { IOptionProps } from '~/components/form/inputs/multiSelectInput/MultiSelectInput'
import SelectableCard from '~/components/form/inputs/multiSelectInput/Options/SelectableCard'
import inputTypes from '~/constants/forms/inputTypes'

export type AmenitiesType = {
  regular: IOptionProps[],
  stand_out: IOptionProps[],
  safety: IOptionProps[],
}

const useAmenitiesFields = (amenities: AmenitiesType) => {
  return [
    {
      key: 'amenities',
      inputType: inputTypes.MULTI_SELECT,
      options: amenities?.regular,
      CustomOption: SelectableCard,
      maxSelection: 0,
    },
    {
      key: 'standoutAmenities',
      label: 'Do you have any standout amenities?',
      inputType: inputTypes.MULTI_SELECT,
      options: amenities?.stand_out,
      CustomOption: SelectableCard,
      maxSelection: 0,
    },
    {
      key: 'safetyItems',
      label: 'Do you have any of these safety items?',
      inputType: inputTypes.MULTI_SELECT,
      options: amenities?.safety,
      CustomOption: SelectableCard,
      maxSelection: 0,
    },
  ]
}

export default useAmenitiesFields
