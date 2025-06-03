import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stayverz | Room Details',
  description: 'Frontend for Stayverz',
}

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='w-full'>
      {children}
    </main>
  )
}
