import { gql, useQuery as useGQLQuery } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { PageInfo, Works } from 'src/data/types'
import { workFragment, workConnection } from 'src/data/queries/queryFragments'
import { mapJsonToWork, cursorToPage } from 'src/utils/helpers'
import { DATACITE_API_URL } from 'src/data/constants'


function extractRORId(rorString: string): string {
  return rorString.replace('https://', '').replace('ror.org/', '')
}

/**
 * Quotes an identifier for safe use in Lucene/OpenSearch queries.
 * Wraps the identifier in double quotes to prevent special character issues.
 */
function quoteIdentifier(identifier: string): string {
  return `"${identifier}"`
}

const VALID_CONNECTION_TYPES = [
  'references',
  'citations',
  'parts',
  'partOf',
  'versions',
  'versionOf',
  'allRelated',
  'otherRelated',
];

function buildRelatedDoiQuery(relatedDoi: string | undefined, uidList: string[] | undefined, connectionType="allRelated" ): string {
  if (!relatedDoi) return ''
  // if the connection type is not in the map, return an empty string
  if (!VALID_CONNECTION_TYPES.includes(connectionType)) return ''

  const doi = relatedDoi;
  const quotedDoi = quoteIdentifier(doi);
  const baseURI = "https://doi.org/";
  const OR = " OR ";
  const httpBaseURI = "http://doi.org/"; // Added HTTP base URI

  const relatedIdentifiers = [
    quoteIdentifier(`${baseURI}${doi}`),
    quotedDoi,
    quoteIdentifier(`${httpBaseURI}${doi}`) // Added HTTP version
  ];
  const relatedIdentifierPart = `related_identifiers.relatedIdentifier:(${relatedIdentifiers.join(OR)})`;
  const uidPart = uidList && uidList.length > 0
    ? `uid:(${uidList.join(OR)})`
    : '';

  // Map connection types to their corresponding query parts
  const queryPartsByType = {
    references: [`citation_ids:${quotedDoi}`],
    citations: [`reference_ids:${quotedDoi}`],
    parts: [`part_of_ids:${quotedDoi}`],
    partOf: [`part_ids:${quotedDoi}`],
    versions: [`version_of_ids:${quotedDoi}`],
    versionOf: [`versions_ids:${quotedDoi}`],
    allRelated: [
      relatedIdentifierPart,
      `reference_ids:${quotedDoi}`,
      `citation_ids:${quotedDoi}`,
      `part_ids:${quotedDoi}`,
      `part_of_ids:${quotedDoi}`,
      `versions_ids:${quotedDoi}`,
      `version_of_ids:${quotedDoi}`,
      uidPart
    ],
    otherRelated: [
      relatedIdentifierPart,
      uidPart
    ]
  };

  const negativeOtherRelationsParts = [
    `reference_ids:${quotedDoi}`,
    `citation_ids:${quotedDoi}`,
    `part_ids:${quotedDoi}`,
    `part_of_ids:${quotedDoi}`,
    `versions_ids:${quotedDoi}`,
    `version_of_ids:${quotedDoi}`,
  ];

  const selectedParts = queryPartsByType[connectionType as keyof typeof queryPartsByType] || [];
  const positivePart = selectedParts.filter(Boolean).join(OR);
  const negativePart = negativeOtherRelationsParts.filter(Boolean).join(OR);

  if (connectionType === "otherRelated") {
    return `((${positivePart}) AND NOT (${negativePart}))`;
  }
  // By default only return positive part
  return `(${positivePart})`;
}

export const VALID_ORGANIZATION_RELATION_TYPES = [
  'fundedBy',
  'createdBy',
  'affiliatedResearcher',
  'dmp',
  'allRelated'
] as const

function buildOrgQuery(rorId: string | undefined, organizationRelationType: string | undefined): string {
  if (!rorId) return ''
  const requestedRelationType = organizationRelationType ?? 'allRelated'
  const relationType = VALID_ORGANIZATION_RELATION_TYPES.includes(requestedRelationType as typeof VALID_ORGANIZATION_RELATION_TYPES[number])
    ? requestedRelationType
    : 'allRelated'

  const id = 'ror.org/' + extractRORId(rorId)
  const urlId = quoteIdentifier(`https://${id}`)
  const OR = ' OR '

  const queryPartsByType: Record<typeof VALID_ORGANIZATION_RELATION_TYPES[number], string[]> = {
    fundedBy: [`funder_rors:${urlId}`, `funder_parent_rors:${urlId}`],
    createdBy: [
      `organization_id:${id}`,
      `provider.ror_id:${urlId}`,
    ],
    affiliatedResearcher: [`affiliation_id:${id}`],
    dmp: [`related_dmp_organization_id:${id}`],
    allRelated: [
      `organization_id:${id}`,
      `provider.ror_id:${urlId}`,
      `affiliation_id:${id}`,
      `related_dmp_organization_id:${id}`,
      `funder_rors:${urlId}`,
      `funder_parent_rors:${urlId}`
    ]
  }

  const selectedParts = queryPartsByType[relationType as keyof typeof queryPartsByType] ?? queryPartsByType.allRelated
  const positivePart = selectedParts.filter(Boolean).join(OR)
  return `(${positivePart})`
}

export function buildQuery(variables: QueryVar): string {
  const queryParts = [
    variables.query,
    buildOrgQuery(variables.rorId || undefined, variables.organizationRelationType || "allRelated"),
    buildRelatedDoiQuery(variables.relatedDoi, variables.uidList || [], variables.connectionType || "allRelated"),
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


export function useSearchDoiQuery(variables: QueryVar, count?: number) {
  const { isPending, data, error } = useQuery({ queryKey: ['doiSearch', variables, count], queryFn: async () => fetchDois(variables, count) })

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
  organizationRelationType?: string
  relatedDoi?: string
  connectionType?: string
  uidList?: string[]
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
