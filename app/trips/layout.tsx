import { Metadata } from 'next'
import ResponsiveNavbar from '~/components/layout/ResponsiveNavbar'

export const metadata: Metadata = {
  title: 'Stayverz | My Trips',
  description: 'Frontend for Stayverz',
}

export default function TripsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='w-full'>
      <ResponsiveNavbar />
      <div className='pt-navbar'>
        {children}
      </div>
    </main>
  )
}
