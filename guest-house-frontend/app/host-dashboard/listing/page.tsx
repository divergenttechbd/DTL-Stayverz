'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import Table from '~/components/table/Table'
import { getListings } from '~/queries/client/listing'

import { CaretLeft } from '@phosphor-icons/react/dist/ssr/CaretLeft'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass'
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus'
import {
  CellContext,
  ColumnDef
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import upperFirst from 'lodash/upperFirst'
import Image from 'next/image'
import Link from 'next/link'
import ListingsMobile from '~/app/host-dashboard/listing/components/ListingsMobile'
import useWindowSize from '~/hooks/useWindowSize'
import { styles } from '~/styles/classes'


function Listing() {
  const {isMobileView} = useWindowSize()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({})
  const columns:ColumnDef<any>[] = useMemo(() => [
    {
      accessorFn: row => ({title: row.title, cover: row.cover_photo}),
      id: 'title',
      cell: (title:CellContext<any, any>) => 
        <div className='flex flex-row gap-2 items-center w-[max-content] sm:w-auto'>
          {title.getValue().cover && <Image className='rounded-md' src={title.getValue().cover} width={64} height={50} alt=''/>}
          {title?.getValue()?.title}
        </div>,
      header: 'Title',
    },
    {
      accessorKey: 'status',
      // cell: info => info.getValue(),
      header: 'Status',
      cell: (value: any) => upperFirst(value.getValue()?.split?.('_')?.join(' ')),
    },
    {
      accessorKey: 'bedroom_count',
      header: 'Bedrooms',
    },
    {
      accessorKey: 'bed_count',
      header: 'Beds',
    },
    {
      header: 'Baths',
      accessorKey: 'bathroom_count',
    },
    {
      header: 'Location',
      accessorKey: 'address',
    },
    {
      header: 'Last Modified',
      accessorKey: 'updated_at',
      cell: (value:CellContext<any, any>) => dayjs(value.getValue()).format('YYYY-MM-DD, h:mm A'),
    },
  ], [])

  const router = useRouter()
  const createListing = useCallback(async () => {
    router.push(`/create-listing/become-a-host/overview`)
  }, [router])

  const handleRowClick = useCallback((row: any) => () => {
    router.push(`/host-dashboard/listing/${row.unique_id}/edit`)
  }, [router])

  return (
    <div className='sm:w-[95%] m-auto'>
      <div className='w-full fixed h-auto py-3 bg-white sm:static'>
        {/* TITLE */}
        <div className='flex flex-row justify-between items-center sm:mt-5 px-5 sm:px-0 mx-0 mb-5 border-b sm:border-0'>
          {isMobileView ? 
            <Link href={'/host-dashboard'}>
              <CaretLeft size={20} fill='#222222'/>
            </Link> :
            <h2 className='text-xl sm:text-2xl my-5 font-semibold'>My Listings</h2>} 
          
          {isMobileView ?
            <button onClick={createListing} className='border-none outline-none py-3'>
              <Plus size={20} fill='#000000' className='font-bold'/> 
            </button> 
            :
            <button onClick={createListing} 
              className='py-2.5 sm:h-12 px-5 sm:mr-2 mb-2 text-xs sm:text-sm font-medium text-[#202020] hover:border-black hover:outline-2 rounded-full border border-gray-200'>
              + Create Listing
            </button>}
          
        </div>
        {/* SEARCH */}
        <div className='relative sm:w-[350px] flex mx-5 sm:mx-0 border h-10 sm:h-[2.5rem] rounded-full shadow-sm overflow-hidden px-3'>
          <input 
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            type='text' 
            placeholder='Search Listing'
            className='w-full h-full p-0 border-none outline-none text-[12px] bg-transparent font-medium'
          />
          <button className={`${styles.flexCenter}`} onClick={() => setFilters({search})}>
            <MagnifyingGlass size={20} color='#222222' />
          </button>
        </div>
      </div>

      <div className='sm:pb-10 pt-[130px] sm:pt-3'>
        <div className='block sm:hidden px-5 pt-5'>
          <h2 className='text-xl sm:text-2xl mb-5 font-bold'>My Listings</h2>
        </div>
        {isMobileView ? 
          <ListingsMobile fetchData={getListings} onRowClick={handleRowClick} extraFilters={filters} />
          : 
          <Table columns={columns} fetchData={getListings} extraFilters={filters} onRowClick={handleRowClick}/>}
      </div>
    </div>
  )
}

export default Listing
