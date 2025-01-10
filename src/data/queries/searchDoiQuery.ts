import { gql, useQuery as useGQLQuery } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { PageInfo, Works } from 'src/data/types'
import { workFragment, workConnection } from 'src/data/queries/queryFragments'
import { mapJsonToWork } from 'src/utils/helpers'

function buildDoiSearchParams(variables: QueryVar): URLSearchParams {
  const query = variables.query +
    (variables.language ? ' AND language:' + variables.language : '') +
    (variables.registrationAgency ? ' AND agency:' + variables.registrationAgency : '')

  const searchParams = new URLSearchParams({
    query,
    include: 'client',
    affiliation: 'false',
    publisher: 'false',
    'disable-facets': 'true',
    include_other_registration_agencies: 'true'
  })


  searchParams.append('page[cursor]', variables.cursor || '1')
  if (variables.license) searchParams.append('license', variables.license)
  if (variables.published) searchParams.append('published', variables.published)
  if (variables.resourceTypeId) searchParams.append('resource-type-id', variables.resourceTypeId)
  if (variables.fieldOfScience) searchParams.append('field-of-science', variables.fieldOfScience)
  if (variables.clientType) searchParams.append('client-type', variables.clientType)

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
  query: string
  cursor?: string
  published?: string
  resourceTypeId?: string
  language?: string
  fieldOfScience?: string
  license?: string
  registrationAgency?: string
  clientType?: string
}


function getPageInfo(links: { self: string, next?: string }): PageInfo {
  if (!links.next) return { endCursor: '', hasNextPage: false };

  const url = new URL(links.next);
  const cursor = url.searchParams.get("page[cursor]")
  if (!cursor) return { endCursor: '', hasNextPage: false };

  return { endCursor: cursor, hasNextPage: true }
}
