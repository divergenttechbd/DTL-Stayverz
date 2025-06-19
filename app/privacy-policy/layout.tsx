import type { Metadata } from 'next'
import Container from '~/components/layout/Container'
import Footer from '~/components/layout/Footer'
import ResponsiveNavbar from '~/components/layout/ResponsiveNavbar'

export const metadata: Metadata = {
  title: 'Stayverz',
  description: 'Discover exceptional stays with Stayverz',
}

export default function ContactPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ResponsiveNavbar wrapInContainer={true}/>
      <Container>
        {children}
      </Container>
      <Footer/>
    </>
  )
}
