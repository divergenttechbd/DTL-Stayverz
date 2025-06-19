import { FC, useEffect, useState } from 'react'
import Image from 'next/image'
import { X } from '@phosphor-icons/react'
import { IUploadInputMeta } from '~/components/form/inputs/UploadInput/UploadInput'
import { LoadingIcon } from '~/components/icons/LoadingIcon'

interface IUploadPreviewProps {
  className?: string
  previewClassName?: string
  processing?: boolean
  index: number
  file: File | string
  canRemove?: boolean
  onRemove?: () => void
  renderAction?: UploadPreviewsProps['renderAction']
}

const UploadPreview: FC<IUploadPreviewProps> = ({
  className,
  previewClassName,
  processing,
  index,
  file,
  canRemove,
  onRemove,
  renderAction,
}) => {
  const [imageSource, setImageSource] = useState<string>()
  const isUrl = typeof file === 'string'
  const isImageFile = !isUrl && file?.type?.startsWith('image/')
  const isImage = isUrl || isImageFile

  useEffect(() => {
    if (isUrl || !isImageFile) return
    const url = URL.createObjectURL(file)
    setImageSource(url)

    return () => {
      if (isUrl || !isImageFile) return
      URL.revokeObjectURL(url)
      setImageSource(undefined)
    }
  }, [file, isUrl, isImageFile])

  return (
    <div className={`bg-slate-100 p-3 rounded-lg relative flex items-center justify-center ${isImage ? 'w-52 h-52' : 'w-60 h-10'} ${processing ? 'opacity-75' : ''} ${className}`}>
      {processing ? <LoadingIcon size='lg' /> : null}
      {(isImageFile && imageSource) ?
        <Image src={imageSource} alt={file.name} fill style={{objectFit: 'cover'}} className={previewClassName} />
        : isUrl ? <Image src={file} alt={'image'} fill style={{objectFit: 'cover'}} className={previewClassName} />
          : <p className='text-gray-700 break-all line-clamp-1'>{file?.name}</p>
      }
      {(canRemove) ? <X className='absolute right-0 top-0 bg-white m-1 rounded fill-red-500 cursor-pointer' onClick={onRemove} /> : null}
      {renderAction ?
        <div className='absolute w-full top-0 m-1'>
          {renderAction({index, file})}
        </div>
        : null}
      {/* {isCover ?
        <div className='absolute left-1 top-1 m-1'>
          <div className='bg-white text-black text-sm font-medium mr-2 px-2.5 py-0.5 rounded'>Cover Image</div>
        </div>
        : null} */}
    </div>
  )
}

type UploadPreviewsProps = {
  className?: string
  previewClassName?: string
  processing?: boolean
  files: (File | string)[]
  canRemove?: boolean
  onRemove?: (index: number) => () => void
  renderAction?: IUploadInputMeta['renderAction']
}

export const UploadPreviews: FC<UploadPreviewsProps> = ({
  className,
  previewClassName,
  processing,
  files=[],
  onRemove,
  canRemove,
  renderAction,
}) => {
  return (
    <>
      {files.map((i, index) => (
        <UploadPreview className={className} previewClassName={previewClassName} key={index} processing={processing} canRemove={canRemove} index={index} file={i} onRemove={onRemove?.(index)} renderAction={renderAction} />
      ))}
    </>
  )
}
