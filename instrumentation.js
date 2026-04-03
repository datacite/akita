/**
 * Next.js instrumentation hook: replaces global fetch when Cypress runs the app (CYPRESS_NODE_ENV=test).
 * Kept as root CommonJS so the dev bundler does not rewrite require() to cypressFetchMock.cjs.
 */
async function register() {
  if (process.env.CYPRESS_NODE_ENV !== 'test') return
  require('./cypressFetchMock.cjs')()
}

module.exports = { register }
