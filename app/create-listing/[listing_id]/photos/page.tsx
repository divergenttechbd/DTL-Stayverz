import { PhotosForm } from '~/app/create-listing/[listing_id]/photos/components/PhotosForm'
import { IParams } from '~/app/create-listing/types'

export default function Photos({params}: IParams) {
  return (
    <div className='flex min-h-[80vh] flex-col items-center justify-between p-5 sm:p-24'>
      <div className='mx-auto max-w-xl'>
        <p className='text-[20px] sm:text-[32px] mt-3 font-medium mb-2'>Share some photos of your place</p>
        <p className='text-[18px] text-gray-500 mb-5'>You can add more later.</p>
        <PhotosForm />
      </div>
    </div>
  )
}

