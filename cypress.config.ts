import { defineConfig } from 'cypress'

export default defineConfig({
  experimentalFetchPolyfill: true,
  video: false,
  projectId: 'yur1cf',
  retries: 2,
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
