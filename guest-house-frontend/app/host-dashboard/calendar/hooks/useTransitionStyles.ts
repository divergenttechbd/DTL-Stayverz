import { CSSProperties } from 'react'

const useTransitionStyles = () => {
  return {
    unmounted: {display: 'none'},
    entering: { opacity: 1, transform: 'translateX(150%)' },
    entered:  { opacity: 1, transform: 'translateX(0%)' },
    exiting:  { opacity: 1, position: 'absolute', transform: 'translateX(150%)' },
    exited:  { opacity: 1, display: 'none', transform: 'translateX(190%)' },
  } as Record<string, CSSProperties | undefined>
}

export default useTransitionStyles

