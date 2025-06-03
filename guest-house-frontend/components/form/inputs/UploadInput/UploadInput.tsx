import { Upload } from '@phosphor-icons/react'
import pluralize from 'pluralize'
import { ChangeEventHandler, FC, ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { UploadPreviews } from '~/components/form/inputs/UploadInput/UploadPreview'
import { ICommonInputMeta } from '~/components/form/types'
import inputTypes from '~/constants/forms/inputTypes'
import { getUUID } from '~/lib/utils/uuid'

export interface IUploadInputMeta extends ICommonInputMeta {
  bordered?: boolean
  previewContainerClassName?: string
  previewClassName?: string
  multiple?: boolean
  canRemove?: boolean
  canChange?: boolean
  accept?: string
  renderAction?: (data: {index: number, file: File | string}) => ReactNode
  onUpload: (data: FileList) => Promise<string[]>
  onRemove?: (data: {index: number, file: File | string}) => void
  renderInputAction?: (args: {changeImage: boolean, inputType: string, fileURLs: string[]}) => ReactNode
  renderPreviewPlaceholder?: () => ReactNode
}

interface IUploadInputProps {
  meta: IUploadInputMeta
  formInstance: UseFormReturn
  isInvalid: boolean
}

export interface IFileFields {
  key: string,
  preSignedUrl: string;
}

const UploadInput: FC<IUploadInputProps> = ({
  meta,
  formInstance,
}) => {
  const { key, onUpload, onRemove, canChange, multiple, bordered=true, previewContainerClassName, previewClassName, renderInputAction, renderPreviewPlaceholder } = meta
  const { control, watch, trigger } = formInstance
  const inputRef = useRef<HTMLInputElement>(null)
  const fileURLs = watch(key) as string[]
  const [files, setFiles] = useState<{[key: string]: File}>({})
  const previews = useMemo(() => Object.keys(files).map(i => files[i]), [files])
  const changeImage = useMemo(() => !!(canChange && !multiple && fileURLs?.length), [canChange, multiple, fileURLs])

  const handlePrompt = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleUpload: (...event: any[]) => ChangeEventHandler<HTMLInputElement> = useCallback((onChange) => async (e) => {
    const fileCount = e.target.files?.length
    if (!fileCount) return

    const newFiles = [...e.target.files || []].reduce((a, c) => {
      a[getUUID()] = c
      return a
    }, {} as {[key: string]: File})

    setFiles(prevVal => ({...prevVal, ...newFiles}))
    const urls = await onUpload(e.target.files!)

    setFiles(prevVal => {
      const newUploadingFiles = {...prevVal}
      Object.keys(newFiles).forEach(i => delete newUploadingFiles[i])
      return newUploadingFiles
    })

    onChange(multiple ? [...watch(key) as string[] || [], ...urls as string[]] : [...urls as string[]])
    trigger(key)
  }, [watch, key, trigger, onUpload, multiple])

  const handleRemove = useCallback((onChange: (...event: any[]) => void) => (fileIndex: number) => () => {
    onChange(fileURLs?.filter((_, index) => index !== fileIndex))
    onRemove?.({file: fileURLs[fileIndex], index: fileIndex})
  }, [fileURLs, onRemove])

  return (
    <Controller
      control={control}
      name={meta.key}
      render={({ field: { onChange } }) => (
        <div className={`flex flex-col relative ${bordered ? 'rounded-lg border p-2.5' : ''} ${meta.className || ''}`}>
          <div className='cursor-pointer flex flex-col flex-1' onClick={handlePrompt}>
            {meta.label ?
              <label
                htmlFor={meta.key}
                className='text-sm text-gray-500 dark:text-gray-400'
              >
                {meta.label}
              </label>
              : null}
            {changeImage || (multiple || !fileURLs?.length) ?
              <>
                {renderInputAction ?
                  renderInputAction({changeImage, inputType: meta.inputType, fileURLs})
                  : <div className={`flex items-center block w-full text-[#202020] bg-transparent focus:outline-none gap-2 mt-2`}>
                    <p className='text-[#202020] text-md'>{changeImage ? 'Change' : 'Upload'} {pluralize(meta.inputType === inputTypes.IMAGE ? 'image' : 'file', fileURLs?.length)}</p>
                    <Upload />
                  </div>
                }
                <input
                  ref={inputRef}
                  type={'file'}
                  multiple={multiple}
                  accept={meta.accept || (meta.inputType === inputTypes.IMAGE ? 'image/*' : undefined)}
                  onChange={handleUpload(onChange)}
                  hidden
                />
              </>
              : null}
          </div>
          {(renderPreviewPlaceholder && !changeImage && !previews.length) ? renderPreviewPlaceholder() : null}
          {(fileURLs?.length || previews.length) ?
            <div className='flex gap-2 p-2.5 flex-wrap mx-auto'>
              {(changeImage && previews.length) ? null : <UploadPreviews className={previewContainerClassName} previewClassName={previewClassName} files={fileURLs?.map((file:string) => file)} canRemove={meta.canRemove} onRemove={handleRemove(onChange)} renderAction={meta.renderAction} />}
              <UploadPreviews className={previewContainerClassName} previewClassName={previewClassName} files={previews} processing />
            </div>
            : null}
        </div>
      )}
      rules={{ required: meta.required }}
    />
  )
}

export default UploadInput
