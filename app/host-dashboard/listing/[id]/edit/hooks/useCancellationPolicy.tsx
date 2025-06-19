import { IRadioOption } from '~/components/form/inputs/RadioInput'
import inputTypes from '~/constants/forms/inputTypes'

const useCancellationPolicy = (options:IRadioOption) => {
  return [
    {
      key: 'cancellation_policy',
      label: 'Cancellation Policy',
      inputType: inputTypes.RADIO,
      required: true,
      options: options,     
    },
  ]
}

export default useCancellationPolicy

