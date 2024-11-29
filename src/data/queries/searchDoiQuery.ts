import { gql, useQuery as useGQLQuery } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { PageInfo, Works } from 'src/data/types'
import { workFragment, workConnection } from 'src/data/queries/queryFragments'
import { mapJsonToWork } from 'src/utils/helpers'

function buildDoiSearchParams(variables: QueryVar): URLSearchParams {
  const searchParams = new URLSearchParams({
    query: variables.query,
    include: 'client',
    affiliation: 'false',
    publisher: 'false',
    // 'disable-facets': 'false',
    include_other_registration_agencies: 'true'
  })


  searchParams.append('page[cursor]', variables.cursor || '1')
  if (variables.license) searchParams.append('license', variables.license)
  if (variables.published) searchParams.append('published', variables.published)
  if (variables.resourceTypeId) searchParams.append('resource-type-id', variables.resourceTypeId)
  if (variables.fieldOfScience) searchParams.append('field-of-science', variables.fieldOfScience)
  // if (variables.registrationAgency) searchParams.append('registration-agency', variables.registrationAgency)
  // if (variables.language) searchParams.append('language', variables.language)

  return searchParams
}


function convertToQueryData(json: any): QueryData {
  const nodes = json.data as any[]
  const { included, meta, links } = json

  // Missing authors, creators & contributors, language, registration agency, repositories, and multilevel
  return {
    works: {
      totalCount: meta.total,
      pageInfo: getPageInfo(links),
      published: meta.published,
      resourceTypes: meta.resourceTypes.slice(0, 10),
      languages: [].slice(0, 10),
      licenses: meta.licenses.slice(0, 10),
      fieldsOfScience: meta.fieldsOfScience.slice(0, 10),
      affiliations: meta.affiliations,
      repositories: [],
      registrationAgencies: [],
      authors: [].slice(0, 10),
      creatorsAndContributors: [].slice(0, 10),

      nodes: nodes.map(w => mapJsonToWork(w, included)),
      personToWorkTypesMultilevel: []
    }
  }
}

export async function fetchDois(variables: QueryVar) {
  try {
    const options = {
      method: 'GET',
      headers: { accept: 'application/vnd.api+json' }
    }
    const searchParams = buildDoiSearchParams(variables)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dois?${searchParams.toString()}`,
      options
    )
    const json = await res.json()

    const data = convertToQueryData(json)
    return { data }
  } catch (error) {
    return { error }
  }
}

// Temporary name until all the related works also use the REST API
export function useSearchDoiQueryREST(variables: QueryVar) {
  const { isPending, data, error } = useQuery({ queryKey: ['doiSearch', variables], queryFn: async () => fetchDois(variables) })

  return { loading: isPending, data: data?.data, error }
}


export function useSearchDoiQuery(variables: QueryVar) {
  const { loading, data, error } = useGQLQuery<QueryData, QueryVar>(
    SEARCH_DOI_QUERY,
    {
      variables,
      errorPolicy: 'all'
    }
  )

  console.log(data)
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
  works: Works
}

export interface QueryVar {
  query: string
  cursor?: string
  published?: string
  resourceTypeId?: string
  language?: string
  fieldOfScience?: string
  license?: string
  registrationAgency?: string
}


function getPageInfo(links: { self: string, next?: string }): PageInfo {
  if (!links.next) return { endCursor: '', hasNextPage: false };

  const url = new URL(links.next);
  const cursor = url.searchParams.get("page[cursor]")
  if (!cursor) return { endCursor: '', hasNextPage: false };

  return { endCursor: cursor, hasNextPage: true }
}
