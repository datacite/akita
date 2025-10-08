import React, { PropsWithChildren, Suspense } from "react";
import { Metadata } from 'next'
import PlausibleProvider from 'next-plausible'
import { Source_Sans_3 } from 'next/font/google';
import * as Sentry from '@sentry/node'

import 'src/styles.css'

// properly handle fontawesome icons
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS

import Header from "src/components/Header/Header";
import Consent from "./Consent";
import Footer from "src/components/Footer/Footer";
import Providers from "./Providers";
import { getAuthToken } from "src/utils/apolloClient/apolloClient";
import ConsentedGoogleTagManager from "src/components/ConsentedGoogleTagManager/ConsentedGoogleTagManager";
import Script from "next/script";
import { SENTRY_DSN, IS_PROD } from "src/data/constants";
import DiscoverWorksAlert from "src/components/DiscoverWorksAlert/DiscoverWorksAlert";


config.autoAddCss = false

if (typeof SENTRY_DSN !== 'undefined') {
  Sentry.init({
    enabled: IS_PROD,
    dsn: SENTRY_DSN
  })
}

export const metadata: Metadata = {
  title: 'DataCite Commons',

}

const sourceSans3 = Source_Sans_3({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={sourceSans3.className}>
      <head>
        <Suspense>
          <PlausibleProvider domain="commons.datacite.org" />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/jpswalsh/academicons@1/css/academicons.min.css"
          />
        </Suspense>
      </head>
      <body className={sourceSans3.className}>
        <Providers authToken={getAuthToken()} >
          <Header />
          <DiscoverWorksAlert />
          <div className="container-fluid flex-grow-1">{children}</div>
          <Consent />
          <Footer />
        </Providers>
      </body>
      <ConsentedGoogleTagManager />
      <Script id="feedback-button">
        {`(function(){window.onUsersnapCXLoad=function(e){e.init()};var e=document.createElement("script");e.defer=1,e.src="https://widget.usersnap.com/global/load/b4393e90-ec13-4338-b299-7b6f122b7de3?onload=onUsersnapCXLoad",document.getElementsByTagName("head")[0].appendChild(e)})();`}
      </Script>
    </html>
  )
}
