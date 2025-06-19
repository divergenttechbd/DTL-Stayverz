

import { useMemo } from 'react'
import inputTypes from '~/constants/forms/inputTypes'

const useCancelTripFields = () => {
  return useMemo(() => [
    {
      key: 'cancellation_reason',
      inputType: inputTypes.TEXTAREA,
      required: true,
      rows: 5,
      placeholder: 'Write a reason to cancel',
      helperText: (
        <div className='mb-3'>
          <h3 className='text-2xl font-semibold'>Tell us why you need to cancel</h3>
        </div>
      )
    }
  ], [])
}

export default useCancelTripFields

