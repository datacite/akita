import React from 'react'
import CookieConsent from 'react-cookie-consent'

const Consent = () => {
  let domain = 'localhost'
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org') {
    domain = '.datacite.org'
  } else if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_API_URL === 'https://api.stage.datacite.org') {
    domain = '.stage.datacite.org'
  }

  return (
    <CookieConsent
      containerClasses="consent-cookie"
      location="bottom"
      buttonText="I accept"
      declineButtonText="I decline"
      sameSite="strict"
      cookieName="_consent"
      extraCookieOptions={{ domain: domain }}
      overlay={true}
      enableDeclineButton
    >
      This website uses cookies to enable important site functionality including
      analytics and personalization.{' '}
      <a
        href="https://datacite.org/privacy.html"
        target="_blank"
        rel="noreferrer"
      >
        Read our privacy policy
      </a>{' '}
    </CookieConsent>
  )
}

export default Consent
