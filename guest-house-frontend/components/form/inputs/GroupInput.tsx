import { FC, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Input } from '~/components/form/Form'
import { ICommonInputMeta, IInputMeta } from '~/components/form/types'

export type IGroupInputMeta = ICommonInputMeta & {
  key?: string
  meta: Exclude<IInputMeta, IGroupInputMeta>[]
  labelClassName?: String
}

interface IGroupInputProps {
  meta: IGroupInputMeta
  formInstance: UseFormReturn

}

const GroupInput: FC<IGroupInputProps> = ({
  meta,
  formInstance,
}) => {
  const { formState: { errors }, } = formInstance
  const adjustedMeta = useMemo(() => ({ ...meta, meta: meta.key ? meta.meta.map(i => ({ ...i, key: `${meta.key}__${i.key}` })) : meta.meta }), [meta])

  return (
    <div className={meta.className}>
      <div className={`text-[22px] text-[#202020] font-medium mb-3 ${meta?.labelClassName}`}>{adjustedMeta.label}</div>
      <Input
        fields={adjustedMeta.meta}
        formInstance={formInstance}
        errors={errors}
      />
    </div>
  )
}

export default GroupInput

