'use client'

import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import Form from '~/components/form/Form'
import inputTypes from '~/constants/forms/inputTypes'
import { PhotoMenu } from '~/app/create-listing/[listing_id]/photos/components/PhotoMenu'
import { uploadFile } from '~/queries/client/upload'
import { IUploadInputMeta } from '~/components/form/inputs/UploadInput/UploadInput'

type PhotoFormProps = {
  submitButtonLabel:ReactNode
  onSubmit: (data: Record<string, any>) => Promise<any> | void
  formInstance: UseFormReturn
  cover_photo: string
}

export const PhotosForm:FC<PhotoFormProps> = ({submitButtonLabel=null, onSubmit, formInstance, cover_photo}) => {
  const {setValue} = formInstance
  const [coverPhoto, setCoverPhoto] = useState(cover_photo)

  useEffect(() => {
    setValue('cover_photo', coverPhoto)
  }, [coverPhoto, setValue])

  const handleUpload = useCallback(async (data: FileList) => {
    if (data.length > 0) {
      const payload = {
        document: Array.from(data),
        folder: 'sample',
      }

      try {
        const res = await uploadFile(payload)
        if (!res.isSucceed) throw res.data
        if(!coverPhoto) 
          setCoverPhoto(res.data.urls?.[0])
        return res.data.urls as string[]
      } catch (err) {
        return []
      }
    } else {
      return []
    }
  }, [coverPhoto])

  const handleSetCover = useCallback((file:string) => async () => {
    setCoverPhoto(file)
  }, [])


  const handleDelete = useCallback((file:string) => async () => {
    const currentPhotos = formInstance.getValues('images')
    formInstance.setValue('images', currentPhotos.filter((photo:string) => photo !== file))
    if(file === coverPhoto) 
      handleSetCover(currentPhotos?.find((photo: string) => photo !== file))
  }, [coverPhoto, formInstance, handleSetCover])

  const meta = useMemo(() => {
    return [
      {
        inputType: inputTypes.IMAGE,
        key: 'images',
        label: 'Photos',
        multiple: true,
        required: true,
        renderAction: ({file}:{file:string}) => <PhotoMenu onSet={handleSetCover(file)} isCover={file === coverPhoto} onDelete={handleDelete(file)}/>,
        onUpload: handleUpload
      } as IUploadInputMeta
    ]
  }, [coverPhoto, handleDelete, handleSetCover, handleUpload])

  return (
    <Form
      formInstance={formInstance}
      fields={meta}
      onSubmit={onSubmit}
      submitButtonLabel={submitButtonLabel}
    />
  )
}
