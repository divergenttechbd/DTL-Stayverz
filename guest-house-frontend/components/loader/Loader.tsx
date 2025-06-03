interface LoaderProps {
  className?: string
}

const Loader = ({className=''}: LoaderProps) => {

  return (
    <div className={`flex items-center justify-center space-x-2 animate-pulse h-full ${className}`}>
      <div className='w-2 h-2 bg-black rounded-full'></div>
      <div className='w-2 h-2 bg-black rounded-full'></div>
      <div className='w-2 h-2 bg-black rounded-full'></div>
    </div>
  )
}

export default Loader
