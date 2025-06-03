import inputTypes from '~/constants/forms/inputTypes'

const useFloorPlanFields = () => {
  return [
    {
      key: 'guest_count',
      label: 'Guests',
      inputType: inputTypes.COUNTER,
      required: true,
    },
    {
      key: 'bedroom_count',
      label: 'Bedrooms',
      inputType: inputTypes.COUNTER,
      required: true,
    },
    {
      key: 'bed_count',
      label: 'Beds',
      inputType: inputTypes.COUNTER,
      required: true,
    },
    {
      key: 'bathroom_count',
      label: 'Bathrooms',
      inputType: inputTypes.COUNTER,
      required: true,
    },
  ]
}

export default useFloorPlanFields
