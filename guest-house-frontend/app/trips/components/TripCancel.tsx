'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import CancelTripCard from '~/app/trips/components/CancelTripCard'
import useCancelTripFields from '~/app/trips/hooks/useCancelTripFields'
import Form from '~/components/form/Form'
import { cancelBooking, getBooking } from '~/queries/client/bookings'

const TripCancel = ({ params }: { params: { invoice_no: string } })  => {
  const { data } = useQuery({ queryKey: ['tripDetails', params.invoice_no], queryFn: () => getBooking({ params: { invoice_no: params.invoice_no } }) })
  
  const formInstance = useForm()
  const queryClient = useQueryClient()
  const router = useRouter()

  const cancelTripFields = useCancelTripFields()
  
  const { mutateAsync:cancelTripAsync, isLoading } = useMutation({ 
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tripDetails'] })
    }
  })

  const handleCancelTrip = useCallback(async (data: any) => {
    const payload = { id: params.invoice_no, ...data }
    try {
      const mutation = await cancelTripAsync({data: payload})
      if(!mutation.isSucceed) throw mutation
      router.push('/trips')
      return mutation 
    } catch (error) {
      return error
    }
  },[params, router, cancelTripAsync])

  return (
    <>
      <div className='container mx-auto flex flex-col md:flex-row gap-5 md:gap-10'>
        <div className='flex-[1] '>
          <div className='flex items-center'>
            <h1 className='text-3xl font-semibold text-[#202020] my-10'>Trip Details</h1>
          </div>
          
          <div className='relative overflow-x-auto'>
            <Form 
              fields={cancelTripFields} 
              formInstance={formInstance} 
              onSubmit={handleCancelTrip} 
              className=''
              submitButtonLabel={<button className='text-white bg-black rounded-lg self-end px-6 py-2 sm:py-3 text-base  my-3 mx-2' type='submit'>Done</button>}
            /> 
          </div>

        </div>
        <div className='flex-[0.6] pb-[100px] md:pb-0 md:mt-10 relative'>
          <CancelTripCard data={data?.data?.booking_data}/>
        </div>
      </div>
    </>
  )
}

export default TripCancel
