/**
 * Declarative manifest of Cypress fixtures that can be refreshed from live APIs.
 * Used by scripts/update-cypress-fixtures.cjs — see `yarn fixtures:update`.
 */

const DEFAULT_FACETS = [
  'published',
  'resourceTypes',
  'languages',
  'licenses_with_missing',
  'fieldsOfScience',
  'affiliations',
  'repositories',
  'registrationAgencies',
  'authors',
  'creatorsAndContributors',
  'clientTypes',
  'clients',
].join(',')

const METRICS_FACETS = [
  'citation_count',
  'view_count',
  'download_count',
  'content_url_count',
  'open_licenses',
  'open_licenses_count',
].join(',')

/** @param {Record<string, string | undefined>} env */
function dataciteBase(env) {
  return (env.NEXT_PUBLIC_API_URL || 'https://api.stage.datacite.org').replace(/\/$/, '')
}

/** @param {Record<string, string | undefined>} env */
function orcidBase(env) {
  return (env.NEXT_PUBLIC_ORCID_API_URL || 'https://pub.sandbox.orcid.org/v3.0').replace(/\/$/, '')
}

const ROR_BASE = 'https://api.ror.org/v2'

/** @type {Array<{
 *   fixture: string,
 *   updatable?: boolean,
 *   method?: string,
 *   headers?: Record<string, string>,
 *   expectStatus?: number,
 *   contentType?: 'json' | 'text',
 *   url?: string,
 *   getUrl?: (env: Record<string, string | undefined>) => string,
 * }>} */
