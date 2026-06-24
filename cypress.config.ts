import { defineConfig } from 'cypress'

export default defineConfig({
  allowCypressEnv: false,
  video: false,
  projectId: 'yur1cf',
  retries: 2,
  expose: {
    // Enabled for `cy:run` / CI (`CYPRESS_NODE_ENV=test`). Unmocked browser API calls fail with
    // HTTP 599. Strict mode stays on unless you pass strictApiMocks: false (here, --expose, or
    // CYPRESS_expose_strictApiMocks=false).
    strictApiMocks: process.env.CYPRESS_NODE_ENV === 'test',
  },
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.test.*',
  },
  // Component testing deferred: @cypress/webpack-dev-server v1 is incompatible with Cypress 15.
  // Migrate to @cypress/webpack-dev-server v4 + webpack 5 (or Vite) before using `cypress open --component`.
  component: {
    setupNodeEvents(on, config) { },
    specPattern: 'src/{components,utils}/**/*.test.*',
    devServer: {
      bundler: 'webpack',
      framework: 'react',
      webpackConfig: undefined
    }
  },
})
