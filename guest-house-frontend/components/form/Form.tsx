'use client'
import { FC, Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import BooleanInput, { IBooleanInputMeta } from '~/components/form/inputs/BooleanInput'
import CheckboxInput, { ICheckboxInputMeta } from '~/components/form/inputs/CheckboxInput'
import CounterInput, { ICounterInputMeta } from '~/components/form/inputs/CounterInput'
import { DateRange, IDateRangeInputMeta } from '~/components/form/inputs/DateRangeInput/DateRangeInput'
import GroupInput, { IGroupInputMeta } from '~/components/form/inputs/GroupInput'
import InputError from '~/components/form/inputs/InputError'
import LocationInput, { ILocationInputMeta } from '~/components/form/inputs/LocationInput/LocationInput'
import RadioInput, { IRadioInputMeta } from '~/components/form/inputs/RadioInput'
import RangeSliderInput, { IRangeSliderInputMeta } from '~/components/form/inputs/RangeSliderInput'
import SelectInput from '~/components/form/inputs/SelectInput'
import TextAreaInput, { ITextAreaInputMeta } from '~/components/form/inputs/TextAreaInput'
import TextInput, { ITextInputMeta } from '~/components/form/inputs/TextInput'
import TimeSelectInput, { ITimeSelectInputMeta } from '~/components/form/inputs/TimeSelectInput'
import UploadInput, { IUploadInputMeta } from '~/components/form/inputs/UploadInput/UploadInput'
import MultiSelectInput, { ISelectInputMeta } from '~/components/form/inputs/multiSelectInput/MultiSelectInput'
import RatingInput, { IRatingInputMeta } from '~/components/form/inputs/ratingInput/RatingInput'
import { ICustomInputMeta, IInputMeta } from '~/components/form/types'
import inputTypes from '~/constants/forms/inputTypes'

export interface IFormProps {
  fields: IInputMeta[]
  onSubmit: (data: Record<string, any>) => Promise<any> | void
  submitButtonLabel?: ReactNode
  className?: string
  formInstance: UseFormReturn
  inputsContainerClassName?: string
  actionsContainerClassName?: string
  footerContent?: ReactNode
  resetForm?: boolean
}
interface IInputProps {
  fields: IFormProps['fields']
  className?: string
  formInstance: IFormProps['formInstance']
  errors: any
}

export const Input = ({ fields, formInstance, className, errors }: IInputProps) => {
  const filteredFields = useMemo(
    () => fields.filter((field) => !field.hide),
    [fields]
  )
  return filteredFields.map((field, idx) =>
    field.inputType === inputTypes.CUSTOM ? (
      <div key={idx} className={field.className || ''}>
        {(field as ICustomInputMeta).render?.(formInstance)}
      </div>
    ) : (
      <Fragment key={idx}>
        {(field.inputType === inputTypes.TEXT ||
          field.inputType === inputTypes.PASSWORD ||
          field.inputType === inputTypes.NUMBER) && (
          <TextInput
            meta={field as ITextInputMeta}
            formInstance={formInstance}
            isInvalid={errors?.[field.key] ? true : false}
          />
        )}
        {field.inputType === inputTypes.TEXTAREA && (
          <TextAreaInput
            meta={field as ITextAreaInputMeta}
            formInstance={formInstance}
            isInvalid={errors?.[field.key] ? true : false}
          />
        )}
        {field.inputType === inputTypes.MULTI_SELECT && (
          <MultiSelectInput
            meta={field as ISelectInputMeta}
            formInstance={formInstance}
            isInvalid={errors?.[field.key] ? true : false}
          />
        )}
        {field.inputType === inputTypes.COUNTER && (
          <CounterInput
            meta={field as ICounterInputMeta}
            formInstance={formInstance}
            isInvalid={errors?.[field.key] ? true : false}
          />
        )}
        {(field.inputType === inputTypes.FILE || field.inputType === inputTypes.IMAGE) && (
          <UploadInput
            meta={field as IUploadInputMeta}
            formInstance={formInstance}
            isInvalid={errors?.[field.key] ? true : false}
          />
        )}
        {(field.inputType === inputTypes.LOCATION) && (
          <LocationInput
            meta={field as ILocationInputMeta}
            formInstance={formInstance}
            isInvalid={errors?.[field.key] ? true : false}
          />
        )}
        {(field.inputType === inputTypes.RADIO) && (
          <RadioInput
            meta={field as IRadioInputMeta}
            formInstance={formInstance}
            isInvalid={errors?.[field.key] ? true : false}
          />
        )}
        {(field.inputType === inputTypes.BOOLEAN) && (
          <BooleanInput
            meta={field as IBooleanInputMeta}
            formInstance={formInstance}
            isInvalid={errors?.[field.key] ? true : false}
          />
        )}
        {(field.inputType === inputTypes.SELECT) && (
          <SelectInput
            meta={field as IBooleanInputMeta}
            formInstance={formInstance}
            isInvalid={errors?.[field.key] ? true : false}
          />
        )}
        {(field.inputType === inputTypes.RATING) && (
          <RatingInput
            meta={field as IRatingInputMeta}
            formInstance={formInstance}
            isInvalid={errors?.[field.key] ? true : false}
          />
        )}
        {(field.inputType === inputTypes.DATE_RANGE) && (
          <DateRange
            meta={field as IDateRangeInputMeta}
            formInstance={formInstance}
            isInvalid={errors?.[field.key] ? true : false}
          />
        )}
        {(field.inputType === inputTypes.TIME_SELECT) && (
          <TimeSelectInput
            meta={field as ITimeSelectInputMeta}
            formInstance={formInstance}
            isInvalid={errors?.[field.key] ? true : false}
          />
        )}
        {(field.inputType === inputTypes.RANGE_SLIDER) && (
          <RangeSliderInput
            meta={field as IRangeSliderInputMeta}
            formInstance={formInstance}
            isInvalid={errors?.[field.key] ? true : false}
          />
        )}
        {(field.inputType === inputTypes.CHECKBOX) && (
          <CheckboxInput
            meta={field as ICheckboxInputMeta}
            formInstance={formInstance}
            isInvalid={errors?.[field.key] ? true : false}
            
          />
        )}
        {field.inputType === inputTypes.GROUP_INPUT && (
          <GroupInput
            meta={field as IGroupInputMeta}
            formInstance={formInstance}
          />
        )}
        <InputError error={errors?.[field.key]} />
      </Fragment>
    )
  )
}

const Form: FC<IFormProps> = ({
  fields,
  onSubmit,
  submitButtonLabel,
  className,
  formInstance,
  inputsContainerClassName,
  actionsContainerClassName,
  footerContent,
  resetForm = true,
}) => {
  const {
    formState: { errors, isSubmitSuccessful },
  } = formInstance

  const [nonFieldError, setNonFieldError] = useState('')

  useEffect(() => {
    if (isSubmitSuccessful && resetForm) {
      formInstance.reset()
    }
  }, [isSubmitSuccessful, formInstance, resetForm])

  const handleSubmit = useCallback(async (data: Record<string, any>) => {
    const res = await onSubmit(data)
    if (!res?.isSucceed) setNonFieldError(res?.error)
  }, [onSubmit])
  return (
    <div>
      <form
        onSubmit={formInstance.handleSubmit(handleSubmit)}
        className={className}
      >
        <div className={`${inputsContainerClassName || 'row flex flex-col gap-4'}`}>
          <Input
            formInstance={formInstance}
            fields={fields}
            errors={errors}
            className={className}
          />
        </div>


        {footerContent}
        {nonFieldError && (<div className='flex justify-center pt-3'><span className='text-[14px] text-red-500 text-center font-medium'>{nonFieldError}</span></div>)}
        <div
          className={` ${actionsContainerClassName || 'flex justify-end mt-5'
          }`}
        >
          {submitButtonLabel}
        </div>
      </form>
    </div>
  )
}

export default Form
