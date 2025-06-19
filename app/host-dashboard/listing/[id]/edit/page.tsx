'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import startCase from 'lodash/startCase'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import useAmenitiesFields from '~/app/create-listing/hooks/useAmenitiesFields'
import useDescriptionFields from '~/app/create-listing/hooks/useDescriptionFields'
import useFloorPlanFields from '~/app/create-listing/hooks/useFloorPlanFields'
import useLocationFields from '~/app/create-listing/hooks/useLocationFields'
import usePrivacyTypeFields from '~/app/create-listing/hooks/usePrivacyTypeFields'
import useStructureFields from '~/app/create-listing/hooks/useStructureFields'
import useTitleFields from '~/app/create-listing/hooks/useTitleFields'
import EditableItem from '~/app/host-dashboard/listing/[id]/edit/components/EditableItem'
import { PhotosForm } from '~/app/host-dashboard/listing/[id]/edit/components/PhotosForm'
import useCancellationPolicy from '~/app/host-dashboard/listing/[id]/edit/hooks/useCancellationPolicy'
import useHouseRules from '~/app/host-dashboard/listing/[id]/edit/hooks/useHouseRules'
import usePriceFields from '~/app/host-dashboard/listing/[id]/edit/hooks/usePriceFields'
import useStatusFields from '~/app/host-dashboard/listing/[id]/edit/hooks/useStatusFields'
import useTripDurationFields from '~/app/host-dashboard/listing/[id]/edit/hooks/useTripDurationFields'
import Form from '~/components/form/Form'
import { timeOptions } from '~/components/form/inputs/TimeSelectInput'
import { IOptionProps } from '~/components/form/inputs/multiSelectInput/MultiSelectInput'
import { IInputMeta } from '~/components/form/types'
import Loader from '~/components/loader/Loader'
import Modal from '~/components/modal/Modal'
import { getListing, getListingMetadata, updateListing } from '~/queries/client/listing'

