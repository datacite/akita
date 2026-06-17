import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  release:
    process.env.VERCEL_GITHUB_COMMIT_SHA || process.env.GITHUB_SHA,
})
