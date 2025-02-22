'use client'

import React from 'react'
import { Cookies } from 'react-cookie-consent'
import { GoogleTagManager } from '@next/third-parties/google'
import { GA_TRACKING_ID } from 'src/data/constants'


export default function ConsentedGoogleTagManager() {
  const gtmId = GA_TRACKING_ID || ""
  const hasGivenConsent = Cookies.get('_consent') == 'true'
  return hasGivenConsent && gtmId && <GoogleTagManager gtmId={gtmId} />
}
