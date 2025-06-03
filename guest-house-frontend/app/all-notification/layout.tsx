import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stayverz',
  description: 'Discover exceptional stays with Stayverz',
}

export default function ContactPageLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      {children}
    </>
  )
}
