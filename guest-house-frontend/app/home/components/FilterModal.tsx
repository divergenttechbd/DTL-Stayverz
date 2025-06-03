'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FC, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useFilterInitialValues from '~/app/home/hooks/useFilterInitialValues'
import useListingFilterMeta, { bedAndBathroomGroupList } from '~/app/home/hooks/useListingFilterMeta'
import Form, { IFormProps } from '~/components/form/Form'
import Modal from '~/components/modal/Modal'
import { removeEmptyValue } from '~/lib/utils/object'
import { getAsQueryString, getObjectFromSearchParams } from '~/lib/utils/url'

type FilterModalProps = {
  state: boolean,
  handleModalClose: () => void
  data: any
}

const FilterModal: FC<FilterModalProps> = ({ data, state, handleModalClose }) => {
  const { initialValues } = useFilterInitialValues()
  const searchParams = useSearchParams()
  const filterFileds = useListingFilterMeta(data)
  const router = useRouter()
  const formInstance = useForm()
  const pathname = usePathname()

  useEffect(() => {
    const formValues: any = { ...initialValues }
    Object.keys(formValues).forEach(key => {
      if (formValues[key]) {
        formInstance.setValue(key, formValues[key])
      }
    })
  }, [initialValues, formInstance])


  const clearFilter = useCallback(() => {
    formInstance.reset()
    formInstance.setValue('place_type__in', [''])
    formInstance.setValue('listing_amenity__in', [''])
    bedAndBathroomGroupList.forEach(item => formInstance.setValue(item.key, ['']))
  }, [formInstance])

  const handleSubmit: IFormProps['onSubmit'] = useCallback((data) => {
    const newData = {
      ...getObjectFromSearchParams(searchParams),
      ...data,
    }

    if (newData['price_min'] === 0 && newData['price_max'] === 99999) {
      delete (newData['price_min'])
      delete (newData['price_max'])
    }

    const filterQuery = getAsQueryString(removeEmptyValue(newData, true))
    router.push(`${pathname}${filterQuery}`)
    handleModalClose()
  },
  [handleModalClose, router, searchParams, pathname]
  )


  return (
    <Modal
      show={state}
      onClose={handleModalClose}
      title='Filters'
      modalContainerclassName={`fixed sm:block h-full sm:h-auto w-screen sm:w-[44rem] rounded-xl pt-3 overflow-hidden slide-in-bottom rounded-[0px] sm:rounded-xl`}
      titleContainerClassName='flex items-center justify-center gap-5 p-4 border-b'
      crossBtnClassName='absolute left-4 top-1/2 -translate-y-1/2'
      closeOnOutsideClick={true}
    >
      <div className='h-full sm:h-[85vh] overflow-y-auto'>
        <div className='p-6 h-[90vh] sm:h-[max-content] scrollbar-hidden'>
          <Form
            resetForm={false}
            fields={filterFileds}
            formInstance={formInstance}
            onSubmit={handleSubmit}
            submitButtonLabel={
              <div className=''>
                <div className='fixed left-0 right-0 mx-auto bg-[#ffffff] border border-t bottom-0 w-full px-5 sm:pb-auto py-4 flex items-end justify-between gap-5' >
                  <button onClick={clearFilter} type='button' className='text-start underline text-[#202020] font-medium py-2'>
                    Clear All
                  </button>
                  <button type='submit' className='bg-[#f66c0e] text-white font-medium py-2 px-4 rounded-[8px]'>
                    Show places
                  </button>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </Modal>
  )
}

export default FilterModal



