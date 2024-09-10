'use client'

import React from 'react'
import { Cookies } from 'react-cookie-consent'
import { GoogleTagManager } from '@next/third-parties/google'


interface Props {
  gtmId: string
}

export default function ConsentedGoogleTagManager({ gtmId }: Props) {
  const hasGivenConsent = Cookies.get('_consent') == 'true'
  return hasGivenConsent && gtmId && <GoogleTagManager gtmId={gtmId}/>
}
