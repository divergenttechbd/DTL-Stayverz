import { Metadata } from 'next'
import { MessageNavbar } from '~/app/messages/components/MessageNavbar'

export const metadata: Metadata = {
  title: 'Stayverz | Messages',
  description: 'Frontend for Stayverz',
}

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='w-full'>
      <MessageNavbar showDesktopNavInMobileView={false}/>
      <div className='sm:pt-navbar'>
        {children}
      </div>
    </main>
  )
}
