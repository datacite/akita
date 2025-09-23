// ENV
export const ENV = process.env.NODE_ENV
export const IS_PROD = ENV === 'production'

// Raw URLs
const localhost = 'http://localhost:3000'

const dataciteApi = 'https://api.datacite.org'
const dataciteApiStage = 'https://api.stage.datacite.org'

const commons = 'https://commons.datacite.org'
const commonsStage = 'https://commons.stage.datacite.org'

const profilesStage = 'https://profiles.stage.datacite.org'
const handleStage = 'https://handle.stage.datacite.org'

const orcid = 'https://orcid.org'
const orcidSandbox = 'https://sandbox.orcid.org'
const orcidApiSandbox = 'https://pub.sandbox.orcid.org/v3.0'

const rorApi = 'https://api.ror.org'

// Rarely needed to use raw URLs outside of this file
export const URLS = {
  localhost,
  dataciteApi,
  dataciteApiStage
}


// URLs
export const DATACITE_API_URL = process.env.NEXT_PUBLIC_API_URL || dataciteApiStage
export const COMMONS_URL = DATACITE_API_URL === dataciteApi ? commons : commonsStage
export const LOGO_URL = `${COMMONS_URL}/images/logo.png`
export const PROFILES_URL = process.env.NEXT_PUBLIC_PROFILES_URL || profilesStage
export const PROFILES_SETTINGS_URL = `${PROFILES_URL}/settings/me`
export const PROFILES_SIGN_IN_URL = `${PROFILES_URL}/sign_in`

export const ORCID_URL = DATACITE_API_URL === dataciteApi ? orcid : orcidSandbox
export const ORCID_API_URL = process.env.NEXT_PUBLIC_ORCID_API_URL || orcidApiSandbox

export const ROR_API_URL = process.env.NEXT_PUBLIC_ROR_API_URL || rorApi

export const VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL

// Tracking, logging, and auth
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID
export const SENTRY_DSN = process.env.SENTRY_DSN
export const JWT_KEY = process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY?.replace(/\\n/g, '\n')


// Colors
export const ACCENT_COLOR = '#00B1E2'
export const ACCENT_GREEN = '#1ABC9C'
export const WARNING = '#E67E22'


// Misc
export const DOI_ID_BASE = process.env.NEXT_PUBLIC_ID_BASE || `${handleStage}/`
export const FEATURE_FLAGS = process.env.NEXT_PUBLIC_FEATURE_FLAGS?.split(",") || []


export const FACETS = {
  DEFAULT: [
    'published',
    'resourceTypes',
    'languages',
    'licenses_with_missing',
    'fieldsOfScience',
    'affiliations',
    'repositories',
    'registrationAgencies',
    'authors',
    'creatorsAndContributors',
    'clientTypes',
    // personToWorkTypesMultilevel: []
  ],
  METRICS: [
    'citation_count',
    'view_count',
    'download_count',
    'content_url_count',
    'open_licenses',
    'open_licenses_count'
  ]
}


