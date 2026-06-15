/**
 * Node-only fetch mock for Cypress when `CYPRESS_NODE_ENV=test`.
 *
 * Wraps `global.fetch` so Next.js server-side requests during e2e runs are
 * served from cypress/fixtures/ via cypress/mockApiRouter.cjs.
 */
const { matchRequest, fixtureToResponse, toAbsoluteUrl } = require('./cypress/mockApiRouter.cjs')

/** @param {RequestInfo|URL} input @param {RequestInit} [init] */
async function readRequestBody(input, init) {
  if (init?.body != null) {
    if (typeof init.body === 'string') return init.body
    return await new Response(init.body).text()
  }
  if (input instanceof Request) return input.clone().text()
  return ''
}

/**
 * @param {RequestInfo|URL} input
 * @param {RequestInit} [init]
 */
async function tryMockResponse(input, init) {
  const url = toAbsoluteUrl(input)
  const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase()
  const bodyText = await readRequestBody(input, init)
  const match = matchRequest(url.toString(), method, bodyText)
  if (match) return fixtureToResponse(match)
  return null
}

module.exports = function setupCypressFetchMock() {
  if (typeof global.fetch !== 'function') return

  const originalFetch = global.fetch.bind(global)

  global.fetch = async (input, init) => {
    const mocked = await tryMockResponse(input, init)
    if (mocked) return mocked
    return originalFetch(input, init)
  }
}
