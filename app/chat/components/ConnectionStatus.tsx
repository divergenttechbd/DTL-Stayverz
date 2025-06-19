import { CellSignalSlash, CellSignalX, CircleNotch } from '@phosphor-icons/react'
import { FC } from 'react'
import { type ConnectionStatus as ConnectionStatusType } from '~/app/chat/types'
import Button from '~/components/layout/Button'

interface ConnectionStatusProps {
  status: ConnectionStatusType
  onRetry: () => void
}

export const ConnectionStatus:FC<ConnectionStatusProps> = ({
  status,
  onRetry
}) => {
  if (status === 'OPEN' || status === 'EXIT') return null

  return (
    <div className='flex flex-col gap-2 items-center max-sm:fixed sm:absolute bottom-0 z-10 w-full py-7 px-4 bg-slate-50 shadow-t-sm'>
      <div className='flex items-center gap-2'>
        {status === 'CONNECTING'  ? 
          <>
            <CircleNotch fill='bold' size={20} className='animate-spin' />
            <p className='text-lg text-[#202020]'>Connecting...</p>
          </>
          : status === 'CLOSED' ? <>
            <CellSignalSlash fill='bold' size={20} />
            <p className='text-lg text-[#202020]'>Connection closed</p>
          </>
            : <>
              <CellSignalX fill='bold' size={20} />
              <p className='text-lg text-[#202020]'>Connection error</p>
            </>
        }
      </div>
      {status === 'ERROR' || status === 'CLOSED' ?
        <div className='flex flex-col items-center gap-2'>
          {status === 'CLOSED' ?
            <Button label='Reconnect' onclick={onRetry} />
            :
            <Button label='Try Again' onclick={onRetry} />
          }
        </div> : null}
    </div>
  )
}
