import Slider from 'rc-slider'
import { FC, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { ICommonInputMeta } from '~/components/form/types'

export interface IRangeSliderInputMeta extends ICommonInputMeta {
  range?: number[],
  labelClassName: string,
  minLabel: string,
  maxLabel: string,
  minPrefix?: string,
  maxPrefix?: string
}

interface RangeSliderProps {
  meta: IRangeSliderInputMeta
  formInstance: UseFormReturn
  isInvalid: boolean
}

const DEFAULT_RANGE = [0, 1000]

const RangeSliderInput: FC<RangeSliderProps> = ({
  meta,
  formInstance,
}) => {

  const { key, className, labelClassName, label, minLabel, maxLabel } = meta

  const range = meta?.range || DEFAULT_RANGE
  const minFieldKey = `${key}_min`
  const maxFieldKey = `${key}_max`

  const { register, setValue, watch } = formInstance
  const currentRange = watch([minFieldKey, maxFieldKey])

  const handleSetRange = useCallback((values: number | number[]): void => {
    if (!Array.isArray(values)) return
    setValue(minFieldKey, values[0])
    setValue(maxFieldKey, values[1])
  }, [maxFieldKey, minFieldKey, setValue])


  return (
    <div className={`${className}`}>
      <div className={`${labelClassName}`}>{label}</div>
      <div className='space-y-5'>
        <div>
          <Slider
            className='price-range-slider mb-4'
            range
            draggableTrack
            min={range[0]}
            max={range[1]}
            value={currentRange}
            onChange={handleSetRange}
          />
        </div>
        <div className='flex justify-between items-center gap-2 lg:gap-5'>
          <div className={`relative flex-1`}>
            <div className='relative'>
              <div className='relative'>
                {meta.minPrefix ?
                  <div className='absolute mt-[10px] left-0 b-0 pb-2.5 px-2.5 pt-4 text-xs md:text-sm text-[#202020] bg-transparent rounded-lg peer'>
                    {meta.minPrefix}
                  </div> : ''}

                <input
                  type={'number'}
                  id={minFieldKey}
                  className={`block outline-none border border-[#f66c0e] rounded-lg remove-arrow ps-6 pb-3 pt-6 w-full text-xs md:text-sm text-[#202020] bg-transparent peer`}
                  placeholder=' '
                  {...register(minFieldKey, { value: range[0] })}
                />
              </div>
            </div>
            <label
              htmlFor={minFieldKey}
              className={`absolute -translate-y-3 scale-75 top-4 z-10 origin-[0] left-2.5 text-sm md:text-md font-[400] text-gray-500`}
            >
              {minLabel}
            </label>

          </div>
          <div className='w-2 lg:w-6 h-[1px] bg-[rgba(0,0,0,0.3)]'></div>
          <div className={`relative flex-1`}>
            <div className='relative'>
              <div className='relative'>
                {meta.maxPrefix ?
                  <div className='absolute mt-[10px] left-0 b-0 pb-2.5 px-2.5 pt-4 text-xs md:text-sm text-[#202020] bg-transparent rounded-lg peer'>
                    {meta.maxPrefix}
                  </div> : ''}

                <input
                  type={'number'}
                  id={maxFieldKey}
                  className={`block outline-none remove-arrow ps-6 pb-3 pt-6 w-full text-xs md:text-sm text-[#202020] bg-transparent rounded-lg border peer border-[#f66c0e]`}
                  placeholder=' '
                  {...register(maxFieldKey, { value: range[1] })}
                />
              </div>

            </div>
            <label
              htmlFor={maxFieldKey}
              className={`absolute -translate-y-3 scale-75 top-4 z-10 origin-[0] left-2.5 text-sm md:text-md font-[400] text-gray-500 ' 
            }`}
            >
              {maxLabel}
            </label>

          </div>
        </div>
      </div>
    </div>
  )
}

export default RangeSliderInput


