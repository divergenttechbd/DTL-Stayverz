import Image from 'next/image'
import { FC, Fragment } from 'react'
import { ProfileVerificationProps } from '~/app/profile/components/verifyProfile/VerifyProfile'

type ViewVerifyProfileProps = {
  data: ProfileVerificationProps | null
}

const listItems = [
  {
    name: 'License',
    key: 'driving_license',
  },
  {
    name: 'Passport',
    key: 'passport',
  },
  {
    name: 'Identity Card',
    key: 'nid',
  }
]

const ViewVerifyProfile: FC<ViewVerifyProfileProps> = ({ data }) => {
  return (
    <div className='m-5 sm:m-0'>
      <p className='text-base font-semibold'>{data?.status === 'pending' ? <b className='text-yellow-500'>Your Verification Request is Pending</b> : <b className='text-green-700'>Your Verification Request is Approved</b>}</p>
      <div className='flex flex-col sm:flex-row gap-3 sm:items-center mt-5 sm:mt-10'>
        <div className='flex-1 flex flex-col'>
          <h2 className='text-2xl font-semibold sm:mb-6'>ID type</h2>
          {listItems.map((i, idx) => (
            <Fragment key={i.key}>
              <div className='flex flex-row w-full justify-between items-center border-gray-400 py-5'>
                <label className='text-base text-gray-800'>{i.name}</label>
                <div className={`border ${data?.document_type === i.key ? 'border-black' : 'border-gray-500'} rounded-[50%] w-5 h-5 flex items-center justify-center`}>
                  {data?.document_type === i.key ? <div className='bg-black rounded-[50%] w-3 h-3'></div> : null}
                </div>
              </div>
              {idx < listItems.length - 1 ? <hr /> : null}
            </Fragment>
          ))}
        </div>
        <div className='sm:ml-6'>
          <h2 className='text-2xl font-medium mb-6 sm:ml-2'>Submitted Images</h2>
          <div className='flex-1 flex flex-row items-center overflow-hidden gap-2'>
            <div>
              <h2 className='text-base sm:text-xl font-regular sm:font-normal mb-3 sm:mb-6 sm:ml-2'>Front</h2>
              <Image
                src={data?.front_image || ''}
                alt='ID Card Front'
                width={250}
                height={150}
                className='rounded-lg object-cover transition duration-300 ease-in-out cursor-pointer hover:opacity-80 aspect-[16/9] sm:w-[250px] sm:h-[150px] sm:m-2'
              />
            </div>
            {data?.document_type !== 'passport' && <div>
              <h2 className='text-base sm:text-xl font-regular sm:font-normal mb-3 sm:mb-6 sm:ml-2'>Back</h2>
              <Image
                src={data?.back_image || ''}
                alt='ID Card Back'
                width={250}
                height={150}
                className='rounded-lg object-cover transition duration-300 ease-in-out cursor-pointer hover:opacity-80 aspect-[16/9] sm:w-[250px] sm:h-[150px] sm:m-2'
              />
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewVerifyProfile
