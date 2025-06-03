import inputTypes from '~/constants/forms/inputTypes'

const useTitleFields = () => {
  return [
    {
      key: 'title',
      label: 'Title',
      inputType: inputTypes.TEXTAREA,
      showCharacterCount: true,
      required: true,
      rows: 5,
      maxCharacter: 50,
    },
  ]
}

export default useTitleFields
