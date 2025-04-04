// https://medium.com/frontend-digest/using-nextjs-with-google-analytics-and-typescript-620ba2359dea
import { Cookies } from 'react-cookie-consent'
import { GA_TRACKING_ID } from 'src/data/constants'

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    gtag: any
  }
}

const hasGivenConsent = Cookies.get('_consent') == 'true'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  if (hasGivenConsent && GA_TRACKING_ID && typeof window !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url
    })
  }
}

type GTagEvent = {
  action: string
  category: string
  label: string
  value: number
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent) => {
  if (hasGivenConsent && GA_TRACKING_ID && typeof window !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
  }
}
