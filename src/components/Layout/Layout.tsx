import React from 'react'
import Head from 'next/head'
import { useFeature } from 'flagged'
import { Cookies } from 'react-cookie-consent'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Consent from '../Consent/Consent'

type Props = {
  path: string
}

const Layout: React.FunctionComponent<Props> = ({ children, path }) => {
  const showConsentCookie = useFeature('consentCookie')
  
  // check whether user has given consent to google analytics tracking
  const hasGivenConsent = (Cookies.get('_consent') == 'true')
  const trackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID

  return (
    <div>
      <Head>
        <title>DataCite Commons</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400i,600"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/jpswalsh/academicons@1/css/academicons.min.css"
        />
        <link
          href="https://datacite.org/stylesheets/doi.css?version=3.8.0"
          rel="stylesheet"
          type="text/css"
        />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        {hasGivenConsent && trackingId && (
          <>
            <script
              async
              src={'https://www.googletagmanager.com/gtag/js?id=' + trackingId}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${trackingId}');
                `
              }}
            />
          </>
        )}
      </Head>
      <Header path={path} />
      <div className="container-fluid">{children}</div>
      {showConsentCookie && <Consent />}
      <Footer />
    </div>
  )
}

export default Layout
