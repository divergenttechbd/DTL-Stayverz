'use client'

import { Camera } from '@phosphor-icons/react'
import { FC, useCallback, useEffect, useMemo } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import Form, { IFormProps } from '~/components/form/Form'
import { IUploadInputMeta } from '~/components/form/inputs/UploadInput/UploadInput'
import inputTypes from '~/constants/forms/inputTypes'
import { updateProfile } from '~/queries/client/profile'
import { uploadFile } from '~/queries/client/upload'
import { useAuthStore } from '~/store/authStore'

type ProfileImageUploadProps = {}

export const ProfileImageUpload: FC<ProfileImageUploadProps> = ({}) => {
  const { userData } = useAuthStore()
  const formInstance: UseFormReturn = useForm() 
  const { setValue } = formInstance
  
  useEffect(() => {
    setValue('image', userData?.image ? [userData?.image] : [])
  }, [userData, setValue])


  const handleUpload = useCallback(async (data: FileList) => {
    if (data.length > 0) {
      const payload = {
        document: Array.from(data),
        folder: 'profile-image',
      }
      try {
        const uploadResponse = await uploadFile(payload)
        if (!uploadResponse.isSucceed) throw uploadResponse.data
        const [imgUrl] = uploadResponse.data.urls as string[]
        const updateResponse = await updateProfile({ image: imgUrl })
        if (updateResponse?.isSucceed) useAuthStore.setState(prevState => (prevState?.userData ? { userData: { ...prevState.userData, image: imgUrl } } : prevState))
        return [imgUrl]
      } catch (err) {
        return []
      }
    } else {
      return []
    }
  }, [])

  const meta = useMemo(() => {
    return [
      {
        inputType: inputTypes.IMAGE,
        key: 'image',
        required: true,
        onUpload: handleUpload,
        canChange: true,
        bordered: false,
        previewContainerClassName: 'bg-white',
        previewClassName: 'rounded-full',
        renderInputAction: ({changeImage}) => (
          <div id='uploadButton' className='absolute z-10 bottom-1 self-center text-black flex gap-3 bg-white shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] py-1 px-3 items-center text-sm rounded-full' onClick={() => {
            if ((window as any).flutterChannel) {
              (window as any).flutterChannel.postMessage('pickPhoto')
            }
          }}>
            <Camera size={24} />
            <span>{changeImage ? 'Change' : 'Add'}</span>
          </div>
        ),
        renderPreviewPlaceholder: () => (<div className='bg-gray-800 rounded-full w-52 h-52 mb-4 flex items-center justify-center relative mx-auto'>
          <span className='text-6xl text-white text-center'>
            {userData?.userFirstLetter}
          </span>
        </div>)
      } as IUploadInputMeta
    ]
  }, [handleUpload, userData])

  const handleSubmit: IFormProps['onSubmit'] = useCallback((data) => {
    console.log(data)
  }, [])

  return (
    <Form
      formInstance={formInstance}
      fields={meta}
      onSubmit={handleSubmit}
    />
  )
}
