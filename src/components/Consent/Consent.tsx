import React from 'react'
import CookieConsent from 'react-cookie-consent'

const Consent = () => {
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

  const cookieStyle = {
    fontSize: '16px',
    height: '95px',
    flexWrap: 'nowrap !important'
  }
  const linkStyle = { color: '#fecd23' }
  const myContentStyle = {}

  return (
    <CookieConsent
      style={cookieStyle}
      location="bottom"
      buttonText="Accept"
      declineButtonText="Reject"
      sameSite="strict"
      cookieName="_consent"
      extraCookieOptions={{ domain: domain }}
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
        href="https://datacite.org/privacy.html"
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

export default Consent
