const { execSync } = require('child_process')
const { withSentryConfig } = require('@sentry/nextjs')

const { SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN } = process.env

// Releases are cut from GitHub only (see .github/workflows/release.yml).
const COMMIT_SHA =
  process.env.VERCEL_GITHUB_COMMIT_SHA || process.env.GITHUB_SHA

function git(args) {
  try {
    return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    return undefined
  }
}

// Build version sent to the DataCite API: tag if HEAD is tagged, else short SHA.
// CI passes COMMONS_VERSION because Vercel builds without .git.
const COMMONS_VERSION =
  process.env.COMMONS_VERSION ||
  git('describe --tags --exact-match') ||
  git('rev-parse --short HEAD') ||
  (process.env.VERCEL_GIT_COMMIT_SHA || COMMIT_SHA)?.slice(0, 7) ||
  'dev'

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_COMMONS_VERSION: COMMONS_VERSION,
  },
  productionBrowserSourceMaps: Boolean(
    SENTRY_ORG && SENTRY_PROJECT && SENTRY_AUTH_TOKEN
  ),
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
    ],
  },
  images: {
    domains: ['img.shields.io'],
  },
  rewrites: async () => {
    return [
      {
        source: '/api/ror/:path*',
        destination: 'https://api.ror.org/:path*',
      },
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/api/:path*'
            : '/api/',
      },
    ]
  },
  staticPageGenerationTimeout: 220,
}

module.exports = withSentryConfig(nextConfig, {
  org: SENTRY_ORG,
  project: SENTRY_PROJECT,
  authToken: SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  release: COMMIT_SHA ? { name: COMMIT_SHA } : undefined,
})
