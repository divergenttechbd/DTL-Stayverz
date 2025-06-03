import { IRadioInputMeta } from '~/components/form/inputs/RadioInput'
import inputTypes from '~/constants/forms/inputTypes'

const useStatusFields = () => {
  return [
    {
      key: 'status',
      label: 'Status',
      inputType: inputTypes.RADIO,
      required: true,
      options: [
        {
          key: 'unpublished',
          label: 'Unpublished'
        },
        {
          key: 'published',
          label: 'Published'
        }
      ]      
    } as IRadioInputMeta,
  ]
}

export default useStatusFields

