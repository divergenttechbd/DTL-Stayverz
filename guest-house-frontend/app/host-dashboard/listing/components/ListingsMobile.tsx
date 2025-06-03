import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { FC ,useMemo} from 'react'
import { Query } from '~/queries/types'
import galleryImg from '~/assets/images/gallery.jpg'
import Loader from '~/components/loader/Loader'


type ListingsMobileProps = {
  fetchData: Query
  onRowClick: Function
  fetchDataPayload?: Parameters<Query>[0]
  extraFilters: Record<any, any>

}


const ListingsMobile: FC<ListingsMobileProps>  = ({fetchData, onRowClick, extraFilters, fetchDataPayload}) => {

  const fetchDataOptions = useMemo(() =>({
    page:  1,
    page_size: 0,
  }),[])

  const { data:dataQuery, isLoading } = useQuery({ 
    queryKey: ['data', fetchDataOptions, fetchDataPayload, extraFilters, fetchDataPayload?.params], 
    queryFn: () => fetchData({ ...fetchDataPayload, params: {...fetchDataPayload?.params,...fetchDataOptions, ...extraFilters}, })
  })

  return (
    <div className='h-full overflow-y-auto pb-10'>
      {isLoading ? 
        <div className='h-[60vh]'>
          <Loader />
        </div>:  
        <div className='space-y-7'>
          {dataQuery?.data?.map((item:any, index:number) => (
            <div key={index} onClick={onRowClick(item)} className='mx-3  shadow-md rounded-md cursor-pointer'>
              <div className='w-full h-full px-3 py-3 flex justify-start items-center gap-3'>
                <div className={`flex justify-start items-center max-w-[70px] min-w-[70px]`}>
                  <Image 
                    className='rounded-md aspect-[16/11] object-cover'
                    src={item?.cover_photo || galleryImg} 
                    width={100} height={100} alt=''/>
                </div>
                <p className='font-bold text-[#222222] text-[14px] ellipsis-one-line'>
                  {item?.title}
                </p>
              </div>
            </div>
          ) )}
        </div>
      }
     
    </div>
  )
}

export default ListingsMobile
