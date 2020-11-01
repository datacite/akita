import React from 'react'
import * as Sentry from '@sentry/node'
import { ApolloProvider } from '@apollo/client'
// import { FlagsProvider } from 'flagged'
import { AppProps } from "next/app"
import { useRouter } from "next/router"
import { useEffect } from "react"

// import { session } from '../utils/session'
import apolloClient from '../utils/apolloClient'
import * as gtag from "../utils/gtag"

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
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  // feature flags are below. We can use ENV variables
  // or we are check that the user is logged in and is a beta tester

  // don't show aggregate stats in production yet
  // const metricsCounter = process.env.NEXT_PUBLIC_API_URL === 'https://api.stage.datacite.org'

  return (
    // <FlagsProvider
    //   features={{
    //     metricsCounter
    //   }}
    // >
      <ApolloProvider client={apolloClient}>
        {/* adds the apollo provider to provide it's children with the apollo scope. */}
        <Component {...pageProps} />
      </ApolloProvider>
    // </FlagsProvider>
  )
}

export default App
