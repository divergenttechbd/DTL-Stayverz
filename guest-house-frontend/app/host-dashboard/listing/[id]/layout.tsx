import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stayverz',
  description: 'Frontend for Stayverz',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
