import { FC, MouseEventHandler } from 'react'

type ItemProps = {
  title: string;
  sub_title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const EditableItem:FC<ItemProps> = ({title, sub_title, onClick}) => {
  return (
    <div className='flex flex-row justify-between items-center gap-4 mx-5 sm:mx-0'>
      <div className=''>
        <p className='text-md font-medium text-[#202020]'>{title}</p>
        <p className='text-sm mt-1 text-gray-500'>{sub_title}</p>
      </div>
      <button className='underline' onClick={onClick}>Edit</button>
    </div>
  )
}

export default EditableItem
