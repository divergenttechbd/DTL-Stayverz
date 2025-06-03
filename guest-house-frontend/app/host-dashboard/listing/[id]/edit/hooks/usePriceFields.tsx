import { ITextInputMeta } from '~/components/form/inputs/TextInput'
import inputTypes from '~/constants/forms/inputTypes'

const usePriceFields = () => {
  return [
    {
      key: 'price',
      label: 'Price',
      inputType: inputTypes.NUMBER,
      required: true,   
    } as ITextInputMeta,
  ]
}

export default usePriceFields

