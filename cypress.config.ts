import { defineConfig } from 'cypress'
import * as jwt from 'jsonwebtoken'

function normalizeKey(key: string | undefined): string | undefined {
  return key?.replace(/\\n/g, '\n')
}

function setupJWTConfigAndTasks(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
  const publicKey = normalizeKey(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY)
  if (publicKey) {
    config.env.jwtPublicKey = publicKey
    config.env.jwtPublicKeyConfigured = true
  }

  on('task', {
    signJWT({ payload, expiresIn }: { payload: { uid: string; name: string }; expiresIn?: string }) {
      const privateKey = normalizeKey(process.env.TEST_JWT_PRIVATE_KEY)
      if (!privateKey) throw new Error('TEST_JWT_PRIVATE_KEY is required for signJWT task')
      const token = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: expiresIn ?? '1h'
      })
      return token
    },
    signExpiredJWT({ payload }: { payload: { uid: string; name: string } }) {
      const privateKey = normalizeKey(process.env.TEST_JWT_PRIVATE_KEY)
      if (!privateKey) throw new Error('TEST_JWT_PRIVATE_KEY is required for signExpiredJWT task')
      const token = jwt.sign(
        { ...payload, exp: Math.floor(Date.now() / 1000) - 3600 },
        privateKey,
        { algorithm: 'RS256' }
      )
      return token
    },
    verifyJWT({ token }: { token: string }) {
      const key = normalizeKey(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY)
      if (!key) return null
      return new Promise((resolve) => {
        jwt.verify(token, key, { algorithms: ['RS256'] }, (err, decoded) => {
          if (err) resolve(null)
          else resolve(decoded)
        })
      })
    }
  })
}

export default defineConfig({
  experimentalFetchPolyfill: false,
  video: false,
  projectId: 'yur1cf',
  retries: 2,
  e2e: {
    setupNodeEvents(on, config) {
      if (process.env.CYPRESS_USER_COOKIE) {
        config.env.userCookie = process.env.CYPRESS_USER_COOKIE
      }
      setupJWTConfigAndTasks(on, config)
      return config
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.test.*',
  },
  component: {
    setupNodeEvents(on, config) {
      setupJWTConfigAndTasks(on, config)
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
