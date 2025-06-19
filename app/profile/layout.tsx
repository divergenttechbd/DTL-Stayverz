import type { Metadata } from 'next'
import Container from '~/components/layout/Container'
import ResponsiveHostNavbar from '~/components/layout/ResponsiveHostNavbar'

export const metadata: Metadata = {
  title: 'Stayverz',
  description: 'Frontend for Stayverz',
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ResponsiveHostNavbar />
      <Container >
        {children}
      </Container>
    </>
  )
}
