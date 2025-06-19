import { useQuery } from '@tanstack/react-query'
import { FC, useCallback, useMemo, useState } from 'react'

import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import ReactPaginate from 'react-paginate'
import Loader from '~/components/loader/Loader'
import { Query } from '~/queries/types'

type TableProps = {
  columns: ColumnDef<any>[]
  fetchData: Query
  onRowClick: Function
  extraFilters?: Record<any, any>
  fetchDataPayload?: Parameters<Query>[0]
  clickableRow?: Boolean
}

const Table: FC<TableProps> = ({columns, fetchData, extraFilters, onRowClick, fetchDataPayload, clickableRow=true }) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const fetchDataOptions = useMemo(() =>({
    page: pageIndex + 1,
    page_size: pageSize,
  }),[pageIndex,pageSize])

  const { data:dataQuery, isLoading } = useQuery({ 
    queryKey: ['data', fetchDataOptions, fetchDataPayload, fetchDataPayload?.params, extraFilters], 
    queryFn: () => fetchData({ ...fetchDataPayload, params: {...fetchDataPayload?.params,...fetchDataOptions, ...extraFilters}, })
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const table = useReactTable({
    data: dataQuery?.data ?? [],
    columns,
    pageCount: Math.ceil((dataQuery?.meta?.total || 0) / (dataQuery?.data?.meta?.page_size || 10)) ?? 0,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  const handlePageChange = useCallback(({selected}: {selected: number}) => {
    table.setPageIndex(selected)
  }, [table])

  return (
    <div className='p-2'>
      <div className='h-2' />
      {isLoading ? 
        <div className='h-[60vh]'>
          <Loader />
        </div> : <table className='w-full border-collapse'>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className='border-b-2 uppercase font-semibold text-xs'>
                {headerGroup.headers.map(header => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className='p-3 sm:p-5 text-left'
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => {
              return (
                <tr 
                  key={row.id} 
                  className={`border-b text-xs sm:text-sm ${clickableRow ? 'hover:bg-gray-100 hover:cursor-pointer':''}`}
                  onClick={onRowClick(row.original)}
                >
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id} className='p-3 sm:p-5 text-left'>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>}

      <div className='h-2' />
      
      <div className='flex flex-row justify-center mt-2 sm:mt-4 mb-5 sm:mb-auto'>
        <ReactPaginate
          breakLabel='...'
          nextLabel={<ArrowRight/>}
          onPageChange={handlePageChange}
          pageRangeDisplayed={5}
          pageCount={table.getPageCount()}
          previousLabel={<ArrowLeft/>}
          renderOnZeroPageCount={null}
          className='flex flex-row gap-2 items-center'
          activeLinkClassName='rounded bg-[#f66c0e] border-0 py-1 sm:py-2.5 px-3 sm:px-5 text-xs sm:text-sm text-neutral-50 select-none'
          pageLinkClassName='py-1 sm:py-2.5 px-3 sm:px-5 text-xs sm:text-sm font-medium text-[#202020] hover:cursor-pointer rounded-full border border-gray-200 select-none'
        />
      </div>
    </div>
  )
}

export default Table
