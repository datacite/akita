/**
 * Next.js instrumentation hook: when Cypress drives the app (`CYPRESS_NODE_ENV=test`),
 * loads `cypressFetchMock.cjs` to stub outbound `fetch` with fixture JSON.
 *
 * Implemented as root-level CommonJS so Next’s bundler does not analyze `fs` or
 * dynamic requires inside `src/`.
 */

/** @returns {Promise<void>} */
async function register() {
  if (process.env.CYPRESS_NODE_ENV !== 'test') return
  require('./cypressFetchMock.cjs')()
}

module.exports = { register }
