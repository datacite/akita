import React, { PropsWithChildren, Suspense } from "react";
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import PlausibleProvider from 'next-plausible'
import { Source_Sans_3 } from 'next/font/google';
import * as Sentry from '@sentry/node'

import '../styles.css'

// properly handle fontawesome icons
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS

import Header from "./Header";
import Consent from "./Consent";
import Footer from "./Footer";
import Providers from "./Providers";


config.autoAddCss = false

if (typeof process.env.SENTRY_DSN !== 'undefined') {
  Sentry.init({
    enabled: process.env.NODE_ENV === 'production',
    dsn: process.env.SENTRY_DSN
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
  const data = GetData()

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
        <Providers default_features={data.DEFAULT_FEATURES} apolloUrl={data.apolloUrl} authToken={data.authToken} >
          <Header profilesUrl={data.profilesUrl} orcidUrl={data.orcidUrl} />
          <div className="container-fluid">{children}</div>
          <Consent domain={data.domain} />
          <Footer />
        </Providers>
      </body>
    </html>
  )
}


function GetData() {
  // Construct feature flags based on query param, we have to wrap into array as
  // the query string can parse into string || string[]
  // Use like ?features=feature1&?features=feature2
  const DEFAULT_FEATURES = process.env.NEXT_PUBLIC_FEATURE_FLAGS
    ? process.env.NEXT_PUBLIC_FEATURE_FLAGS.split(",")
    : []

  const apolloUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.stage.datacite.org'

  const authToken = cookies().get('_datacite')?.value


  const profilesUrl =
    process.env.NEXT_PUBLIC_PROFILES_URL ||
    'https://profiles.stage.datacite.org'

  const orcidUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://orcid.org/'
      : 'https://sandbox.orcid.org/'



  let domain = 'localhost'
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PUBLIC_API_URL === 'https://api.stage.datacite.org'
  ) {
    domain = '.stage.datacite.org'
  } else if (
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
  ) {
    domain = '.datacite.org'
  } else if (
    process.env.NODE_ENV !== 'production' &&
    process.env.NEXT_PUBLIC_VERCEL_URL
  ) {
    domain = '.vercel.app'
  }


  return { DEFAULT_FEATURES, apolloUrl, authToken, profilesUrl, orcidUrl, domain }
}
