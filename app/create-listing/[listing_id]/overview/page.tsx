import { IParams } from '~/app/create-listing/types'

export default function Overview({params}: IParams) {
  return (
    <div className='flex min-h-[80vh] flex-col items-center justify-between p-5 sm:p-24'>
      <div className='mx-auto sm:max-w-[80%]'>
        <div className='flex flex-col sm:flex-row justify-center items-center gap-10'>
          <h1 className='text-3xl sm:text-5xl font-semibold sm:w-2/5'>It’s easy to get started on Stayverz</h1>
          <div className='sm:w-3/5'>
            <div className='flex flex-row mb-4'>
              <h1 className='text-xl sm:text-2xl font-bold'>1</h1>
              <div className='ml-5'>
                <p className='text-xl sm:text-2xl font-semibold'>Tell us about your place</p>
                <p className='text-lg sm:text-xl mt-1 text-gray-500'>Share some basic info, like where it is and how many guests can stay.</p>
              </div>
            </div>
            <hr className='my-5 sm:my-10'/>
            <div className='flex flex-row mb-4'>
              <h1 className='text-xl sm:text-2xl font-semibold'>2</h1>
              <div className='ml-5'>
                <p className='text-xl sm:text-2xl font-semibold'>Make it stand out</p>
                <p className='text-lg sm:text-xl mt-1 text-gray-500'>Add 5 or more photos plus a title and description—we&apos;ll help you out.</p>
              </div>
            </div>
            <hr className='my-5 sm:my-10'/>
            <div className='flex flex-row mb-4'>
              <h1 className='text-xl sm:text-2xl font-semibold'>3</h1>
              <div className='ml-5'>
                <p className='text-xl sm:text-2xl font-semibold'>Finish up and publish</p>
                <p className='text-lg sm:text-xl mt-1 text-gray-500'>Choose if you&apos;d like to start with an experienced guest, set a starting price, and publish your listing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
