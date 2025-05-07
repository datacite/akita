import { gql, useQuery as useGQLQuery } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { PageInfo, Works } from 'src/data/types'
import { workFragment, workConnection } from 'src/data/queries/queryFragments'
import { mapJsonToWork, cursorToPage } from 'src/utils/helpers'
import { DATACITE_API_URL } from 'src/data/constants'


function extractRORId(rorString: string): string {
  return rorString.replace('https://', '').replace('ror.org/', '')
}

function buildRelatedDoiQuery(relatedDoi: string | undefined, uidList: string[] | undefined): string {
  if (!relatedDoi) return ''
  const doi = relatedDoi;
  const baseURI = "https://doi.org/";
  const OR = " OR ";
  const httpBaseURI = "http://doi.org/"; // Added HTTP base URI

  const relatedIdentifiers = [
    `"${baseURI}${doi}"`,
    `"${doi}"`,
    `"${httpBaseURI}${doi}"` // Added HTTP version
  ];
  const relatedIdentifierPart = `related_identifiers.relatedIdentifier:(${relatedIdentifiers.join(OR)})`;

  const idParts = [
    `reference_ids:${doi}`,
    `citation_ids:${doi}`,
    `part_ids:${doi}`,
    `part_of_ids:${doi}`,
    `versions_ids:${doi}`,
    `version_of_ids:${doi}`
  ];

  const uidPart = uidList && uidList.length > 0 ? `uid:(${uidList.join(OR)})` : '';

  const allParts = [relatedIdentifierPart, ...idParts, uidPart].filter(Boolean);

  const queryString = allParts.join(OR);

  const encodedQueryString = encodeURIComponent(queryString);
  return encodedQueryString;
}

function buildOrgQuery(rorId: string | undefined, rorFundingIds: string[]): string {
  if (!rorId) return ''
  const id = 'ror.org/' + extractRORId(rorId)
  const urlId = `"https://${id}"`
  const rorFundingIdsQuery = rorFundingIds.map(id => '"https://doi.org/' + id + '"').join(' OR ')
  return `((organization_id:${id} OR affiliation_id:${id} OR related_dmp_organization_id:${id} OR provider.ror_id:${urlId}) OR funding_references.funderIdentifier:(${urlId} ${rorFundingIdsQuery && `OR ${rorFundingIdsQuery}`}))`
}

export function buildQuery(variables: QueryVar): string {
  const queryParts = [
    variables.query,
    buildOrgQuery(variables.rorId, variables.rorFundingIds || []),
    variables.language ? `language:${variables.language}` : '',
    variables.registrationAgency ? `agency:${variables.registrationAgency}` : '',
    variables.userId ? `creators_and_contributors.nameIdentifiers.nameIdentifier:(${variables.userId} OR "https://orcid.org/${variables.userId}")` : '',
    // The contributors facet doesn't capture all the works like in the userId
    // If we were to use wildcards then the facet counts mismatch the results
    variables.contributor ? `creators_and_contributors.nameIdentifiers.nameIdentifier:"https://orcid.org/${variables.contributor}"` : '',
    variables.filterQuery
  ].filter(Boolean);
  const query = queryParts.join(' AND ')

  return query
}


export function appendFacets(variables: QueryVar, searchParams: URLSearchParams) {
  if (variables.license) searchParams.append('license', variables.license)
  if (variables.published) searchParams.append('published', variables.published)
  if (variables.resourceTypeId) searchParams.append('resource-type-id', variables.resourceTypeId)
  if (variables.fieldOfScience) searchParams.append('field-of-science', variables.fieldOfScience)
  if (variables.clientId) searchParams.append('client-id', variables.clientId)
  if (variables.clientType) searchParams.append('client-type', variables.clientType)
}

export const VALID_SORT_OPTIONS = [
  'relevance',
  'name', '-name',
  'created', '-created',
  'updated', '-updated',
  'published', '-published',
  'view-count', '-view-count',
  'download-count', '-download-count',
  'citation-count', '-citation-count',
  'title', '-title'
] as const

export type SortOption = typeof VALID_SORT_OPTIONS[number]

function isValidSortOption(sort: string): sort is SortOption {
  return VALID_SORT_OPTIONS.includes(sort as SortOption)
}

