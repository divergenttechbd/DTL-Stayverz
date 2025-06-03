import { ITextInputMeta } from '~/components/form/inputs/TextInput'
import inputTypes from '~/constants/forms/inputTypes'

const useTripDurationFields = () => {
  return [
    {
      key: 'minimum_nights',
      label: 'Minimum Nights',
      inputType: inputTypes.NUMBER,
      required: true,   
    } as ITextInputMeta,
    {
      key: 'maximum_nights',
      label: 'Maximum Nights',
      inputType: inputTypes.NUMBER,
      required: true,   
    } as ITextInputMeta,
  ]
}

export default useTripDurationFields