const EditListing = ({params}:{params: {id: string}}) => {
  const { data: listing, refetch: refetchListing } = useQuery({queryKey: ['listing', params],queryFn: () => getListing({params})})
  const { data: listingMeta } = useQuery({queryKey: ['listingMeta', params],queryFn: () => getListingMetadata({})})

  const [showModal, setShowModal] = useState(false)
  const [currentFormFields, setCurrentFormFields] = useState<IInputMeta[] | null>([])
  const titleFields = useTitleFields()
  const descriptionFields = useDescriptionFields()
  const priceFields = usePriceFields()
  const amenitiesFields = useAmenitiesFields(listingMeta?.data?.amenities)
  const structureFields = useStructureFields(listingMeta?.data?.categories)
  const floorPlanFields = useFloorPlanFields()
  const privacyTypeFields = usePrivacyTypeFields(listingMeta?.data?.place_types)
  const cancellationPolicyFields = useCancellationPolicy(
    listingMeta?.data?.cancellation_policy?.map((d:any) => ({label: d.policy_name, key: d.id.toString(), description: d.description})))
  const statusFields = useStatusFields()
  const locationFields = useLocationFields({lat: listing?.data?.latitude, lng: listing?.data?.longitude, address: listing?.data?.address})
  const houseRules = useHouseRules()
  const tripDurationFields = useTripDurationFields()

  const formInstance = useForm({
    values: {
      ...(listing?.data), 
      category: listing?.data?.category ?  [listing?.data?.category] : [],
      place_type: listing?.data?.place_type ?  [listing?.data?.place_type] : [],
      cancellation_policy: listing?.data?.cancellation_policy?.id?.toString(),
      amenities: listing?.data?.amenities?.length ?  listing?.data?.amenities.map(({amenity}:{amenity: IOptionProps}) => amenity.id) : [],
      standoutAmenities: listing?.data?.amenities?.length ?  listing?.data?.amenities.map(({amenity}:{amenity: IOptionProps}) => amenity.id) : [],
      safetyItems: listing?.data?.amenities?.length ?  listing?.data?.amenities.map(({amenity}:{amenity: IOptionProps}) => amenity.id) : [],
    }
  })

  const updateListingMutation = useMutation({ mutationFn: updateListing })

  const onClose = useCallback(() => {
    setShowModal(false)
    setCurrentFormFields(null)
  }, [])

  const handleFieldsSelect = useCallback((fields: IInputMeta[] | null) => () => {
    setCurrentFormFields(fields)
    setShowModal(true)
  }, [])

  const handleFormSubmit = useCallback(async (data:any) => {
    const payload = {
      title: data.title,
      smoking_allowed: data.smoking_allowed,
      minimum_nights: data.minimum_nights,
      maximum_nights: data.maximum_nights,
      pet_allowed: data.pet_allowed,
      media_allowed: data.media_allowed,
      event_allowed: data.event_allowed,
      unmarried_couples_allowed: data.unmarried_couples_allowed,
      description: data.description,
      status: data.status,
      id: params.id,
      price: data.price,
      check_in: data.check_in,
      check_out: data.check_out,
      category: data.category?.[0],
      place_type: data.place_type?.[0],
      latitude: data.location?.lat,
      longitude: data.location?.lng,
      address: data.location?.address,
      guest_count: data.guest_count,
      bedroom_count: data.bedroom_count,
      bed_count: data.bed_count,
      bathroom_count: data.bathroom_count,
      cancellation_policy: listingMeta?.data?.cancellation_policy?.find((policy:any) => policy.id?.toString() === data.cancellation_policy),
      amenities: [...new Set([...(data.amenities || []), ...(data.standoutAmenities || []), ...(data.safetyItems || [])])],
      images: data.images?.map((photo:string) => photo),
      cover_photo: data.cover_photo,
    }
    try {
      updateListingMutation.mutate(payload, {
        onSuccess: (res) => {
          if(!res.isSucceed) throw res.data
          refetchListing()
          onClose()
        },
        onError: (err) => {
          console.log(err)
        },
        onSettled: () => {
        }
      })
    } catch(err) {
      console.log(err)
    }
  }, [listingMeta, onClose, params.id, refetchListing, updateListingMutation])

  const houseRulesData = useMemo(() => [
    {
      title: 'Pets allowed',
      value: listing?.data?.pet_allowed,
    },
    {
      title: 'Smocking allowed',
      value: listing?.data?.smocking_allowed,
    },
    {
      title: 'Media allowed',
      value: listing?.data?.media_allowed,
    },
    {
      title: 'Events allowed',
      value: listing?.data?.event_allowed,
    },
    {
      title: 'Unmarried Couples Allowed',
      value: listing?.data?.unmarried_couples_allowed
    }
  ].filter(d => d.value), [listing])


  return (
    <div className='flex sm:min-h-[80vh] flex-col items-center justify-between py-5 sm:py-24'>
      <div className='lg:min-w-[60%] lg:max-w-[60%]'>
        {listing?.data && listingMeta?.data ? <div className='justify-center items-center gap-10 w-full'>
          <div className=''>
            <h1 className='text-2xl font-medium mb-5 sm:mb-16 ml-4 sm:ml-0'>Edit Your Listing</h1>
            <EditableItem title='Title' sub_title={listing.data.title} onClick={handleFieldsSelect(titleFields)} />
            <hr className='my-4 sm:my-10'/>
            <EditableItem title='Description' sub_title={listing.data.description}  onClick={handleFieldsSelect(descriptionFields)} />
            <hr className='my-4 sm:my-10'/>
            <EditableItem title='Amenities' sub_title=''  onClick={handleFieldsSelect(amenitiesFields)} />
            <hr className='my-4 sm:my-10'/>
            <EditableItem title='Status' sub_title={startCase(listing.data.status?.split('_')?.join(' '))}  onClick={handleFieldsSelect(statusFields)} />
            <hr className='my-4 sm:my-10'/>
            <EditableItem title='Price' sub_title={`৳ ${listing.data.price}`}  onClick={handleFieldsSelect(priceFields)} />
            <hr className='my-4 sm:my-10'/>
            <EditableItem title='Location' sub_title={listing.data.address}  onClick={handleFieldsSelect(locationFields)} />
            <hr className='my-4 sm:my-10'/>
            <EditableItem title='Structure' sub_title={listingMeta.data.categories.find((meta:IOptionProps) => meta.id === listing.data.category)?.name}  onClick={handleFieldsSelect(structureFields)} />
            <hr className='my-4 sm:my-10'/>
            <EditableItem title='Place type' sub_title={listingMeta.data.place_types.find((meta:IOptionProps) => meta.id === listing.data.place_type)?.name}  onClick={handleFieldsSelect(privacyTypeFields)} />
            <hr className='my-4 sm:my-10'/>
            <EditableItem title='Floor Plan' sub_title={`Bedrooms: ${listing.data.bedroom_count}, Beds: ${listing.data.bed_count}, Bathrooms: ${listing.data.bathroom_count}, Guests: ${listing.data.guest_count}`}  onClick={handleFieldsSelect(floorPlanFields)} />
            <hr className='my-4 sm:my-10'/>
            <EditableItem title='Photos' sub_title='Your photos are a guest&apos;s first impression of your listing.'  onClick={handleFieldsSelect(null)} />
            <hr className='my-4 sm:my-10'/>
            <EditableItem title='Cancellation Policy' sub_title={`${listing.data.cancellation_policy.policy_name}`}  onClick={handleFieldsSelect(cancellationPolicyFields)} />
            <hr className='my-4 sm:my-10'/>
            <EditableItem title='Trip Duration' sub_title={`Minimum Nights: ${listing.data.minimum_nights}, Maximum Nights: ${listing.data.maximum_nights}`}  onClick={handleFieldsSelect(tripDurationFields)} />
            <hr className='my-4 sm:my-10'/>
            <EditableItem 
              title='House rules' 
              sub_title={`${houseRulesData.map(d=>d.title).join(', ')}${!!houseRulesData.length ? ' | ' : ''} 
                  Check-in: ${timeOptions.find(option => option.value === listing.data.check_in)?.label}, 
                  Checkout: ${timeOptions.find(option => option.value === listing.data.check_out)?.label}`}  
              onClick={handleFieldsSelect(houseRules)} />
          </div>
        </div> : <div className='h-[60vh]'>
          <Loader />
        </div>}
      </div>
      <Modal
        show={showModal}
        onClose={onClose}
        modalContainerclassName='lg:w-2/3 w-[95%] h-auto rounded-2xl'
        crossBtnClassName='ml-4 mt-5'
        bodyContainerClassName='max-h-[80vh] overflow-y-scroll scrollbar-hidden'
        header={<h4 className='text-2xl font-medium mb-2'>Edit you Listing</h4>}
      >
        {updateListingMutation.isLoading ? <div className='h-[40vh]'><Loader /></div> : (!!currentFormFields ?
          <Form 
            fields={currentFormFields} 
            formInstance={formInstance} 
            onSubmit={handleFormSubmit} 
            className='mx-3'
            submitButtonLabel={<button className='text-white bg-[#f66c0e] rounded-lg self-end px-6 py-2 sm:py-3 text-base  my-3 mx-2' type='submit'>Done</button>}
          /> : <div className='mx-3'>
            <PhotosForm
              formInstance={formInstance}
              cover_photo={listing?.data?.cover_photo}
              onSubmit={handleFormSubmit}
              submitButtonLabel={<button className='text-white bg-[#f66c0e] rounded-lg self-end px-6 py-2 sm:py-3 text-base  my-3 mx-2' type='submit'>Done</button>}
            />
          </div>)}
      </Modal>
    </div>
  )
}

export default EditListing

 
