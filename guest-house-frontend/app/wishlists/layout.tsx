import { Metadata } from 'next'
import ResponsiveNavbar from '~/components/layout/ResponsiveNavbar'

export const metadata: Metadata = {
  title: 'Stayverz | Wishlists',
  description: 'Frontend for Stayverz',
}

export default function WishlistsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='w-full'>
      <ResponsiveNavbar wrapInContainer={false} />
      <div className='pt-navbar'>
        {children}
      </div>
    </main>
  )
}
