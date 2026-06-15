/**
 * Shared Cypress API mock router.
 *
 * Maps request URLs to fixture paths under cypress/fixtures/. Used by:
 * - cypressFetchMock.cjs (Node SSR fetch)
 * - cypress/support/registerApiMocks.js (browser cy.intercept)
 *
 * Add a branch here when a new spec needs a response; never embed payloads inline.
 */
const fs = require('fs')
const path = require('path')

const fixturesRoot = path.join(process.cwd(), 'cypress', 'fixtures')

/** @typedef {{ fixture: string, status?: number, contentType?: string }} FixtureMatch */

/** @param {string} fixture Path under cypress/fixtures/ */
function fixtureMatch(fixture, status = 200, contentType) {
  const resolvedContentType =
    contentType ??
    (fixture.endsWith('.txt') ? 'text/plain; charset=utf-8' : 'application/json')
  return { fixture, status, contentType: resolvedContentType }
}

/** @param {...string} segments Path segments under cypress/fixtures */
function readFixtureJson(...segments) {
  const filePath = path.join(fixturesRoot, ...segments)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

/** @param {string} fixture Path under cypress/fixtures/ */
function readFixtureContent(fixture) {
  return fs.readFileSync(path.join(fixturesRoot, fixture), 'utf8')
}

/** @param {FixtureMatch} match */
function fixtureToResponse(match) {
  const content = readFixtureContent(match.fixture)
  return new Response(content, {
    status: match.status ?? 200,
    headers: { 'content-type': match.contentType ?? 'application/json' },
  })
}

/** @param {string | URL} input */
function toAbsoluteUrl(input) {
  if (input instanceof URL) return input
  if (typeof input === 'string') {
    return input.startsWith('http') ? new URL(input) : new URL(input, 'http://localhost:3000')
  }
  return new URL(input.url)
}

/** @param {string} q */
function decodeQueryParam(q) {
  let out
  try {
    out = decodeURIComponent(q)
    if (out.includes('%')) out = decodeURIComponent(out)
  } catch {
    out = q
  }
  return out
}

/** @param {string} hostname */
function isOrcidHost(hostname) {
  return hostname === 'orcid.org' || hostname.endsWith('.orcid.org')
}

/** @param {string} hostname */
function isDataciteHost(hostname) {
  return hostname === 'api.stage.datacite.org' || hostname === 'api.datacite.org'
}

/** @param {string} pathname */
function normalizeRorPathname(pathname) {
  if (pathname.startsWith('/api/ror/v2')) {
    return pathname.replace('/api/ror/v2', '/v2')
  }
  return pathname
}

/** @param {string} url */
function isApiRequestUrl(url) {
  try {
    const parsed = toAbsoluteUrl(url)
    const pathname = parsed.pathname

    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      if (pathname === '/providers') return true
      if (pathname.startsWith('/api/doi/related-graph/')) return true
      if (pathname.startsWith('/api/ror/v2/')) return true
      return false
    }

    if (isDataciteHost(parsed.hostname)) return true
    if (isOrcidHost(parsed.hostname)) return true
    if (parsed.hostname === 'api.ror.org') return true

    return false
  } catch {
    return false
  }
}

/**
 * @param {string | URL} urlInput
 * @param {string} [method]
 * @param {string} [bodyText]
 * @returns {FixtureMatch | null}
 */
