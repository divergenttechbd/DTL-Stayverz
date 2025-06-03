'use client'

import { List } from '@phosphor-icons/react'
import { FC } from 'react'
import { SideMenus } from '~/app/chat/components/conversationList/SideMenus'
import { SidePanel } from '~/components/sidePanel/SidePanel'
import { useSidePanel } from '~/components/sidePanel/hooks/useSidePanel'
interface IHeaderProps {
  title: string
  allMessageCount: number | null
}

export const Header: FC<IHeaderProps> = ({
  title, allMessageCount
}) => {
  const { show: showSideMenu, handleToggle: handleToggleSideMenu } = useSidePanel()

  return (
    <div className='py-4 md:py-6 px-6 md:px-8 flex items-center gap-4 border-b'>
      <SidePanel show={showSideMenu} onClose={handleToggleSideMenu} heightClassName='h-full sm:h-content'>
        <SideMenus onClick={handleToggleSideMenu} allMessageCount={allMessageCount}/>
      </SidePanel>
      <List size={22} weight='bold' onClick={handleToggleSideMenu} className='cursor-pointer' />
      <h4 className='font-medium text-xl'>{title}</h4>
    </div>
  )
}
