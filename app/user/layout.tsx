import { Metadata } from 'next'
import Container from '~/components/layout/Container'
import ResponsiveNavbar from '~/components/layout/ResponsiveNavbar'

export const metadata: Metadata = {
  title: 'Stayverz | User Profile',
  description: 'Frontend for Stayverz',
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <ResponsiveNavbar/>
      <Container>
        {children}
      </Container>
    </main>
  )
}
