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
        <script
          dangerouslySetInnerHTML={{
            __html: `
                (function(){window.onUsersnapCXLoad=function(e){e.init()};var e=document.createElement("script");e.defer=1,e.src="https://widget.usersnap.com/global/load/b4393e90-ec13-4338-b299-7b6f122b7de3?onload=onUsersnapCXLoad",document.getElementsByTagName("head")[0].appendChild(e)})();
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
