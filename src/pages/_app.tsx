import React, { useEffect } from 'react'
import * as Sentry from '@sentry/node'
import { ApolloProvider } from '@apollo/client'
import { FlagsProvider } from 'flagged'
import PlausibleProvider from 'next-plausible'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import apolloClient from '../utils/apolloClient'
import * as gtag from '../utils/gtag'

// properly handle fontawesome icons
import '../styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
config.autoAddCss = false

if (typeof process.env.SENTRY_DSN !== 'undefined') {
  Sentry.init({
    enabled: process.env.NODE_ENV === 'production',
    dsn: process.env.SENTRY_DSN
  })
}

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  // Construct feature flags based on query param, we have to wrap into array as
  // the query string can parse into string || string[]
  // Use like ?features=feature1&?features=feature2
  const DEFAULT_FEATURES:string[] = process.env.NEXT_PUBLIC_FEATURE_FLAGS ? 
    process.env.NEXT_PUBLIC_FEATURE_FLAGS.split(","):
    []

  const query_features: string[] =
    router.query['features'] instanceof Array
      ? router.query['features']
      : [router.query['features']]

  const features: string[] =
    DEFAULT_FEATURES.concat(query_features)
  return (
    <FlagsProvider features={features}>
      <ApolloProvider client={apolloClient}>
        <PlausibleProvider domain="commons.datacite.org">
          {/* adds the apollo provider to provide it's children with the apollo scope. */}
          <Component {...pageProps} />
        </PlausibleProvider>
      </ApolloProvider>
    </FlagsProvider>
  )
}

export default App
