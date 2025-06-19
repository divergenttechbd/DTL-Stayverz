import { IGroupInputMeta } from '~/components/form/inputs/GroupInput'
import { ILocationInputMeta } from '~/components/form/inputs/LocationInput/LocationInput'
import { ISelectInputMeta } from '~/components/form/inputs/multiSelectInput/MultiSelectInput'
import { IRangeSliderInputMeta } from '~/components/form/inputs/RangeSliderInput'
import { ITextAreaInputMeta } from '~/components/form/inputs/TextAreaInput'
import { ITextInputMeta } from '~/components/form/inputs/TextInput'
import { IUploadInputMeta } from '~/components/form/inputs/UploadInput/UploadInput'

export interface ICustomInputMeta {
  inputType: string
  key: string
  hide?: boolean
  className?: string
  render?: Function
}

export interface ICommonInputMeta {
  key: string
  inputType: string
  label: string
  className?: string
  hide?: boolean
  required?: boolean
  checked?: boolean
}

export type IInputMeta = ITextInputMeta | ISelectInputMeta | ICustomInputMeta | ILocationInputMeta | ITextAreaInputMeta | IUploadInputMeta | IRangeSliderInputMeta| IGroupInputMeta
