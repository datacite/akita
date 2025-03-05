import { gql, useQuery as useQueryGQL } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { Repositories } from 'src/data/types'
import { DATACITE_API_URL } from 'src/data/constants'
import { getPageInfo } from './searchDoiQuery'
import { mapJsonToRepository } from 'src/utils/helpers'

function buildRepositorySearchParams(variables: QueryVar): URLSearchParams {
  const searchParams = new URLSearchParams({
    query: variables.query,
  })

  function optionalAppend(param: string, value: string | undefined) {
    if (!value) return
    searchParams.append(param, value)
  }

  // optionalAppend('year', variables.year)
  optionalAppend('certificate', variables.certificate)
  optionalAppend('software', variables.software)
  optionalAppend('has_pid', variables.hasPid)
  optionalAppend('is_open', variables.isOpen)
  optionalAppend('is_certified', variables.isCertified)
  optionalAppend('subject_id', variables.subjectId)

  searchParams.append('page[number]', variables.cursor || '1')
  return searchParams
}

function convertToQueryData(json: any): QueryData {
  const nodes = json.data as any[]
  const { meta, links } = json

  return {
    repositories: {
      totalCount: meta.total,
      pageInfo: getPageInfo(links),
      nodes: nodes.map(r => mapJsonToRepository(r)),
      certificates: meta.certificates,
      software: meta.software
    }
  }
}


export async function fetchRepositories(variables: QueryVar) {
  const options = {
    method: 'GET',
    headers: { accept: 'application/vnd.api+json' }
  }
  const searchParams = buildRepositorySearchParams(variables)

  const res = await fetch(
    `${DATACITE_API_URL}/reference-repositories?${searchParams.toString()}`,
    options
  )
  const json = await res.json()

  if (!res.ok) {
    const errorMessage = json?.errors?.title || `Request for repositories failed with status: ${res.status}`;
    throw new Error(errorMessage);
  }

  const data = convertToQueryData(json)
  return { data }
}
export function useSearchRepositoryQuery(variables: QueryVar) {
  const { isPending, data, error } = useQuery({ queryKey: ['repositorySearch', variables], queryFn: async () => fetchRepositories(variables) })

  return { loading: isPending, data: data?.data, error }
}

export function useSearchRepositoryQueryGQL(variables: QueryVar) {
  const { loading, data, error } = useQueryGQL<QueryData, QueryVar>(
    SEARCH_REPOSITORIES_GQL,
    {
      variables,
      errorPolicy: 'all'
    }
  )

  return { loading, data, error }
}


export const SEARCH_REPOSITORIES_GQL = gql`
  query getRepositoryQuery(
    $query: String
    $cursor: String
    $certificate: String
    $software: String
    $hasPid: String
    $isOpen: String
    $isCertified: String
    $subjectId: String
  ) {
    repositories(
      query: $query
      after: $cursor
      certificate: $certificate
      software: $software
      hasPid: $hasPid
      isOpen: $isOpen
      isCertified: $isCertified
      subjectId: $subjectId
    ) {
      totalCount

      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {...repoFields}
      certificates {...facetFields}
      software {...facetFields}
    }
  }

  fragment repoFields on Repository{
    id:uid
    re3dataDoi
    clientId
    name
    language
    keyword
    subject {
      name
    }
    description
    type
    repositoryType
    url
  }

  fragment facetFields on Facet{
    id
    title
    count
  }
`


export interface QueryData {
  repositories: Repositories
}

export interface QueryVar {
  query: string
  cursor?: string
  certificate?: string
  software?: string
  hasPid?: string
  isOpen?: string
  isCertified?: string
  subjectId?: string
}
