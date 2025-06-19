import { styles } from '~/styles/classes'

const RoomDetailsSkeleton = () => {
  return (
    <div className='w-full'>
      <div className='animate-pulse hidden sm:block space-y-10 mt-5'>
        <div className='xl:container px-4 xl:px-0'>
          <div className='space-y-3 w-full'>
            <div className='w-[300px] h-4 bg-slate-300'></div>
            <div className='w-[100px] h-3.5 bg-slate-300'></div>
          </div>
        </div>
        <div className='xl:container px-4 xl:px-0'>
          <div className='block sm:grid grid-cols-2 gap-2 overflow-hidden sm:rounded-xl relative'>
            <div className={`${styles.flexCenter} relative`}>
              <div className='absolute w-full h-full top-0 left-0 bg-slate-300'></div>
              <div
                className='object-cover w-full h-full aspect-[16/9] bg-slate-30'
              ></div>
            </div>
        
            <div className='hidden sm:grid grid-cols-2 gap-2 relative'>
              {Array.from({length:4}).map((el, index) => (
                <div key={index+1} className={`${styles.flexCenter} relative`}>
                  <div className='absolute w-full h-full top-0 left-0 bg-slate-300'></div>
                  <div
                    className='object-cover w-full h-full aspect-[16/9] '
                  >
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='sm:container'>
          <div className='flex gap-10 w-full'>
            <div className='flex-[1]'>
              <div className='flex gap-1 items-start justify-between space-y-1'>
                <div className='space-y-3 w-full'>
                  <div className='w-[300px] h-4 bg-slate-300'></div>
                  <div className='w-[100px] h-3.5 bg-slate-300'></div>
                </div>
                <div className='w-7 h-7 rounded-full bg-slate-300'></div>
              </div>
            </div>
            <div className='flex-[0.5]'>
              <div className='space-y-3 w-full'>
                <div className='w-[70px] h-4 bg-slate-300'></div>
                <div className='w-[200px] h-5 bg-slate-300'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='animate-pulse block sm:hidden space-y-5 '>
        <div className={`${styles.flexCenter} relative`}>
          <div className='absolute w-full h-full top-0 left-0 bg-slate-300'></div>
          <div className='object-cover w-full h-full aspect-[16/9] bg-slate-30'></div>
        </div>
        <div className='border-b pb-5 container'>
          <div className='flex gap-1 items-start justify-between space-y-1'>
            <div className='space-y-3'>
              <div className='w-[150px] h-4 bg-slate-300'></div>
              <div className='w-[70px] h-3.5 bg-slate-300'></div>
            </div>
            <div className='w-7 h-7 rounded-full bg-slate-300'></div>
          </div>
        </div>
        <div className='border-b pb-5 container'>
          <div className='flex gap-1 items-start justify-between space-y-1'>
            <div className='space-y-3 w-full'>
              <div className='w-[150px] h-4 bg-slate-300'></div>
              <div className='w-[70px] h-3.5 bg-slate-300'></div>
            </div>
          </div>
        </div>
        <div className='border-b pb-5 container'>
          <div className='flex gap-1 items-start justify-between space-y-1'>
            <div className='space-y-3 w-full'>
              <div className='w-[150px] h-4 bg-slate-300'></div>
              <div className='w-[70px] h-3.5 bg-slate-300'></div>
            </div>
          </div>
        </div>
        <div className='border-b pb-5 container'>
          <div className='flex gap-1 items-start justify-between space-y-1'>
            <div className='space-y-3 w-full'>
              <div className='w-[150px] h-4 bg-slate-300'></div>
              <div className='w-[70px] h-3.5 bg-slate-300'></div>
            </div>
          </div>
        </div>
        <div className='border-b pb-5 container'>
          <div className='flex gap-1 items-start justify-between space-y-1'>
            <div className='space-y-3 w-full'>
              <div className='w-[150px] h-4 bg-slate-300'></div>
              <div className='w-[70px] h-3.5 bg-slate-300'></div>
            </div>
          </div>
        </div>
        <div className='border-b pb-5 container'>
          <div className='flex gap-1 items-start justify-between space-y-1'>
            <div className='space-y-3 w-full'>
              <div className='w-[150px] h-4 bg-slate-300'></div>
              <div className='w-[70px] h-3.5 bg-slate-300'></div>
            </div>
          </div>
        </div>
        <div className='border-b pb-5 container'>
          <div className='flex gap-1 items-start justify-between space-y-1'>
            <div className='space-y-3 w-full'>
              <div className='w-[150px] h-4 bg-slate-300'></div>
              <div className='w-[70px] h-3.5 bg-slate-300'></div>
            </div>
          </div>
        </div>
        <div className='pb-5 container'>
          <div className='flex gap-1 items-start justify-between space-y-1'>
            <div className='space-y-3 w-full'>
              <div className='w-[150px] h-4 bg-slate-300'></div>
              <div className='w-[70px] h-3.5 bg-slate-300'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDetailsSkeleton
