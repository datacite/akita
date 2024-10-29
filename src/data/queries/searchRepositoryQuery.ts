import { gql, useQuery } from '@apollo/client'
import { Repositories } from 'src/data/types'

export function useSearchRepositoryQuery(variables: QueryVar) {
  const { loading, data, error } = useQuery<QueryData, QueryVar>(
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
