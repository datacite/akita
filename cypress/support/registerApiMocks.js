const { matchRequest, isApiRequestUrl } = require('../mockApiRouter.cjs')

// Strict API mocking is on unless explicitly disabled. Unmocked API requests get HTTP 599
// instead of hitting the network. To turn strict mode off, set strictApiMocks: false in
// cypress.config.ts expose, pass --expose strictApiMocks=false, or set CYPRESS_expose_strictApiMocks=false.
const strictMocks = Cypress.expose('strictApiMocks') !== false

const API_INTERCEPT_PATTERNS = [
  '**/dois?*',
  '**/expanded-search?*',
  '**/text/x-bibliography/**',
  '**/api/ror/v2/**',
  '**/api/doi/related-graph/**',
  '**/claims',
  '**/claims/**',
  '**/v3.0/*/person',
  '**/v3.0/*/employments',
  'http://localhost:3000/providers',
  'http://127.0.0.1:3000/providers',
]

function handleApiRequest(req) {
  if (!isApiRequestUrl(req.url)) {
    req.continue()
    return
  }

  const bodyText =
    typeof req.body === 'string'
      ? req.body
      : req.body != null
        ? JSON.stringify(req.body)
        : ''

  const match = matchRequest(req.url, req.method, bodyText)

  if (match) {
    req.reply({
      statusCode: match.status ?? 200,
      fixture: match.fixture,
      headers: {
        'content-type': match.contentType ?? 'application/json',
      },
    })
    return
  }

  if (strictMocks) {
    req.reply({
      statusCode: 599,
      body: `Unmocked API request: ${req.method} ${req.url}`,
    })
    return
  }

  req.continue()
}

function registerApiMocks() {
  for (const pattern of API_INTERCEPT_PATTERNS) {
    cy.intercept(pattern, handleApiRequest)
  }
}

module.exports = registerApiMocks