function buildDoiSearchParams(variables: QueryVar, count?: number): URLSearchParams {
  const searchParams = new URLSearchParams({
    query: buildQuery(variables),
    include: 'client',
    affiliation: 'false',
    publisher: 'false',
    'disable-facets': 'true',
    include_other_registration_agencies: 'true'
  })

  if (count) searchParams.append('page[size]', count.toString())

  searchParams.append('page[number]', variables.cursor || '1')
  // Default to 'relevance' if sort is missing or invalid
  const sortValue = variables.sort && isValidSortOption(variables.sort)
    ? variables.sort
    : 'relevance'
  searchParams.append('sort', sortValue)

  appendFacets(variables, searchParams)
  return searchParams
}


function convertToQueryData(json: any): QueryData {
  const nodes = json.data as any[]
  const { included, meta, links } = json

  return {
    works: {
      totalCount: meta.total,
      pageInfo: getPageInfo(links),
      nodes: nodes.map(w => mapJsonToWork(w, included)),
    }
  }
}

export async function fetchDois(variables: QueryVar, count?: number) {
  const options = {
    method: 'GET',
    headers: { accept: 'application/vnd.api+json' }
  }
  const searchParams = buildDoiSearchParams(variables, count)

  const res = await fetch(
    `${DATACITE_API_URL}/dois?${searchParams.toString()}`,
    options
  )
  const json = await res.json()

  if (!res.ok) {
    const errorMessage = json?.errors?.title || `Request for dois failed with status: ${res.status}`;
    throw new Error(errorMessage);
  }

  const data = convertToQueryData(json)
  return { data }
}


export async function fetchDoisCitations(variables: QueryVar, count?: number) {
  const options = {
    method: 'GET',
    headers: { accept: 'text/x-bibliography' }
  }
  const searchParams = buildDoiSearchParams(variables, count)


  const res = await fetch(
    `${DATACITE_API_URL}/dois?${searchParams.toString()}`,
    options
  )

  if (!res.ok) {
    const errorMessage = `Request for dois citations failed with status: ${res.status}`;
    throw new Error(errorMessage);
  }

  const text = await res.text()
  const citationsArray = text.trim().split(/\n\n+/);

  return citationsArray
}


export function useSearchDoiQuery(variables: QueryVar) {
  const { isPending, data, error } = useQuery({ queryKey: ['doiSearch', variables], queryFn: async () => fetchDois(variables) })

  return { loading: isPending, data: data?.data, error }
}


export function useSearchDoiQueryGQL(variables: QueryVar) {
  const { loading, data, error } = useGQLQuery<QueryData, QueryVar>(
    SEARCH_DOI_QUERY,
    {
      variables,
      errorPolicy: 'all'
    }
  )

  return { loading, data, error }
}


export const SEARCH_DOI_QUERY = gql`
  query getContentQuery(
    $query: String
    $cursor: String
    $published: String
    $resourceTypeId: String
    $fieldOfScience: String
    $language: String
    $license: String
    $registrationAgency: String
  ) {
    works(
      first: 25
      query: $query
      after: $cursor
      published: $published
      resourceTypeId: $resourceTypeId
      fieldOfScience: $fieldOfScience
      language: $language
      license: $license
      registrationAgency: $registrationAgency
    ) {
      ...WorkConnectionFragment
      nodes {
        ...WorkFragment
      }
    }
  }
  ${workConnection}
  ${workFragment}
`


export interface QueryData {
  works: Pick<Works, 'nodes' | 'totalCount' | 'pageInfo'>
}

export interface QueryVar {
  query?: string
  filterQuery?: string
  rorId?: string
  rorFundingIds?: string[]
  userId?: string
  clientId?: string
  cursor?: string
  contributor?: string
  published?: string
  resourceTypeId?: string
  language?: string
  fieldOfScience?: string
  license?: string
  registrationAgency?: string
  clientType?: string
  sort?: SortOption
}


export function getPageInfo(links: { self: string, next?: string }): PageInfo {
  if (!links.next) return { endCursor: '', hasNextPage: false };

  const url = new URL(links.next);
  const pageString = url.searchParams.get("page[number]")
  if (!pageString) return { endCursor: '', hasNextPage: false };
  const page = cursorToPage(pageString)

  return { endCursor: page.toString(), hasNextPage: true }
}
