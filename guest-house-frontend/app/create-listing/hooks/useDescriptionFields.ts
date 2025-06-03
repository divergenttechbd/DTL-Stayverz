import inputTypes from '~/constants/forms/inputTypes'

const useDescriptionFields = () => {
  return [
    {
      key: 'description',
      label: 'Description',
      inputType: inputTypes.TEXTAREA,
      showCharacterCount: true,
      required: true,
      rows: 5,
      maxCharacter: 2000,
    },
  ]
}

export default useDescriptionFields

