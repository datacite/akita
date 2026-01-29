import { defineConfig } from 'cypress'
import * as fs from 'fs'
import * as path from 'path'

export default defineConfig({
  experimentalFetchPolyfill: false,
  video: false,
  projectId: 'yur1cf',
  retries: 2,
  e2e: {
    setupNodeEvents(on, config) {
      // Map CYPRESS_USER_COOKIE environment variable to Cypress.env('userCookie')
      if (process.env.CYPRESS_USER_COOKIE) {
        config.env.userCookie = process.env.CYPRESS_USER_COOKIE
      }
      
      // Load JWT public key from fixture for tests
      const jwtKeysPath = path.join(__dirname, 'cypress', 'fixtures', 'jwt-keys.json')
      if (fs.existsSync(jwtKeysPath)) {
        const jwtKeys = JSON.parse(fs.readFileSync(jwtKeysPath, 'utf8'))
        config.env.jwtPublicKey = jwtKeys.publicKey
      }
      
      return config
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.test.*',
  },
  component: {
    setupNodeEvents(on, config) {
      // Load JWT public key from fixture for component tests
      const jwtKeysPath = path.join(__dirname, 'cypress', 'fixtures', 'jwt-keys.json')
      if (fs.existsSync(jwtKeysPath)) {
        const jwtKeys = JSON.parse(fs.readFileSync(jwtKeysPath, 'utf8'))
        config.env.jwtPublicKey = jwtKeys.publicKey
      }
      
      return config
    },
    specPattern: 'src/components/**/*.test.*',
    devServer: {
      bundler: 'webpack',
      framework: 'react',
      webpackConfig: undefined
    }
  },
})