const manifest = [
  // DataCite — works search
  {
    fixture: 'jsonapi/dois-query-climate-page1.json',
    updatable: true,
    getUrl: (env) =>
      `${dataciteBase(env)}/dois?${new URLSearchParams({
        query: 'climate',
        include: 'client',
        affiliation: 'false',
        publisher: 'false',
        'disable-facets': 'true',
        include_other_registration_agencies: 'true',
        'page[number]': '1',
        sort: 'relevance',
      }).toString()}`,
    headers: { accept: 'application/vnd.api+json' },
  },
  {
    fixture: 'jsonapi/dois-query-climate-page2.json',
    updatable: true,
    getUrl: (env) =>
      `${dataciteBase(env)}/dois?${new URLSearchParams({
        query: 'climate',
        include: 'client',
        affiliation: 'false',
        publisher: 'false',
        'disable-facets': 'true',
        include_other_registration_agencies: 'true',
        'page[number]': '2',
        sort: 'relevance',
      }).toString()}`,
    headers: { accept: 'application/vnd.api+json' },
  },
  {
    fixture: 'jsonapi/dois-query-climate-facets.json',
    updatable: true,
    getUrl: (env) =>
      `${dataciteBase(env)}/dois?${new URLSearchParams({
        query: 'climate',
        facets: DEFAULT_FACETS,
        affiliation: 'false',
        publisher: 'false',
        'disable-facets': 'false',
        include_other_registration_agencies: 'true',
        'page[size]': '0',
      }).toString()}`,
    headers: { accept: 'application/vnd.api+json' },
  },
  {
    fixture: 'jsonapi/doi-10.7272-q6g15xs4.json',
    updatable: true,
    getUrl: (env) =>
      `${dataciteBase(env)}/dois?${new URLSearchParams({
        query: 'uid:"10.7272/q6g15xs4"',
        include: 'client',
        affiliation: 'false',
        publisher: 'true',
        'disable-facets': 'true',
        include_other_registration_agencies: 'true',
        detail: 'true',
      }).toString()}`,
    headers: { accept: 'application/vnd.api+json' },
  },
  {
    fixture: 'jsonapi/doi-10.17863-cam.10544.json',
    updatable: true,
    getUrl: (env) =>
      `${dataciteBase(env)}/dois?${new URLSearchParams({
        query: 'uid:"10.17863/cam.10544"',
        include: 'client',
        affiliation: 'false',
        publisher: 'true',
        'disable-facets': 'true',
        include_other_registration_agencies: 'true',
        detail: 'true',
      }).toString()}`,
    headers: { accept: 'application/vnd.api+json' },
  },
  {
    fixture: 'jsonapi/dois-person-works-multi.json',
    updatable: true,
    getUrl: (env) =>
      `${dataciteBase(env)}/dois?${new URLSearchParams({
        query:
          'creators_and_contributors.nameIdentifiers.nameIdentifier:(0000-0001-6528-2027 OR "https://orcid.org/0000-0001-6528-2027")',
        include: 'client',
        affiliation: 'false',
        publisher: 'false',
        'disable-facets': 'true',
        include_other_registration_agencies: 'true',
        'page[number]': '1',
        sort: 'relevance',
      }).toString()}`,
    headers: { accept: 'application/vnd.api+json' },
  },
  {
    fixture: 'jsonapi/dois-facets-person-0000-0001-6528-2027.json',
    updatable: true,
    getUrl: (env) =>
      `${dataciteBase(env)}/dois?${new URLSearchParams({
        query:
          'creators_and_contributors.nameIdentifiers.nameIdentifier:(0000-0001-6528-2027 OR "https://orcid.org/0000-0001-6528-2027")',
        facets: METRICS_FACETS,
        affiliation: 'false',
        publisher: 'false',
        'disable-facets': 'false',
        include_other_registration_agencies: 'true',
        'page[size]': '0',
      }).toString()}`,
    headers: { accept: 'application/vnd.api+json' },
  },
  {
    fixture: 'jsonapi/dois-facets-person-default.json',
    updatable: true,
    getUrl: (env) =>
      `${dataciteBase(env)}/dois?${new URLSearchParams({
        query:
          'creators_and_contributors.nameIdentifiers.nameIdentifier:(0000-0001-6528-2027 OR "https://orcid.org/0000-0001-6528-2027")',
        facets: DEFAULT_FACETS,
        affiliation: 'false',
        publisher: 'false',
        'disable-facets': 'false',
        include_other_registration_agencies: 'true',
        'page[size]': '0',
      }).toString()}`,
    headers: { accept: 'application/vnd.api+json' },
  },
  {
    fixture: 'jsonapi/dois-facets-person-filter-datacite.json',
    updatable: true,
    getUrl: (env) =>
      `${dataciteBase(env)}/dois?${new URLSearchParams({
        query:
          'creators_and_contributors.nameIdentifiers.nameIdentifier:(0000-0001-6528-2027 OR "https://orcid.org/0000-0001-6528-2027") AND (datacite)',
        facets: DEFAULT_FACETS,
        affiliation: 'false',
        publisher: 'false',
        'disable-facets': 'false',
        include_other_registration_agencies: 'true',
        'page[size]': '0',
      }).toString()}`,
    headers: { accept: 'application/vnd.api+json' },
  },
  {
    fixture: 'jsonapi/dois-org-013meh722-filter-cambridge.json',
    updatable: true,
    getUrl: (env) =>
      `${dataciteBase(env)}/dois?${new URLSearchParams({
        query:
          '(organization_id:"ror.org/013meh722" OR provider.ror_id:"https://ror.org/013meh722" OR affiliation_id:"ror.org/013meh722" OR related_dmp_organization_id:"ror.org/013meh722" OR funder_rors:"https://ror.org/013meh722" OR funder_parent_rors:"https://ror.org/013meh722") AND (cambridge)',
        include: 'client',
        affiliation: 'false',
        publisher: 'false',
        'disable-facets': 'true',
        include_other_registration_agencies: 'true',
        'page[number]': '1',
        sort: 'relevance',
      }).toString()}`,
    headers: { accept: 'application/vnd.api+json' },
  },
  {
    fixture: 'jsonapi/dois-org-013meh722-filter-cambridge-facets.json',
    updatable: true,
    getUrl: (env) =>
      `${dataciteBase(env)}/dois?${new URLSearchParams({
        query:
          '(organization_id:"ror.org/013meh722" OR provider.ror_id:"https://ror.org/013meh722" OR affiliation_id:"ror.org/013meh722" OR related_dmp_organization_id:"ror.org/013meh722" OR funder_rors:"https://ror.org/013meh722" OR funder_parent_rors:"https://ror.org/013meh722") AND (cambridge)',
        facets: DEFAULT_FACETS,
        affiliation: 'false',
        publisher: 'false',
        'disable-facets': 'false',
        include_other_registration_agencies: 'true',
        'page[size]': '0',
      }).toString()}`,
    headers: { accept: 'application/vnd.api+json' },
  },
  {
    fixture: 'text/bibliography-nexus-head-ct.txt',
    updatable: true,
    contentType: 'text',
    getUrl: (env) =>
      `${dataciteBase(env)}/text/x-bibliography/10.7272/q6g15xs4?${new URLSearchParams({
        style: 'ieee',
        lang: 'en-US',
      }).toString()}`,
    headers: { accept: 'text/plain' },
  },

  // ORCID
  {
    fixture: 'orcid/0000-0001-6528-2027-person.json',
    updatable: true,
    getUrl: (env) => `${orcidBase(env)}/0000-0001-6528-2027/person`,
    headers: { 'Content-type': 'application/json' },
  },
  {
    fixture: 'orcid/0000-0001-6528-2027-employments.json',
    updatable: true,
    getUrl: (env) => `${orcidBase(env)}/0000-0001-6528-2027/employments`,
    headers: { 'Content-type': 'application/json' },
  },
  {
    fixture: 'orcid/expanded-search-josiah-carberry.json',
    updatable: true,
    getUrl: (env) =>
      `${orcidBase(env)}/expanded-search?${new URLSearchParams({
        q: 'Josiah Carberry',
        rows: '25',
        start: '0',
      }).toString()}`,
    headers: { 'Content-type': 'application/json' },
  },
  {
    fixture: 'orcid/expanded-search-richard-hallett.json',
    updatable: true,
    getUrl: (env) =>
      `${orcidBase(env)}/expanded-search?${new URLSearchParams({
        q: 'richard hallett',
        rows: '25',
        start: '0',
      }).toString()}`,
    headers: { 'Content-type': 'application/json' },
  },
  {
    fixture: 'orcid/expanded-search-hallett.json',
    updatable: true,
    getUrl: (env) =>
      `${orcidBase(env)}/expanded-search?${new URLSearchParams({
        q: 'hallett',
        rows: '25',
        start: '0',
      }).toString()}`,
    headers: { 'Content-type': 'application/json' },
  },
  {
    fixture: 'orcid/expanded-search-orcid-id.json',
    updatable: true,
    getUrl: (env) =>
      `${orcidBase(env)}/expanded-search?${new URLSearchParams({
        q: '0000-0001-6528-2027',
        rows: '25',
        start: '0',
      }).toString()}`,
    headers: { 'Content-type': 'application/json' },
  },

  // ROR
  {
    fixture: 'ror/organization-052gg0110.json',
    updatable: true,
    url: `${ROR_BASE}/organizations/052gg0110`,
  },
  {
    fixture: 'ror/organization-02hhf2525.json',
    updatable: true,
    url: `${ROR_BASE}/organizations/02hhf2525`,
  },
  {
    fixture: 'ror/organization-013meh722.json',
    updatable: true,
    url: `${ROR_BASE}/organizations/013meh722`,
  },
  {
    fixture: 'ror/organization-0472cxd90.json',
    updatable: true,
    url: `${ROR_BASE}/organizations/0472cxd90`,
  },
  {
    fixture: 'ror/search-query-oxford.json',
    updatable: true,
    url: `${ROR_BASE}/organizations?${new URLSearchParams({ query: 'oxford' }).toString()}`,
  },
  {
    fixture: 'ror/search-query-ror-org-052gg0110.json',
    updatable: true,
    url: `${ROR_BASE}/organizations?${new URLSearchParams({ query: 'ror.org/052gg0110' }).toString()}`,
  },
  {
    fixture: 'ror/search-query-cambridge.json',
    updatable: true,
    url: `${ROR_BASE}/organizations?${new URLSearchParams({ query: 'cambridge' }).toString()}`,
  },
  {
    fixture: 'ror/search-query-springer.json',
    updatable: true,
    url: `${ROR_BASE}/organizations?${new URLSearchParams({ query: 'springer' }).toString()}`,
  },
  {
    fixture: 'ror/search-fundref-100011199.json',
    updatable: true,
    url: `${ROR_BASE}/organizations?${new URLSearchParams({
      'query.advanced': 'external_ids.all:100011199',
    }).toString()}`,
  },

  // Static fixtures (documented, not refreshed from live APIs)
  { fixture: 'jsonapi/related-graph-empty.json', updatable: false },
  { fixture: 'providers/empty.json', updatable: false },
  { fixture: 'jsonapi/dois-query-empty.json', updatable: false },
  { fixture: 'ror/search-fundref-100011105-empty.json', updatable: false },
  { fixture: 'ror/search-query-empty.json', updatable: false },
  { fixture: 'orcid/expanded-search-empty.json', updatable: false },
  { fixture: 'orcid/error-not-found.json', updatable: false },
  { fixture: 'ror/error-not-found.json', updatable: false },
  { fixture: 'claims/get-ready.json', updatable: false },
  { fixture: 'claims/post-waiting.json', updatable: false },
  { fixture: 'claims/post-invalid-body.json', updatable: false },
  { fixture: 'claims/delete.json', updatable: false },
]

module.exports = { manifest, dataciteBase, orcidBase, ROR_BASE }
