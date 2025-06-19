'use client'

import { FC, ReactNode, useCallback } from 'react'
import {
  Controller,
  ControllerRenderProps,
  UseFormReturn,
} from 'react-hook-form'
import { ICommonInputMeta } from '~/components/form/types'

export interface IOptionProps {
  name: string
  icon?: ReactNode | string
  iconActive?: ReactNode | string
  id: string | number
  description?: string
  short_description?: string
}

export interface ISelectInputMeta extends ICommonInputMeta {
  CustomOption?: FC<any>
  disabled?: boolean
  options?: IOptionProps[]
  maxSelection?: number
  labelClassName?: string
  defaultValue?: (number | string)[]
  renderOptions?: (field: IMultiSelectOptionProps['field'], handleSelect: IMultiSelectOptionProps['handleSelect']) => ReactNode
}

interface IMultiSelectInputProps {
  meta: ISelectInputMeta
  formInstance: UseFormReturn
  isInvalid: boolean

}

const MultiSelectInput: FC<IMultiSelectInputProps> = ({
  meta,
  formInstance,
  isInvalid,
}) => {
  const { control } = formInstance

  const handleSelect = useCallback(
    (onChange: Function, value: (number | string)[]) => (itemId: number | string) => {
      if(meta.disabled) return
      if (value.includes(itemId)) {
        // Deselecting an item
        const updatedSelectedItems = value.filter((id) => id !== itemId)
        onChange(updatedSelectedItems)
      } else {
        // Selecting an item
        if (
          meta.maxSelection &&
          meta.maxSelection > 0 &&
          value.length >= (meta.maxSelection || 0)
        ) {
          const newSelectedItems = [...(value || [])]
          newSelectedItems.shift() // Remove the oldest selected item (FIFO)
          newSelectedItems.push(itemId) // Add the new selected item
          onChange(newSelectedItems)
        } else {
          onChange([...value, itemId])
        }
      }
    },
    [meta]
  )

  const renderList = useCallback(
    ({ field }: { field: ControllerRenderProps }) => {
      return (
        <MultiSelectOption
          handleSelect={handleSelect}
          meta={meta}
          field={field}
        />
      )
    },
    [meta, handleSelect]
  )

  return (
    <>
      <p className={meta?.labelClassName}>{meta?.label}</p>
      <Controller
        name={meta.key}
        control={control}
        rules={{
          validate: (value) =>
            value.length > 0 || !meta.required || 'This field is required.',
        }}
        defaultValue={meta.defaultValue || []}
        render={renderList}
      />
    </>
  )
}

export interface IMultiSelectOptionProps {
  meta: ISelectInputMeta
  field: ControllerRenderProps
  handleSelect: Function
}

const MultiSelectOption = ({
  field,
  meta,
  handleSelect,
}: IMultiSelectOptionProps) => {
  const CustomOption = meta.CustomOption
  return (
    <div className={`${meta.className ? meta.className : 'flex flex-wrap'}`}>
      {meta.renderOptions ? meta.renderOptions(field, handleSelect) : null}
      {CustomOption ? (meta.options?.map((item: IOptionProps) => (
        <CustomOption
          key={item.id}
          item={item}
          disabled={meta.disabled}
          className={meta.className}
          isSelected={field.value?.includes(item.id)}
          onSelect={handleSelect(field.onChange, field.value)}
        />)
      )) : null}
      <input type='hidden' ref={field.ref} />
    </div>
  )
}

export default MultiSelectInput
