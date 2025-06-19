import { Slide, ToastContent, ToastOptions, toast } from 'react-toastify'

type CustomToastType = 'success' | 'error' | 'info' | 'warning' | 'default';
type CustomToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

const customToast = (
  type: CustomToastType,
  message: ToastContent,
  position: CustomToastPosition = 'bottom-center',
  className?: string
) => {
  const toastConfig: ToastOptions = {
    position,
    transition: Slide,
    closeButton: false,
    pauseOnHover: false,
    hideProgressBar: true,
    className: `text-base text-darkGray ${className}` 
  }

  switch (type) {
  case 'success':
    toast.success(message, toastConfig)
    break
  case 'error':
    toast.error(message, toastConfig)
    break
  case 'info':
    toast.info(message, toastConfig)
    break
  case 'warning':
    toast.warning(message, toastConfig)
    break
  case 'default':
    toast(message, toastConfig)
    break
  }
}

export default customToast
