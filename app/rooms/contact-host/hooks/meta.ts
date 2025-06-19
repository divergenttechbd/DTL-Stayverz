import { useMemo } from 'react'
import { ITextAreaInputMeta } from '~/components/form/inputs/TextAreaInput'
import inputTypes from '~/constants/forms/inputTypes'

export const useMessageFormMeta = () => {
  const meta = useMemo(() => (
    [
      {
        inputType: inputTypes.TEXTAREA,
        key: 'message',
        label: '',
        required: true,
        rows: 5,
      } as ITextAreaInputMeta
    ]
  ), [])

  return meta
}

