import { Metadata } from 'next'
import ResponsiveNavbar from '~/components/layout/ResponsiveNavbar'

export const metadata: Metadata = {
  title: 'Stayverz | Room Details',
  description: 'Frontend for Stayverz',
}

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='w-full'>
      <div className='hidden md:block'>
        <ResponsiveNavbar showMobileNav={false} />
      </div>
      <div className='md:pt-navbar'>
        {children}
      </div>
      {/* <Container>
      </Container> */}
    </main>
  )
}
