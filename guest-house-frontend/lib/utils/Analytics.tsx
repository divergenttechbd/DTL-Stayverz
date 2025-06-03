'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useEffect } from 'react'
import { pageview } from '~/lib/utils/gtm'

export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      pageview(pathname)
    }
  }, [pathname, searchParams])

  // if (process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production') {
  //   return null
  // }

  return (
    <>
      {/* <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height='0'
          width='0'
          style={{ display: 'none', visibility: 'hidden' }}
        /> */}
      {/* GTM NoScript for body */}
      <iframe
        src='https://capi.stayverz.com/ns.html?id=GTM-WT6MKSJH'
        height='0'
        width='0'
        style={{ display: 'none', visibility: 'hidden' }}
      />
      <Script
        id='gtm-script'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s);j.async=true;
              j.src="https://capi.stayverz.com/anaohpsmb.js?"+i;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','6u8217wo=aWQ9R1RNLVdUNk1LU0pI&page=2');
          `,
        }}
      />
      <Script
        id='hs-script-loader'
        strategy='afterInteractive'
        src='//js-eu1.hs-scripts.com/144131199.js'
        async
        defer
      />
    </>
  )
}
