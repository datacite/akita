const { withSentryConfig } = require('@sentry/nextjs')

const { SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN } = process.env

// Releases are cut from GitHub only (see .github/workflows/release.yml).
const COMMIT_SHA =
  process.env.VERCEL_GITHUB_COMMIT_SHA || process.env.GITHUB_SHA

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  webpack: (config) => {
    // workaround for package not defined as module
    config.module.rules.push({
      test: /\.js/,
      include: /node_modules\/nuqs/,
      type: 'javascript/auto',
    })

    return config
  },
}

module.exports = withSentryConfig(nextConfig, {
  org: SENTRY_ORG,
  project: SENTRY_PROJECT,
  authToken: SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  release: COMMIT_SHA ? { name: COMMIT_SHA } : undefined,
})
