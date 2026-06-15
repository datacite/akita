import { defineConfig } from 'cypress'

export default defineConfig({
  experimentalFetchPolyfill: false,
  video: false,
  projectId: 'yur1cf',
  retries: 2,
  env: {
    strictApiMocks: process.env.CYPRESS_NODE_ENV === 'test',
  },
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.test.*',
  },
  component: {
    setupNodeEvents(on, config) { },
    specPattern: 'src/components/**/*.test.*',
    devServer: {
      bundler: 'webpack',
      framework: 'react',
      webpackConfig: undefined
    }
  },
})
