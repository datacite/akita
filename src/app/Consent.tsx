'use client'

import React from 'react'
import CookieConsent from 'react-cookie-consent'
import { IS_PROD, DATACITE_API_URL, URLS, VERCEL_URL } from 'src/data/constants'


export default function Consent() {
  const linkStyle = { color: '#fecd23' }
  const myContentStyle = {}

  return (
    <CookieConsent
      style={{
        fontSize: '16px',
        height: '95px',
        flexWrap: 'nowrap'
      }}
      location="bottom"
      buttonText="Accept"
      declineButtonText="Reject"
      sameSite="strict"
      cookieName="_consent"
      extraCookieOptions={{ domain: getDomain() }}
      overlay={false}
      enableDeclineButton
      buttonWrapperClasses="MY_BUTTON_WRAPPER_CLASS"
      containerClasses="CookieConsent MY_CONTAINER_CLASS"
      contentClasses="MY_CONTENT_CLASS"
      contentStyle={myContentStyle}
      declineButtonClasses="MY_DECLINE_BUTTON_CLASS"
    >
      We use cookies on our website. Some are technically necessary, others help
      us improve your user experience. You can decline non-essential cookies by
      selecting “Reject”. Please see our{' '}
      <a
        href="https://datacite.org/privacy-policy/"
        style={linkStyle}
        target="_blank"
        rel="noreferrer"
      >
        Privacy Policy
      </a>{' '}
      for further information about our privacy practices and use of cookies.{' '}
    </CookieConsent>
  )
}

function getDomain() {
  if (IS_PROD && DATACITE_API_URL === URLS.dataciteApi)
    return '.datacite.org'

  if (IS_PROD && DATACITE_API_URL === URLS.dataciteApiStage)
    return '.stage.datacite.org'

  if (!IS_PROD && VERCEL_URL)
    return '.vercel.app'

  return 'localhost'
}