function matchRequest(urlInput, method = 'GET', bodyText = '') {
  const url = toAbsoluteUrl(urlInput)
  const upperMethod = method.toUpperCase()
  const pathname = url.pathname

  if (
    (url.hostname === 'localhost' || url.hostname === '127.0.0.1') &&
    pathname.startsWith('/api/doi/related-graph/')
  ) {
    return fixtureMatch('jsonapi/related-graph-empty.json')
  }

  if (
    (url.hostname === 'localhost' || url.hostname === '127.0.0.1') &&
    pathname === '/providers'
  ) {
    return fixtureMatch('providers/empty.json')
  }

  if (isOrcidHost(url.hostname)) {
    const orcidBase = pathname.match(/^(\/v3\.0)?\/([^/]+)\/(person|employments)$/)
    if (orcidBase) {
      const id = decodeURIComponent(orcidBase[2]).toUpperCase()
      if (id === '0000-0001-6528-2027') {
        if (orcidBase[3] === 'person') {
          return fixtureMatch('orcid/0000-0001-6528-2027-person.json')
        }
        return fixtureMatch('orcid/0000-0001-6528-2027-employments.json')
      }
      if (id === 'XXXXX' || id === 'xxxxx') {
        return fixtureMatch('orcid/error-not-found.json', 404)
      }
    }

    if (pathname.endsWith('/expanded-search') || pathname.endsWith('/v3.0/expanded-search')) {
      const q = (url.searchParams.get('q') || '').toLowerCase()
      if (q.includes('josiah') && q.includes('carberry')) {
        return fixtureMatch('orcid/expanded-search-josiah-carberry.json')
      }
      if (q.includes('richard') && q.includes('hallett')) {
        return fixtureMatch('orcid/expanded-search-richard-hallett.json')
      }
      if (q === 'hallett') {
        return fixtureMatch('orcid/expanded-search-hallett.json')
      }
      if (q.includes('0000-0001-6528-2027')) {
        return fixtureMatch('orcid/expanded-search-orcid-id.json')
      }
      if (q === 'xxxxxyyyyy' || q.includes('xxxxxyyyyy')) {
        return fixtureMatch('orcid/expanded-search-empty.json')
      }
    }
  }

  const rorPathname = normalizeRorPathname(pathname)
  if (
    url.hostname === 'api.ror.org' ||
    pathname.startsWith('/api/ror/v2/')
  ) {
    const idMatch = rorPathname.match(/^\/v2\/organizations\/([^/?]+)$/)
    if (idMatch) {
      const id = decodeURIComponent(idMatch[1])
      if (id === '052gg0110') {
        return fixtureMatch('ror/organization-052gg0110.json')
      }
      if (id === '02hhf2525') {
        return fixtureMatch('ror/organization-02hhf2525.json')
      }
      if (id === '013meh722') {
        return fixtureMatch('ror/organization-013meh722.json')
      }
      if (id === '0472cxd90') {
        return fixtureMatch('ror/organization-0472cxd90.json')
      }
      if (id.toLowerCase() === 'xxxxx') {
        return fixtureMatch('ror/error-not-found.json', 404)
      }
    }

    if (rorPathname === '/v2/organizations') {
      const rawAdvancedQ = url.searchParams.get('query.advanced') || ''
      const advancedQ = decodeQueryParam(rawAdvancedQ)
      if (advancedQ === 'external_ids.all:100011199') {
        return fixtureMatch('ror/search-fundref-100011199.json')
      }
      if (advancedQ === 'external_ids.all:100011105') {
        return fixtureMatch('ror/search-fundref-100011105-empty.json')
      }

      const rawQ = url.searchParams.get('query') || ''
      const q = decodeQueryParam(rawQ)
      if (q === 'oxford') {
        return fixtureMatch('ror/search-query-oxford.json')
      }
      if (q.includes('052gg0110')) {
        return fixtureMatch('ror/search-query-ror-org-052gg0110.json')
      }
      if (q.toLowerCase() === 'cambridge') {
        return fixtureMatch('ror/search-query-cambridge.json')
      }
      if (q.toLowerCase() === 'springer') {
        return fixtureMatch('ror/search-query-springer.json')
      }
      if (q === 'xxx') {
        return fixtureMatch('ror/search-query-empty.json')
      }
    }
  }

  if (isDataciteHost(url.hostname) && pathname === '/claims') {
    if (upperMethod === 'GET') {
      return fixtureMatch('claims/get-ready.json')
    }

    if (upperMethod === 'POST') {
      try {
        if (bodyText) JSON.parse(bodyText)
      } catch {
        return fixtureMatch('claims/post-invalid-body.json', 400)
      }
      return fixtureMatch('claims/post-waiting.json', 202)
    }

    return null
  }

  if (isDataciteHost(url.hostname) && pathname.startsWith('/claims/')) {
    if (upperMethod === 'DELETE') {
      return fixtureMatch('claims/delete.json')
    }
    return null
  }

  if (isDataciteHost(url.hostname) && pathname === '/dois') {
    const rawQuery = url.searchParams.get('query')
    if (rawQuery == null) return null

    const queryDecoded = decodeQueryParam(rawQuery)
    const facets = url.searchParams.get('facets') || ''

    if (queryDecoded === 'xxxxxxxxxxxx' && !facets) {
      return fixtureMatch('jsonapi/dois-query-empty.json')
    }

    if (queryDecoded.includes('10.4224/xxxxx')) {
      return fixtureMatch('jsonapi/dois-query-empty.json')
    }

    if (queryDecoded === 'climate') {
      if (facets) {
        return fixtureMatch('jsonapi/dois-query-climate-facets.json')
      }
      const pageNum = url.searchParams.get('page[number]') || '1'
      if (pageNum === '2') {
        return fixtureMatch('jsonapi/dois-query-climate-page2.json')
      }
      return fixtureMatch('jsonapi/dois-query-climate-page1.json')
    }

    if (queryDecoded.includes('0000-0001-6528-2027')) {
      if (facets.includes('citation_count')) {
        return fixtureMatch('jsonapi/dois-facets-person-0000-0001-6528-2027.json')
      }
      if (queryDecoded.includes('AND (datacite)')) {
        if (facets) {
          return fixtureMatch('jsonapi/dois-facets-person-filter-datacite.json')
        }
        return fixtureMatch('jsonapi/dois-query-empty.json')
      }
      if (facets) {
        return fixtureMatch('jsonapi/dois-facets-person-default.json')
      }
      return fixtureMatch('jsonapi/dois-person-works-multi.json')
    }

    if (queryDecoded.includes('10.7272/q6g15xs4')) {
      return fixtureMatch('jsonapi/doi-10.7272-q6g15xs4.json')
    }

    if (queryDecoded.includes('10.17863/cam.10544')) {
      return fixtureMatch('jsonapi/doi-10.17863-cam.10544.json')
    }

    if (queryDecoded.includes('ror.org/013meh722') && queryDecoded.toLowerCase().includes('cambridge')) {
      if (facets) {
        return fixtureMatch('jsonapi/dois-org-013meh722-filter-cambridge-facets.json')
      }
      return fixtureMatch('jsonapi/dois-org-013meh722-filter-cambridge.json')
    }

    return null
  }

  if (isDataciteHost(url.hostname) && pathname.startsWith('/text/x-bibliography/')) {
    return fixtureMatch('text/bibliography-nexus-head-ct.txt')
  }

  return null
}

module.exports = {
  matchRequest,
  fixtureToResponse,
  readFixtureJson,
  readFixtureContent,
  isApiRequestUrl,
  toAbsoluteUrl,
  fixturesRoot,
}
