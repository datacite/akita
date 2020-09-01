
import React from 'react'
import CookieConsent from 'react-cookie-consent'

const Consent = () => {
  return (
    <CookieConsent
      containerClasses="consent-cookie"
      location="bottom"
      buttonText="I accept"
      declineButtonText="I decline"
      sameSite="strict"
      cookieName="_consent"
      // extraCookieOptions={{ domain: "datacite.org" }}
      overlay={true}
      enableDeclineButton
    >
      This website uses cookies to enable important site functionality
      including analytics and personalization.{' '}
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
