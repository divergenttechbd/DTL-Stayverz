import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import 'rc-slider/assets/index.css'
import { Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { AuthView } from '~/app/auth/components/AuthView'
import { Providers } from '~/contexts/Providers'
import Analytics from '~/lib/utils/Analytics'
import '~/styles/index.css'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
})

export const metadata: Metadata = {
  title: 'Stayverz',
  description: 'Frontend for Stayverz',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={poppins.className}>
      <head>
      </head>
      <body>
        <Suspense>
          <Analytics />
        </Suspense>
        <Providers>
          {children}
          <div id='modal-container' />
          <div id='side-menu-container' />
          <AuthView />
          <ToastContainer
            position='bottom-right'
            autoClose={3000}
            hideProgressBar={true}
            closeButton={true}
            progressClassName='custom-progress-bar'
            bodyClassName='custom-toast-body'
            pauseOnHover={false}
            pauseOnFocusLoss={false}
          />
        </Providers>
      </body>
    </html>
  )
}
