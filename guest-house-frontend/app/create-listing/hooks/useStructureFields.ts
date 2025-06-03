import { IOptionProps } from '~/components/form/inputs/multiSelectInput/MultiSelectInput'
import SelectableCard from '~/components/form/inputs/multiSelectInput/Options/SelectableCard'
import inputTypes from '~/constants/forms/inputTypes'

const useStructureFields = (options: IOptionProps[]) => {
  return [
    {
      key: 'category',
      inputType: inputTypes.MULTI_SELECT,
      required: true,
      options: options,
      CustomOption: SelectableCard,
      maxSelection: 1,
    },
  ]
}

export default useStructureFields
