import { IBooleanInputMeta } from '~/components/form/inputs/BooleanInput'
import { ITimeSelectInputMeta } from '~/components/form/inputs/TimeSelectInput'
import inputTypes from '~/constants/forms/inputTypes'

const useHouseRules = () => {
  return [
    {
      key: 'smoking_allowed',
      label: 'Smoking allowed',
      inputType: inputTypes.BOOLEAN,
      required: true,
    } as IBooleanInputMeta,
    {
      key: 'pet_allowed',
      label: 'Pets Allowed',
      inputType: inputTypes.BOOLEAN,
      required: true,
    } as IBooleanInputMeta,
    {
      key: 'media_allowed',
      label: 'Media Allowed',
      inputType: inputTypes.BOOLEAN,
      required: true,
    } as IBooleanInputMeta,
    {
      key: 'event_allowed',
      label: 'Event Allowed',
      inputType: inputTypes.BOOLEAN,
      required: true,
    } as IBooleanInputMeta,
    {
      key: 'unmarried_couples_allowed',
      label: 'Unmarried Couples Allowed',
      inputType: inputTypes.BOOLEAN,
      required: true,
    } as IBooleanInputMeta,
    {
      key: 'check_in',
      label: 'Check-in Time',
      inputType: inputTypes.TIME_SELECT,
      required: true,
    } as ITimeSelectInputMeta,
    {
      key: 'check_out',
      label: 'Checkout Time',
      inputType: inputTypes.TIME_SELECT,
      required: true,
    } as ITimeSelectInputMeta,
  ]
}

export default useHouseRules

