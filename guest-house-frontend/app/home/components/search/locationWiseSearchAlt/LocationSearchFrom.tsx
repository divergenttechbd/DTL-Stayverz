import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass'
import Image, { StaticImageData } from 'next/image'
import { FC, ReactElement, ReactNode, useCallback, useRef } from 'react'
// import { MagnifyingGlass } from '@phosphor-icons/react'
// import { styles } from '~/styles/classes'
import { useModal } from '~/components/modal/hooks/useModal'
import { useDetectOutsideClick } from '~/hooks/useDetectOutsideClick'

type LocationSearchInputMeta = {
  id: string
  // imgUrl: string,
  imgUrl: StaticImageData,
  title: string
  subTitle: string
  borderRight: boolean
  // dropdownInput: () => JSX.Element
}


type LocationSearchFormProps = {
  searchInputMeta: LocationSearchInputMeta[]
  activeSearchTab: string | number
  setActiveSearchTab: (tab: string | number) => void
  handleSubmit: () => void
  onInputSelect: () => void
  children:  ReactNode
}

const LocationSearchFrom : FC<LocationSearchFormProps> = (props) => {
  const {searchInputMeta,activeSearchTab,setActiveSearchTab,onInputSelect, children} = props
  const searchDropdownRef = useRef(null)
  const [isModalShow, handleModalOpen, handleModalClose] = useModal()
  useDetectOutsideClick(searchDropdownRef, handleModalClose, true)

  const handleSubmit = useCallback(() => {
    props.handleSubmit()
    handleModalClose()
    onInputSelect()
  }, [ handleModalClose, onInputSelect, props])

  return (
    <div ref={searchDropdownRef} className='stayverz-room-search-desktop hidden md:block mt-5 md:mt-8 w-full relative xl:max-w-[90%] mx-auto'>
      {/* ================== FORM CONTAINER ================== */}
      <div className='w-full bg-[#ffffff] rounded-[18.75px] p-4 flex justify-between items-center gap-3 lg:gap-5 overflow-hidden'  style={{boxShadow: '-15px 30px 67.5px -3.75px #D3D6DA7D'}}>
        {/* ================== INPUT CONTAINER ================== */}
        <ul className='flex-1 flex justify-start items-center gap-3 lg:gap-5'>
          {searchInputMeta.map((tab, index) =>
            <LocationSearchInput
              {...tab}
              key={tab.id}
              isActive={tab.id ===activeSearchTab ? true : false}
              onClick={(e: any) => {
              // e.stopPropagation()
                (isModalShow &&activeSearchTab === tab.id) ? handleModalClose() : handleModalOpen()
                setActiveSearchTab(tab.id)

              }}
            />)}
        </ul>

        {/* ================== SUBMIT CONTAINER ================== */}
        <button onClick={handleSubmit} className='flex justify-center items-center gap-[5px] text-[#ffffff]  text-xs lg:text-sm font-medium leading-5 text-left p-[15px] rounded-[12px] bg-[#F15927]'>
          <MagnifyingGlass size={14} />
          <span>Search</span>
        </button>
      </div>

      {/* ================== DROPDOWN ================== */}
      {isModalShow 
    &&
      <>
        {children}
      </>}
    
    </div>)
}

export default LocationSearchFrom


type LocationSearchInputProps = {
  id?: string | number,
  imgUrl: StaticImageData,
  isActive?: boolean,
  title: string,
  subTitle: string,
  value?: number | string,
  readOnly?: boolean,
  borderRight?: boolean,
  className?: string,
  onClick: (e: any) => void
  onChange?: (event: any) => void
  dropdown?: () => ReactElement
  render?: () => ReactElement
}

export const LocationSearchInput: FC<LocationSearchInputProps> = ({ id,imgUrl, title, value, subTitle, borderRight, isActive, className, onClick, onChange, readOnly, render }) => {

  return (
    <li onClick={onClick} className={`${className} overflow-hidden flex justify-between items-center cursor-pointer 
    ${className || ''}  
    ${borderRight ? 'border-r-[1.75px] border-[#E4E4E4] pr-[10px] lg:pr-[18px]' : 'lg:pr-[30px]'}'}`}>
      <div className='flex justify-start items-center gap-[10px]'>
        <div 
          className='w-[30px] h-[30px] flex justify-center items-center rounded-[6px]' 
          style={{boxShadow: '0px 0.75px 1.5px 0px #9799C93D'}}
        >
          <Image src={imgUrl} width={14} height={14} className='w-auto h-[14px]' alt=''/> 
        </div>
        <div className='flex flex-col gap-[5px]'>
          <p className='text-xs font-medium leading-3 text-[#9C9C9C] uppercase'>{title}</p>
          <input 
            className={`border-none outline-none ${id === 'destination'? 'md:max-w-[110px]': 'md:max-w-[100px]'}  lg:max-w-[150px] text-xs lg:text-sm text-[#2D3845] font-semibold leading-4 placeholder:text-[#616161] placeholder:font-medium ${!value ? 'text-[#616161] font-medium cursor-pointer' : ''} `}
            autoComplete='off' id={`${id}`} name={`${id}`} onChange={onChange} placeholder={subTitle} value={value} readOnly={readOnly}
          />
        </div>
      </div>
      {render?.()}


      {/* OLD */}
      <div className={`!hidden relative mx-auto my-[10px] w-full px-7 ${borderRight && !isActive ? 'border-gray-300 border-r' : ''} group-hover:border-transparent group-active:border-transparent`}>
        <label htmlFor={`${id}`} className='text-[12px] text-[#222222] font-[700] w-full block cursor-pointer'>{title}</label>
        <input  autoComplete='off' id={`${id}`} name={`${id}`} onChange={onChange} className='cursor-pointer text-[14px] text-[#222222] font-[500] border-0 outline-0 bg-inherit w-[90%]' placeholder={subTitle} value={value} readOnly={readOnly}></input>
        {render?.()}
      </div>
    </li>
  )
}


