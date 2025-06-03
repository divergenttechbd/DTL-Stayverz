'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { UseFormReturn, useForm, useWatch } from 'react-hook-form'
import Form, { IFormProps } from '~/components/form/Form'
import inputTypes from '~/constants/forms/inputTypes'
import { PhotoMenu } from '~/app/create-listing/[listing_id]/photos/components/PhotoMenu'
import { uploadFile } from '~/queries/client/upload'
import { useNewListingStore } from '~/app/create-listing/store/newListingStore'
import { IUploadInputMeta } from '~/components/form/inputs/UploadInput/UploadInput'

export const PhotosForm = () => {
  const formInstance = useForm({defaultValues: {}}) as unknown as UseFormReturn
  const {setValue} = formInstance
  const watchAllFields = useWatch({control: formInstance.control})
  const [coverPhoto, setCoverPhoto] = useState('')
  const {setData, setTriggerForm, currentListingData} = useNewListingStore()

  useEffect(() => {
    setData(formInstance.getValues())
  }, [formInstance, setData, watchAllFields])

  useEffect(() => {
    setTriggerForm(formInstance.trigger)
  }, [formInstance, setTriggerForm])

  useEffect(() => {
    setValue('cover_photo', coverPhoto)
  }, [coverPhoto, setValue])

  const handleSubmit: IFormProps['onSubmit'] = useCallback((data) => console.log(data), [])

  useEffect(() => {
    formInstance.setValue('images', currentListingData.images)
    setCoverPhoto(currentListingData.cover_photo)
  }, [currentListingData, formInstance])

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
      onSubmit={handleSubmit}
    />
  )
}
