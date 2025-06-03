import { useState } from 'react'

export const useTabs = ({ initialActiveTab='' }:{initialActiveTab?:string} | undefined={}) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab)

  const handleChange = (tab:string) => {
    setActiveTab(tab)
  }
  return {activeTab, handleChange}
}


