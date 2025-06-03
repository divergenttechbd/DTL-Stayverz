import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stayverz',
  description: 'Frontend for Stayverz',
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full'>
      {children}
    </div>
  )
}
