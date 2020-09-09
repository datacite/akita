import React from 'react'
import App from 'next/app'
import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider
} from '@apollo/client'
import withApollo from '../../hooks/withApollo'
// import { session } from '../utils/session'
import { FlagsProvider } from 'flagged'
import * as Sentry from '@sentry/node'

// properly handle fontawesome icons
import '../styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
config.autoAddCss = false

// since "apollo" isn't a native Next.js prop we have to declare it's type.
interface IProps {
  apollo: ApolloClient<NormalizedCacheObject>
}

if (typeof process.env.SENTRY_DSN !== 'undefined') {
  Sentry.init({
    enabled: process.env.NODE_ENV === 'production',
    dsn: process.env.SENTRY_DSN
  })
}

// adds our custom props interface to the generic App base class.
class MyApp extends App<IProps> {
  render() {
    // instead of creating a client here, we use the rehydrated apollo client provided by our own withApollo provider.
    const { Component, pageProps, apollo } = this.props

    // feature flags are below. We can use ENV variables
    // or we are check that the user is logged in and is a beta tester

    // don't show user login in production yet
    const userAuthentication =
      process.env.NEXT_PUBLIC_API_URL === 'https://api.stage.datacite.org'

    // don't show consent cookie in production yet
    const consentCookie =
      process.env.NEXT_PUBLIC_API_URL === 'https://api.stage.datacite.org'

    // don't show download link in production yet
    const downloadLink = process.env.NEXT_PUBLIC_API_URL === 'https://api.stage.datacite.org'

    // don't show person employment in production yet
    const personEmployment = process.env.NEXT_PUBLIC_API_URL === 'https://api.stage.datacite.org'

    // don't show work funding in production yet
    const workFunding = process.env.NEXT_PUBLIC_API_URL === 'https://api.stage.datacite.org'
    
    // don't don't show organization info from Wikidata in production yet
    const organizationWikidata = process.env.NEXT_PUBLIC_API_URL === 'https://api.stage.datacite.org'

    return (
      <FlagsProvider
        features={{
          userAuthentication,
          consentCookie,
          downloadLink,
          personEmployment,
          workFunding,
          organizationWikidata
        }}
      >
        <ApolloProvider client={apollo}>
          {/* adds the apollo provider to provide it's children with the apollo scope. */}
          <Component {...pageProps} />
        </ApolloProvider>
      </FlagsProvider>
    )
  }
}

// before exporting our App we wrapp it with our own withApollo provider to have access to the our rehydrated apollo client.
export default withApollo(MyApp)
