'use client'
import { X } from '@phosphor-icons/react'
import { ReactNode, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useDetectKeyPress } from '~/hooks/useDetectKeyPress'
import { useDetectOutsideClick } from '~/hooks/useDetectOutsideClick'

type ModalProps = {
  show: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  modalContainerclassName?: string;
  titleContainerClassName?: string;
  titleClassName?: string;
  crossBtnClassName?: string;
  bodyContainerClassName?: string;
  header?: ReactNode;
  subHeader?: ReactNode;
  headerContainerClassName?: string;
  closeOnOutsideClick?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  show,
  onClose,
  title,
  children,
  modalContainerclassName,
  titleContainerClassName,
  titleClassName,
  crossBtnClassName,
  bodyContainerClassName,
  header,
  subHeader,
  headerContainerClassName,
  closeOnOutsideClick = false,
}) => {
  const modalContainerRef = useRef<HTMLDivElement>(null)
  useDetectOutsideClick(modalContainerRef, onClose, closeOnOutsideClick)
  useDetectKeyPress(undefined, onClose)

  if (!show) return null

  return createPortal(
    (<div className='fixed inset-0 flex items-center justify-center bg-slate-900/50 z-[999]'>
      <div
        ref={modalContainerRef}
        className={`bg-white flex flex-col shadow-lg z-10 ${modalContainerclassName || ''}`}>

        {/* Modal Head */}
        <div
          className={`text-black flex relative ${titleContainerClassName || ''}`}>
          <button
            onClick={onClose}
            className={`text-2xl p-1 rounded-2xl hover:bg-gray-100 ${crossBtnClassName || ''}`}>
            <X size={18} />
          </button>
          {title && <p className={`text-center text-base font-medium ${titleClassName}`}>{title}</p>}
        </div>

        {/* Modal Body */}
        <div className={`${bodyContainerClassName || ''}`}>
          {
            (header || subHeader) &&
            <div className={`px-6 py-5 ${headerContainerClassName || ''}`}>
              {header && <>{header}</>}
              {subHeader && <>{subHeader}</>}
            </div>
          }
          {children}
        </div>
      </div>
    </div>), document.getElementById('modal-container')!
  )
}

export default Modal
