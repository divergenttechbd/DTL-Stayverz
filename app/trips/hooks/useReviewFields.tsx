

import { useMemo } from 'react'
import inputTypes from '~/constants/forms/inputTypes'

const useReviewFields = () => {
  return useMemo(() => [
    {
      key: 'rating',
      inputType: inputTypes.RATING,
      label: 'How was your stay?',
      required: true
    },
    {
      key: 'review',
      inputType: inputTypes.TEXTAREA,
      required: true,
      rows: 5,
      placeholder: 'Write a public review',
      helperText: (
        <div className='mb-3'>
          <h3 className='text-2xl font-semibold'>Write a public review</h3>
          <p className='text-sm'>
            Give other travellers a heads-up about what they can expect. After the review period ends, we&apos;ll publish this on your host&apos;s listing.
          </p>
        </div>
      )
    }
  ], [])
}

export default useReviewFields

