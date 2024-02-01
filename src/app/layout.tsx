import React, { PropsWithChildren } from "react";
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import * as Sentry from '@sentry/node'

import '../doi.css'
import '../styles.css'

// properly handle fontawesome icons
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS

import Header from "./header";
import Consent from "./consent";
import Footer from "./footer";
import session from "../utils/server/session";
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

export default async function RootLayout({ children }: PropsWithChildren) {
  const data = GetData()
  
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400i,600"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/jpswalsh/academicons@1/css/academicons.min.css"
        />
      </head>
      <body>
        <Providers default_features={data.DEFAULT_FEATURES} apolloUrl={data.apolloUrl} authToken={data.authToken} >
          <Header profilesUrl={data.profilesUrl} orcidUrl={data.orcidUrl} user={data.user} />
          <div className="container-fluid">{children}</div>
          <Consent domain={data.domain} />
          <Footer  />
        </Providers>
      </body>
    </html>
  )
}


function GetData () {
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


  const user = session()

  return { DEFAULT_FEATURES, apolloUrl, authToken, profilesUrl, orcidUrl, domain, user }
}
