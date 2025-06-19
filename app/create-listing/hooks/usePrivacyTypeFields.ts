import { IOptionProps } from '~/components/form/inputs/multiSelectInput/MultiSelectInput'
import SelectableList from '~/components/form/inputs/multiSelectInput/Options/SelectableList'
import inputTypes from '~/constants/forms/inputTypes'

const usePrivacyTypeFields = (options: IOptionProps[]) => {
  return [
    {
      key: 'place_type',
      inputType: inputTypes.MULTI_SELECT,
      // required: true,
      options: options,
      CustomOption: SelectableList,
      maxSelection: 1,
    },
  ]
}

export default usePrivacyTypeFields
