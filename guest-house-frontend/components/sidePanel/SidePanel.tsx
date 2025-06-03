import { FC, ReactNode, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from '@phosphor-icons/react'
import { useDetectOutsideClick } from '~/hooks/useDetectOutsideClick'
import { CSSTransition } from 'react-transition-group'

interface SidePanelProps {
  heightClassName?: string
  show?: boolean
  onClose: () => void
  children?: ReactNode
}

export const SidePanel: FC<SidePanelProps> = ({
  heightClassName='h-full',
  show,
  onClose,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  useDetectOutsideClick(containerRef, onClose, true)

  return createPortal(
    <>
      <CSSTransition in={show} classNames='transition-fade' timeout={300} mountOnEnter unmountOnExit>
        <div className={`max-sm:h-screen-dynamic fixed w-full bottom-0 flex items-center justify-center bg-slate-900/50 ${heightClassName}`} />
      </CSSTransition>
      <CSSTransition in={show} classNames='transition-slide' timeout={300} mountOnEnter unmountOnExit>
        <div ref={containerRef} className={`max-sm:h-screen-dynamic max-sm:fixed absolute left-0 bottom-0 w-full md:w-[50%] lg:w-[25%] bg-white ${heightClassName}`}>
          <button className='absolute right-0 p-3 m-1 block md:hidden z-10 border rounded' onClick={onClose}>
            <X size={18} weight='bold' />
          </button>
          {children}
        </div>
      </CSSTransition>
    </>,
    document.getElementById('side-menu-container')!
  )
}
