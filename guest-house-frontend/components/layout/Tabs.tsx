import React, { useCallback } from 'react'
//make this generic and move to the generic component folder 
interface Tab {
  label: string
  key: string
  onClick: (key:string) => void
}

interface TabsProps {
  tabs: Tab[]
  classNames?: string
  activeTab: string
  onChange: (key:string) => void
  tabClassName?:string
  activeTabClassName?: string
}

const Tabs: React.FC<TabsProps> = ({ tabs,classNames,activeTab,onChange,tabClassName,activeTabClassName }) => {
  const handleClick = useCallback((tab:Tab) => () =>  {
    onChange(tab.key)
    tab.onClick(tab.key)
  },[onChange])
  
  return (
    <div>
      <div className={`flex border-b ${classNames}`}>
        {tabs.map((tab, index) => (
          <div 
            key={index}
            onClick={handleClick(tab)}
            className={`py-2 px-4 cursor-pointer ${tabClassName}${activeTab === tab.key ? ` border-b-2 border-[black] ${activeTabClassName}` : ''}`}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tabs
