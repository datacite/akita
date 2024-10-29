import { gql, useQuery } from '@apollo/client'
import { Works } from 'src/data/types'
import { workFragment, workConnection } from 'src/data/queries/queryFragments'


export function useSearchDoiQuery(variables: QueryVar) {
  const { loading, data, error } = useQuery<QueryData, QueryVar>(
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


