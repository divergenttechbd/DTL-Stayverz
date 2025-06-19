import { CellContext, ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { useMemo } from 'react'

interface IHookProps {
  eventType?: string;
  handleOpenModal?: (invoiceNo: any, modalType: string) => void;
}

export const useReservationTableMeta = ({ eventType,handleOpenModal }:IHookProps) => {
  const columns: ColumnDef<any>[] = useMemo(() => [
    {
      header: 'Guests',
      accessorFn: row => ({full_name: row.guest.full_name, adult_count: row.adult_count}),
      cell: (cellInfo: CellContext<any, any>) => {
        // console.log(cellInfo.getValue())
        return (
          <div className='flex flex-col'>
            <a className='underline font-semibold'>{cellInfo.getValue().full_name}</a>
            <p className='text-grayText'>{cellInfo.getValue().adult_count} adults</p>
          </div>
        )
      }    
    },
    {
      header: 'Check-in',
      accessorKey: 'check_in',
      cell: (cellInfo:CellContext<any,any>) => {
        return(
          <div className='flex flex-col'>
            <p>{dayjs(cellInfo.getValue()).format('MMM D, YYYY')}</p>
          </div>
        )
      },
    },
    {
      header: 'Checkout',
      accessorKey: 'check_out',
      cell: (cellInfo:CellContext<any,any>) => {
        return(
          <div className='flex flex-col'>
            <p>{dayjs(cellInfo.getValue()).format('MMM D, YYYY')}</p>
          </div>
        )
      },
    },
    {
      header: 'Booked',
      accessorKey: 'created_at',
      cell: (cellInfo:CellContext<any,any>) => {
        return(
          <div className='flex flex-col'>
            <p>{dayjs(cellInfo.getValue()).format('MMM D, YYYY')}</p>
            <p className='text-grayText'>{dayjs(cellInfo.getValue()).format('h:mm A')}</p>
          </div>
        )
      },
    },
    {
      header: 'Listing',
      accessorFn: row => row.listing.title
    },
    {
      header: 'Total Payout',
      accessorFn: row => ({ pay_out: row.host_pay_out }),
      cell: (cellInfo: CellContext<any, any>) => {
        return(
          <p>৳{cellInfo.getValue().pay_out}</p>
        )
      }
    },
    {
      header: 'Action',
      cell: (cellInfo: CellContext<any, any>) => {
        return (
          <div>

            <button 
              className='py-2 px-4 border border-[#f66c0e] text-[#f66c0e] rounded-xl' 
              onClick={() => {
                handleOpenModal && handleOpenModal(cellInfo.row.original.invoice_no, 'details')
              }}
            >
            Details
            </button>
            {eventType === 'completed' && !cellInfo.row.original.host_review_done && <button 
              className='ml-1 py-2 px-4 border border-[#f66c0e] text-[#f66c0e] rounded-xl' 
              onClick={() => {
                handleOpenModal && handleOpenModal(cellInfo.row.original.invoice_no, 'review')
              }}
            >
            Review
            </button>}
          </div>
        )
      }
    }, 
  ], [handleOpenModal, eventType])

  return columns
}
