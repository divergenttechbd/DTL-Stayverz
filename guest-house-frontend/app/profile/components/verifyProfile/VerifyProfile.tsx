'use client'
import { ArrowLeft, Lock } from '@phosphor-icons/react'
import startCase from 'lodash/startCase'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import ViewVerifyProfile from '~/app/profile/components/verifyProfile/ViewVerifyProfile'
import Form from '~/components/form/Form'
import SelectableList from '~/components/form/inputs/multiSelectInput/Options/SelectableList'
import inputTypes from '~/constants/forms/inputTypes'
import { verifyProfile } from '~/queries/client/profile'
import { uploadFile } from '~/queries/client/upload'
import { useAuthStore } from '~/store/authStore'

export type ProfileVerificationProps = {
  front_image: string,
  back_image: string | null,
  document_type: string,
  status: string,
  remarks: string,
}

export const VerifyProfile = () => {
  const documentFormInstance = useForm()
  const imageFormInstance = useForm()
  const [documentType, setDocumentType] = useState('')
  const [loading, setLoading] = useState(false)
  const [verificationData, setVerificationData] = useState<ProfileVerificationProps | null>(null)
  const {getUserData, userData} = useAuthStore()

  const router = useRouter()

  const handleDocumentSubmit = useCallback((data:any) => {
    setDocumentType(data.document_type)
    if(data.document_type === 'passport') imageFormInstance.setValue('back_image', null)
  }, [imageFormInstance])
  const handleBack = useCallback((data:any) => {
    setDocumentType('')
  }, [])
  const handleBackToProfile = useCallback((data:any) => {
    router.push('/profile')
  }, [router])

  const getUserVerification = useCallback(async () => {
    try {
      const res = await getUserData()
      setVerificationData({
        front_image: res?.identity_verification_images?.front_image || '',
        back_image: res?.identity_verification_images?.back_image || '',
        document_type: res?.identity_verification_method || '',
        status: res?.identity_verification_status || '',
        remarks: res?.identity_verification_reject_reason || '',
      })
      imageFormInstance.setValue('front_image', res?.identity_verification_images?.front_image ? [res.identity_verification_images?.front_image] : [])
      imageFormInstance.setValue('back_image', res?.identity_verification_images?.back_image ? [res.identity_verification_images?.back_image] : [])
      documentFormInstance.setValue('document_type', res?.identity_verification_method)
      return res
    } catch (err) {
      console.log(err)
      return null
    }
  }, [documentFormInstance, getUserData, imageFormInstance])

  useEffect(() => {
    getUserVerification()
  
  }, [getUserVerification])
  

  const handleUpload = useCallback(async (data: FileList) => {
    if (data.length > 0) {
      const payload = {
        document: Array.from(data),
        folder: 'sample',
      }

      try {
        const res = await uploadFile(payload)
        if (!res.isSucceed) throw res.data
        return res.data.urls.map((img:string) => img)
      } catch (err) {
        console.log(err)
        return []
      }
    } else {
      console.log('No files selected.')
      return []
    }
  }, [])

  const handleSubmit = useCallback(async (data: any) => {
    const payload = {
      document_type: documentType,
      front_image: data.front_image[0],
      back_image: data.back_image?.[0],
    }

    try {
      setLoading(true)
      const res = await verifyProfile(payload)
      if(!res.isSucceed) throw res.data
      setLoading(false)
      router.push('/profile')
      return true
    } catch(err) {
      console.log(err)
      setLoading(false)
      return false
    }
  }, [documentType, router])


  const formMeta = useMemo(() => {
    return [
      {
        key: 'document_type',
        inputType: inputTypes.RADIO,
        options: [
          {key: 'driving_license', label: 'Driving License'},
          {key: 'passport', label: 'Passport'},
          {key: 'nid', label: 'Identity Card'}
        ],
        CustomOption: SelectableList,
        maxSelection: 0,
        className: 'w-1/3'
      },
    ]
  }, [])

  const imageMeta = useMemo(() => {
    return [
      {
        inputType: inputTypes.IMAGE,
        key: 'front_image',
        label: 'Front Image',
        className: 'min-w-[250px] min-h-[120px]',
        multiple: false,
        required: true,
        onUpload: handleUpload,
        canRemove: true,
      } as any,
      {
        inputType: inputTypes.IMAGE,
        key: 'back_image',
        label: 'Back Image',
        className: 'min-w-[250px] min-h-[120px]',
        multiple: false,
        required: true,
        onUpload: handleUpload,
        canRemove: true,
      } as any
    ]
  }, [handleUpload])

  const imageMetaForPassport = useMemo(() => {
    return [
      {
        inputType: inputTypes.IMAGE,
        key: 'front_image',
        label: 'Front Image',
        className: 'min-w-[350px] min-h-[120px]',
        multiple: false,
        required: true,
        canRemove: true,
        onUpload: handleUpload,
      } as any,
    ]
  }, [handleUpload])

  return (
    <div className='basic-info sm:max-w-[920px] m-auto'>
      {(verificationData?.status === 'pending' || verificationData?.status === 'verified') ? <ViewVerifyProfile data={verificationData} />:
        <div className='flex flex-row'>
          <div className='sm:w-[60%]'>
            {verificationData?.status === 'rejected' && <><p className='text-base font-semibold mb-2 text-red-500'>Your verification details got Rejected. Please resubmit your verification details.</p>
              <p><span className='font-semibold'>Rejection Note: </span> {verificationData?.remarks}</p></>}
            <h2 className='text-2xl font-medium mb-6 mt-6'>Choose an ID type to add</h2>
            <div className='mb-10 gap-x-16'>
              {
                !documentType ? <Form
                  formInstance={documentFormInstance}
                  fields={formMeta}
                  onSubmit={handleDocumentSubmit}
                  footerContent={
                    <div className='pb-5 mb-5'>
                      <p className='p-4 sm:m-4 bg-gray-100 rounded-lg mb-6'>
                        Your ID will be handled according to our 
                        <Link href={'/privacy-policy'}>
                          <span className='underline cursor-pointer font-semibold'> Privacy Policy</span>
                        </Link> and won&apos;t be shared with your Host or guests.</p>
                      <hr/>
                    </div>
                  }
                  submitButtonLabel=
                    {
                      <div className='flex flex-row justify-between'>
                        <button 
                          className='flex flex-row px-4 py-2 mr-2 items-center hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed underline' 
                          onClick={handleBackToProfile}>
                          <ArrowLeft className='mr-2'/>Back
                        </button>
                        <button type='submit' 
                          className='flex flex-row items-center rounded bg-[#f66c0e] px-6 pb-2 pt-2.5 text-neutral-50 hover:bg-[#f66c0e] disabled:bg-gray-400 disabled:cursor-not-allowed'>
                          <Lock  className='mr-2'/> Continue
                        </button>
                      </div>
                    }
                /> :
                  <Form
                    formInstance={imageFormInstance}
                    fields={documentType === 'passport' ? imageMetaForPassport : imageMeta}
                    onSubmit={handleSubmit}
                    inputsContainerClassName='flex flex-row w-full justify-around'
                    submitButtonLabel=
                      {
                        <div className='flex flex-row justify-between'>
                          <button onClick={handleBack} 
                            className='flex flex-row px-4 py-2 mr-2 items-center hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed underline'>
                            <ArrowLeft className='mr-2'/> Back
                          </button>
                          <button type='submit' 
                            className='flex flex-row rounded items-center bg-[#f66c0e] px-6 pb-2 pt-2.5 text-neutral-50 hover:bg-[#f66c0e] disabled:bg-gray-400 disabled:cursor-not-allowed'>
                            <Lock className='mr-2'/> Submit
                          </button>
                        </div>
                      }
                  />
              }
            </div>
          </div>
          {verificationData?.status === 'rejected' && <div className='ml-6'>
            <h2 className='text-xl font-semibold mb-6 ml-2'>Submitted Images ({startCase(verificationData?.document_type?.split('_')?.join(' '))})</h2>
            <div className='flex-1 flex flex-row items-center overflow-hidden'>
              <div>
                <h2 className='text-base font-normal mb-6 ml-2'>Front</h2>
                <Image
                  src={verificationData?.front_image || ''}
                  alt='ID Card Front'
                  width={250}
                  height={150}
                  className='rounded-lg object-cover transition duration-300 ease-in-out cursor-pointer hover:opacity-80 w-[250px] h-[150px] m-2'
                />
              </div>
              {verificationData?.document_type !== 'passport' && <div>
                <h2 className='text-xl font-normal mb-6 ml-2'>Back</h2>
                <Image
                  src={verificationData?.back_image || ''}
                  alt='ID Card Back'
                  width={250}
                  height={150}
                  className='rounded-lg object-cover hover:opacity-80 cursor-pointer ease-in-out transition duration-300 w-[250px] h-[150px] m-2'
                />
              </div>
              }
            </div>
          </div>}
        </div>}
    </div>
        
  )
}
