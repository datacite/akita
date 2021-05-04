import React from 'react'
import Head from 'next/head'
import { Cookies } from 'react-cookie-consent'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Consent from '../Consent/Consent'
import { GA_TRACKING_ID } from '../../utils/gtag'

type Props = {
  path: string
}

const Layout: React.FunctionComponent<Props> = ({ children, path }) => {
  // check whether user has given consent to google analytics tracking
  const hasGivenConsent = Cookies.get('_consent') == 'true'
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || 'https://datacite.org'
  const isProduction =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'

  return (
    <div>
      <Head>
        <title>DataCite Commons</title>
        {!isProduction && <meta name="robots" content="noindex" />}
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
          href={cdnUrl + '/stylesheets/doi.css?version=1.2.2'}
          rel="stylesheet"
          type="text/css"
        />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        {hasGivenConsent && GA_TRACKING_ID && (
          <>
            <script
              async
              src={
                'https://www.googletagmanager.com/gtag/js?id=' + GA_TRACKING_ID
              }
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_TRACKING_ID}', {
                      page_path: window.location.pathname,
                    });
                `
              }}
            />
          </>
        )}
        {isProduction && (
          <script
            async
            defer
            data-domain="commons.datacite.org"
            src="https://plausible.io/js/plausible.js"
          ></script>
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `
                  (function() { var s = document.createElement("script"); s.type = "text/javascript"; s.async = true; s.src = '//api.usersnap.com/load/6d0c32c3-844a-47f4-b3c6-3a4cb9e9af7c.js';
                  var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); })();
                `
          }}
        />
      </Head>
      <Header path={path} />
      <div className="container-fluid">{children}</div>
      <Consent />
      <Footer />
    </div>
  )
}

export default Layout
