'use client'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { FC, ReactElement, ReactNode, useCallback, useRef } from 'react'
import { useModal } from '~/components/modal/hooks/useModal'
import { useDetectOutsideClick } from '~/hooks/useDetectOutsideClick'
import { styles } from '~/styles/classes'


type SearchTabMetaItem = {
  id: string
  title: string
  subTitle: string
  borderRight: boolean
  // dropdownInput: () => JSX.Element
 
}

type SearchFormProps = {
  searchInputMeta: SearchTabMetaItem[]
  activeSearchTab: string | number
  setActiveSearchTab: (tab: string | number) => void
  handleSubmit: () => void
  onInputSelect: () => void
  children:  ReactNode
}

const SearchForm: FC<SearchFormProps> = (props) => {
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
    <div ref={searchDropdownRef} className='w-full relative'>
      <div className='bg-gray-100 border rounded-full overflow-hidden'>
        <div className='w-full flex items-center justify-between relative'>
          {searchInputMeta.map((tab, index) =>
            <SearchInput
              {...tab}
              key={tab.id}
              isActive={tab.id ===activeSearchTab ? true : false}
              onClick={(e: any) => {
                // e.stopPropagation()
                (isModalShow &&activeSearchTab === tab.id) ? handleModalClose() : handleModalOpen()
                setActiveSearchTab(tab.id)

              }}
            />)}
          <button
            onClick={handleSubmit} className='w-[45px] h-[45px] bg-[#f66c0e] rounded-full text-white absolute right-2 top-0 bottom-0 my-auto z-10'>
            <div className={`${styles.flexCenter} w-full h-full`}>
              <MagnifyingGlass size={18} />
            </div>
          </button>
        </div>
      </div>
      {isModalShow &&
       <>
         {children}
       </>}
    </div>
  )
}

export default SearchForm


type SearchInputProps = {
  id?: string | number,
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

export const SearchInput: FC<SearchInputProps> = ({ id, title, value, subTitle, borderRight, isActive, className, onClick, onChange, readOnly, render }) => {
  return (
    <div onClick={onClick} className={`${styles.flexCenter} ${className} transition-all duration-100 relative group cursor-pointer hover:shadow-md hover:rounded-full ${isActive ? 'bg-white shadow-md rounded-full hover:bg-white' : 'hover:bg-gray-200'}`}>
      <div className={`relative mx-auto my-[10px] w-full px-7 ${borderRight && !isActive ? 'border-gray-300 border-r' : ''} group-hover:border-transparent group-active:border-transparent`}>
        <label htmlFor={`${id}`} className='text-[12px] text-[#202020] font-[700] w-full block cursor-pointer'>{title}</label>
        <input autoComplete='off' id={`${id}`} name={`${id}`} onChange={onChange} className='cursor-pointer text-[14px] text-[#202020] font-[500] border-0 outline-0 bg-inherit w-[90%]' placeholder={subTitle} value={value} readOnly={readOnly}></input>
        {render?.()}
      </div>
    </div>
  )
}
