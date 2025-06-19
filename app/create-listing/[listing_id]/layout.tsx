'use client'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { STEPS } from '~/app/create-listing/constants/steps'
import { useNewListingStore } from '~/app/create-listing/store/newListingStore'
import SiteBranding from '~/components/layout/SiteBranding'
import { createListing, getListing, getListingMetadata, updateListing } from '~/queries/client/listing'

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: {listing_id: string}
}) {
  const { refetch: refetchPropertyListingMetaData } = useQuery({ queryKey: ['propertyListingMetaData'], queryFn: getListingMetadata, enabled: false })
  const { refetch: refetchPropertyData } = useQuery({ queryKey: ['property', params.listing_id], queryFn: () => getListing({params: {id: params.listing_id}}), enabled: false })
  const {data, step, setStep, nextStep, previousStep, triggerForm, setMetaData, setCurrentListingData} = useNewListingStore()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [currentStep, setCurrentStep] = useState(1) 

  useEffect(() => {
    if(step > 0) {
      router.push(`/create-listing/${params.listing_id}/${STEPS[step - 1]}`)
      const originalStep = STEPS.findIndex(step => step === pathname.split('/')?.pop()) + 1
      setCurrentStep(originalStep)
    }
    else {
      const currentStep = STEPS.findIndex(step => step === pathname.split('/')?.pop()) + 1
      setStep(currentStep)
    }
  }, [step, pathname, router, params.listing_id, setStep])

  useEffect(() => {
    return () => {
      setStep(0)
    }
  }, [setStep])

  const getMetaAndProperty = useCallback(async () => {
    if(!step) return
    try {
      const { data: propertyListingMetaData } = await refetchPropertyListingMetaData()
      if(!propertyListingMetaData?.isSucceed) throw propertyListingMetaData?.data

      setMetaData(propertyListingMetaData.data)

      const {data: property} = await refetchPropertyData()
      if(!property?.isSucceed) throw property?.data

      setCurrentListingData(property.data)      
    } catch(err) {
      console.log(err)
    }
  }, [step, refetchPropertyListingMetaData, setMetaData, refetchPropertyData, setCurrentListingData])

  useEffect(() => {
    getMetaAndProperty()
  }, [getMetaAndProperty])
  
  const handleSubmit = useCallback(async (appendData = {}) => {
    const payload = {
      id: params.listing_id,
      category: data.category?.[0],
      place_type: data.place_type?.[0],
      title: data.title,
      description: data.description,
      latitude: data.location?.lat,
      longitude: data.location?.lng,
      address: data.location?.address,
      price: data.price,
      guest_count: data.guest_count,
      bedroom_count: data.bedroom_count,
      bed_count: data.bed_count,
      bathroom_count: data.bathroom_count,
      amenities: [...new Set([...(data.amenities || []), ...(data.standoutAmenities || []), ...(data.safetyItems || [])])],
      images: data.images?.map((photo:string) => photo),
      cover_photo: data.cover_photo,
      ...appendData
    }

    try {
      setLoading(true)
      const res = await updateListing(payload)
      if(!res.isSucceed) throw res.data
      setCurrentListingData(res.data)
      setLoading(false)
      return true
    } catch(err) {
      console.log(err)
      setLoading(false)
      return false
    }
  }, [data, params.listing_id, setCurrentListingData])
  
  const createNewProperty = useCallback(async () => {
    try {
      const res = await createListing({})
      router.push(`/create-listing/${res.data.unique_id}/structure`)
    } catch(err) {
      console.log(err)
    }
  }, [router])
  
  const onNextClick = useCallback( async () => {
    if(step === 0) {
      createNewProperty()
      return
    }
    const triggerResult = await triggerForm?.()
    if(step === 10) {
      await handleSubmit({status: 'published'})
      router.push('/host-dashboard/listing')
      return
    }
    if(triggerResult) {
      const submitSuccessful = await handleSubmit()
      if(submitSuccessful) nextStep()
    }
  }, [step, triggerForm, createNewProperty, handleSubmit, router, nextStep])

  const onBackClick = useCallback(() => {
    previousStep()
  }, [previousStep])

  const handleSaveAndExit = useCallback(async () => {
    await handleSubmit()
    router.push('/host-dashboard/listing')
  }, [handleSubmit, router])
  
  return (
    <>
      <div className='sticky top-0 w-full bg-white z-10 shadow-sm p-4 flex justify-between items-center'>
        <div className='text-black'>
          <SiteBranding />
        </div>
        {
          currentStep === 10 ? (
            <div>
              <button onClick={handleSaveAndExit} className='py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-[#202020] hover:border-black hover:outline-2 rounded-full border border-gray-200'>Publish Later</button>
            </div>
          ):(
            <div>
              <button onClick={handleSaveAndExit} className='py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-[#202020] hover:border-black hover:outline-2 rounded-full border border-gray-200'>Save & Exit</button>
            </div>
          )
        }
      </div>
      {children}
      <div className='sticky bottom-0 w-full bg-white z-10 shadow-inner h-[10vh] p-4 flex justify-between items-center'>
        <button  onClick={onBackClick} disabled={loading} className='px-4 py-2 mr-2 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed'><u>Back</u></button>
        <p className='text-[16px] sm:text-[20px]'>Step {step} / 10</p>
        {
          currentStep === 10 ? (
            <button onClick={onNextClick} disabled={loading} className='rounded bg-[#f66c0e] px-6 py-1.5 sm:py-2 text-neutral-50 hover:bg-[#f66c0e] disabled:bg-gray-400 disabled:cursor-not-allowed'>Publish Now</button>
          ) : (
            <button onClick={onNextClick} disabled={loading} className='rounded bg-[#f66c0e] px-6 py-1.5 sm:py-2 text-neutral-50 hover:bg-[#f66c0e] disabled:bg-gray-400 disabled:cursor-not-allowed'>Next</button>
          )
        }
      </div>
    </>
  )
}
