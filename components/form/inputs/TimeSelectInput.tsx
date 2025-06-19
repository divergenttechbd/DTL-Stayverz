import React, { FC } from 'react'
import { UseFormReturn } from 'react-hook-form'
import SelectInput from '~/components/form/inputs/SelectInput'
import { ICommonInputMeta } from '~/components/form/types'

type Option = {
  label: number | string;
  value: string;
}

export interface ITimeSelectInputMeta extends ICommonInputMeta {
  CustomOption?: FC<any>;
}

interface ITimeSelectInputProps {
  meta: ITimeSelectInputMeta;
  formInstance: UseFormReturn;
  isInvalid: boolean;
}

export const timeOptions = [
  { label: '12:00 AM', value: '00:00:00' },
  { label: '1:00 AM', value: '01:00:00' },
  { label: '2:00 AM', value: '02:00:00' },
  { label: '3:00 AM', value: '03:00:00' },
  { label: '4:00 AM', value: '04:00:00' },
  { label: '5:00 AM', value: '05:00:00' },
  { label: '6:00 AM', value: '06:00:00' },
  { label: '7:00 AM', value: '07:00:00' },
  { label: '8:00 AM', value: '08:00:00' },
  { label: '9:00 AM', value: '09:00:00' },
  { label: '10:00 AM', value: '10:00:00' },
  { label: '11:00 AM', value: '11:00:00' },
  { label: '12:00 PM', value: '12:00:00' },
  { label: '1:00 PM', value: '13:00:00' },
  { label: '2:00 PM', value: '14:00:00' },
  { label: '3:00 PM', value: '15:00:00' },
  { label: '4:00 PM', value: '16:00:00' },
  { label: '5:00 PM', value: '17:00:00' },
  { label: '6:00 PM', value: '18:00:00' },
  { label: '7:00 PM', value: '19:00:00' },
  { label: '8:00 PM', value: '20:00:00' },
  { label: '9:00 PM', value: '21:00:00' },
  { label: '10:00 PM', value: '22:00:00' },
  { label: '11:00 PM', value: '23:00:00' },
]

const TimeSelectInput: FC<ITimeSelectInputProps> = ({ meta, formInstance, isInvalid }) => {
  return (
    <SelectInput meta={{...meta, options: timeOptions}} formInstance={formInstance} isInvalid={isInvalid}/>
  )
}

export default TimeSelectInput

