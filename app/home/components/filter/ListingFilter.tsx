'use client'
import { FadersHorizontal } from '@phosphor-icons/react/dist/ssr/FadersHorizontal'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import FilterModal from '~/app/home/components/FilterModal'
import CategoryFilter from '~/app/home/components/filter/CategoryFilter'
import LocationWiseSearchMobile from '~/app/home/components/search/locationWiseSearchMobile/LocationWiseSearchMobile'
import useFilterInitialValues from '~/app/home/hooks/useFilterInitialValues'
import { useModal } from '~/components/modal/hooks/useModal'
import { getListingsConfigurations } from '~/queries/client/room'
import { styles } from '~/styles/classes'

const ListingFilter = () => {
  const { initialValues } = useFilterInitialValues()
  const [state, handleModalOpen, handleModalClose] = useModal()
  const { data: listingConfigurationData, isFetching, isRefetching } = useQuery({
    queryKey: ['listing-configuration'],
    queryFn: () => getListingsConfigurations(),
  })

  const filterCount = useMemo(() => {
    let count = 0
    const obj: any = { ...initialValues }
    Object.keys(initialValues).forEach((key) => {
      const value = obj[key]
      if (Array.isArray(value)) {
        if (value.filter((el: any) => !!el).length > 0) {
          count++
        }
      } else if (value !== null && key !== 'price_min') {
        count++
      }
    })
    return count
  }, [initialValues])


  return (
    <div className='mx-auto px-5 sm:px-24 shadow-md sm:shadow-none'>
      <div className='flex flex-col-reverse sm:flex-row mx-auto relative gap-5' >

        {/* ============= CATEGORY WISE LISTING FILTER ============= */}
        <CategoryFilter data={listingConfigurationData?.data} isFetching={isFetching} isRefetching={isRefetching} />

        {/* ============= LISTING AND SEARCH FILTER ============= */}
        <div className='flex justify-between items-center gap-2'>

          {/* ============= LISTING SEARCH MOBILE ============= */}
          <div className='flex-1 block sm:hidden'>
            <LocationWiseSearchMobile />
          </div>

          {/* ============= LISTING FILTER ============= */}
          <div>
            <FilterModal data={listingConfigurationData?.data} state={state} handleModalClose={handleModalClose} />
            <button onClick={handleModalOpen} className={`relative h-12 w-12 text-[#202020] font-bold text-xs sm:text-sm sm:h-12 sm:w-24 bg-white justify-center right-0 mr-2  rounded-full sm:rounded-xl flex gap-2 items-center hover:bg-slate-100
            ${filterCount > 0 ? 'border-black border-2' : 'border border-gray-200'} `}>
              <FadersHorizontal size={20} color='#222222' /><span className='hidden sm:block'>Filters</span>
              {filterCount > 0 ?
                <div className={`absolute bg-[#222222] w-5 h-5 rounded-full ${styles.flexCenter} -top-1 -right-1`}>
                  <p className='text-white font-bold text-[10px]'>{filterCount}</p>
                </div>
                :
                null}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

}

export default ListingFilter






