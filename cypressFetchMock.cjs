/**
 * Node-only fetch mock for Cypress when `CYPRESS_NODE_ENV=test`.
 *
 * Wraps `global.fetch` so Next.js server-side requests during e2e runs are
 * served from `cypress/fixtures/` instead of live staging APIs. Unmatched
 * requests delegate to the original `fetch`.
 *
 * Routing is intentionally string/heuristic-based to mirror how the app builds
 * query URLs; extend the branches when new specs need additional responses.
 */
const fs = require('fs')
const path = require('path')

const fixturesRoot = path.join(process.cwd(), 'cypress', 'fixtures')

/** @param {...string} segments Path segments under cypress/fixtures */
function readFixtureJson(...segments) {
  const filePath = path.join(fixturesRoot, ...segments)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

/** @param {unknown} body @param {number} [status] */
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

/** @param {string} body */
function textResponse(body) {
  return new Response(body, {
    status: 200,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}

/** @param {RequestInfo|URL} input */
function toAbsoluteUrl(input) {
  if (typeof input === 'string') {
    return input.startsWith('http') ? new URL(input) : new URL(input, 'http://localhost:3000')
  }
  if (input instanceof URL) return input
  return new URL(input.url)
}

/** @param {string} q */
function decodeQueryParam(q) {
  let out = q
  try {
    out = decodeURIComponent(q)
    if (out.includes('%')) out = decodeURIComponent(out)
  } catch {
    out = q
  }
  return out
}

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
 * Returns a stub Response when the request matches a known Cypress fixture route.
 * @param {RequestInfo|URL} input
 * @param {RequestInit} [init]
 */
async function tryMockResponse(input, init) {
  const url = toAbsoluteUrl(input)

  if (url.hostname === 'localhost' && url.pathname.startsWith('/api/doi/related-graph/')) {
    return jsonResponse({ nodes: [], links: [] })
  }

  if (url.hostname === 'localhost' && url.pathname === '/providers') {
    return jsonResponse({})
  }

  if (url.hostname === 'pub.sandbox.orcid.org') {
    if (url.pathname === '/v3.0/0000-0001-6528-2027/person') {
      return jsonResponse(readFixtureJson('orcid', '0000-0001-6528-2027-person.json'))
    }
    if (url.pathname === '/v3.0/0000-0001-6528-2027/employments') {
      return jsonResponse(readFixtureJson('orcid', '0000-0001-6528-2027-employments.json'))
    }
    if (url.pathname === '/v3.0/expanded-search') {
      const q = url.searchParams.get('q') || ''
      if (q.includes('Josiah') && q.includes('Carberry')) {
        return jsonResponse(readFixtureJson('orcid', 'expanded-search-josiah-carberry.json'))
      }
    }
  }

  if (url.hostname === 'api.ror.org' && url.pathname.startsWith('/v2/organizations')) {
    const idMatch = url.pathname.match(/^\/v2\/organizations\/([^/?]+)$/)
    if (idMatch) {
      const id = decodeURIComponent(idMatch[1])
      if (id === '052gg0110') {
        return jsonResponse(readFixtureJson('ror', 'organization-052gg0110.json'))
      }
      if (id === '02hhf2525') {
        return jsonResponse(readFixtureJson('ror', 'organization-02hhf2525.json'))
      }
      if (id === '013meh722') {
        return jsonResponse(readFixtureJson('ror', 'organization-013meh722.json'))
      }
      if (id === '0472cxd90') {
        return jsonResponse({
          id: 'https://ror.org/0472cxd90',
          names: [{ lang: 'en', types: ['ror_display', 'label'], value: 'European Research Council' }],
          status: 'active',
          established: 2007,
          locations: [],
          types: ['funder', 'government'],
          links: [{ type: 'website', value: 'https://erc.europa.eu' }],
          external_ids: [],
          relationships: [],
        })
      }
    }
    if (url.pathname === '/v2/organizations') {
      const rawAdvancedQ = url.searchParams.get('query.advanced') || ''
      const advancedQ = decodeQueryParam(rawAdvancedQ)
      if (advancedQ === 'external_ids.all:100011199') {
        return jsonResponse({
          number_of_results: 1,
          time_taken: 1,
          items: [{ id: 'https://ror.org/0472cxd90' }],
          meta: { types: [], countries: [], continents: [], statuses: [] },
        })
      }
      if (advancedQ === 'external_ids.all:100011105') {
        return jsonResponse({
          number_of_results: 0,
          time_taken: 0,
          items: [],
          meta: { types: [], countries: [], continents: [], statuses: [] },
        })
      }
      const rawQ = url.searchParams.get('query') || ''
      const q = decodeQueryParam(rawQ)
      if (q === 'oxford') {
        return jsonResponse(readFixtureJson('ror', 'search-query-oxford.json'))
      }
      if (q.includes('052gg0110')) {
        return jsonResponse(readFixtureJson('ror', 'search-query-ror-org-052gg0110.json'))
      }
      if (q === 'cambridge') {
        return jsonResponse(readFixtureJson('ror', 'search-query-cambridge.json'))
      }
      if (q === 'springer') {
        return jsonResponse(readFixtureJson('ror', 'search-query-springer.json'))
      }
      if (q === 'xxx') {
        return jsonResponse({
          number_of_results: 0,
          time_taken: 0,
          items: [],
          meta: { types: [], countries: [], continents: [], statuses: [] },
        })
      }
    }
  }

  // Server-side claims proxy (`/claims` routes) calls the DataCite REST claims API.
  if (url.hostname === 'api.stage.datacite.org' && url.pathname === '/claims') {
    const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase()

    if (method === 'GET') {
      return jsonResponse({
        data: [{
          id: 'claim-1',
          type: 'claims',
          attributes: {
            sourceId: 'orcid_search',
            state: 'ready',
            claimAction: null,
            claimed: null,
            errorMessages: [],
          },
        }],
      })
    }

    if (method === 'POST') {
      const bodyText = await readRequestBody(input, init)
      let sourceId = 'orcid_search'
      try {
        const parsed = JSON.parse(bodyText)
        sourceId = parsed?.claim?.source_id || sourceId
      } catch {
        return jsonResponse({ errors: [{ title: 'Invalid request body' }] }, 400)
      }

      return jsonResponse({
        data: {
          id: 'claim-1',
          type: 'claims',
          attributes: {
            sourceId,
            state: 'waiting',
            claimAction: 'create',
            claimed: null,
            errorMessages: [],
          },
        },
      }, 202)
    }

    return null
  }

  if (url.hostname === 'api.stage.datacite.org' && url.pathname.startsWith('/claims/')) {
    const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase()
    if (method !== 'DELETE') return null

    const id = decodeURIComponent(url.pathname.slice('/claims/'.length))
    return jsonResponse({
      data: {
        id,
        type: 'claims',
        attributes: {
          sourceId: 'orcid_search',
          state: 'deleted',
          claimAction: 'delete',
          claimed: null,
          errorMessages: [],
        },
      },
    })
  }

  if (url.hostname === 'api.stage.datacite.org' && url.pathname === '/dois') {
    const rawQuery = url.searchParams.get('query')
    if (rawQuery == null) return null

    const queryDecoded = decodeQueryParam(rawQuery)
    const facets = url.searchParams.get('facets') || ''

    if (queryDecoded === 'xxxxxxxxxxxx' && !facets) {
      return jsonResponse(readFixtureJson('jsonapi', 'dois-query-empty.json'))
    }

    if (queryDecoded === 'climate') {
      if (facets) {
        return jsonResponse(readFixtureJson('jsonapi', 'dois-query-climate-facets.json'))
      }
      const pageNum = url.searchParams.get('page[number]') || '1'
      if (pageNum === '2') {
        return jsonResponse(readFixtureJson('jsonapi', 'dois-query-climate-page2.json'))
      }
      return jsonResponse(readFixtureJson('jsonapi', 'dois-query-climate-page1.json'))
    }

    if (queryDecoded.includes('0000-0001-6528-2027')) {
      if (facets.includes('citation_count')) {
        return jsonResponse(readFixtureJson('jsonapi', 'dois-facets-person-0000-0001-6528-2027.json'))
      }
      if (queryDecoded.includes('AND (datacite)')) {
        if (facets) {
          return jsonResponse(readFixtureJson('jsonapi', 'dois-facets-person-filter-datacite.json'))
        }
        return jsonResponse(readFixtureJson('jsonapi', 'dois-query-empty.json'))
      }
      if (facets) {
        return jsonResponse(readFixtureJson('jsonapi', 'dois-facets-person-default.json'))
      }
      return jsonResponse(readFixtureJson('jsonapi', 'dois-person-works-multi.json'))
    }

    if (queryDecoded.includes('10.7272/q6g15xs4')) {
      return jsonResponse(readFixtureJson('jsonapi', 'doi-10.7272-q6g15xs4.json'))
    }

    if (queryDecoded.includes('10.17863/cam.10544')) {
      return jsonResponse(readFixtureJson('jsonapi', 'doi-10.17863-cam.10544.json'))
    }

    if (queryDecoded.includes('ror.org/013meh722') && queryDecoded.includes('cambridge')) {
      if (facets) {
        return jsonResponse(readFixtureJson('jsonapi', 'dois-org-013meh722-filter-cambridge-facets.json'))
      }
      return jsonResponse(readFixtureJson('jsonapi', 'dois-org-013meh722-filter-cambridge.json'))
    }

    return null
  }

  if (url.hostname === 'api.stage.datacite.org' && url.pathname.startsWith('/text/x-bibliography/')) {
    return textResponse('Mock IEEE citation including NEXUS Head CT for Cypress.')
  }

  return null
}

/**
 * Patches `global.fetch` for the lifetime of the Node process (dev server).
 * Idempotent enough for instrumentation: repeated calls would stack wrappers, so
 * only invoke once from `instrumentation.js`.
 */
module.exports = function setupCypressFetchMock() {
  if (typeof global.fetch !== 'function') return

  const originalFetch = global.fetch.bind(global)

  global.fetch = async (input, init) => {
    const mocked = await tryMockResponse(input, init)
    if (mocked) return mocked
    return originalFetch(input, init)
  }
}
