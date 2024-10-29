import { gql, useQuery } from '@apollo/client'
import { Organizations } from 'src/data/types'


export default function useSearchOrganizationQuery(variables: QueryVar) {
  const { loading, data, error } = useQuery<QueryData, QueryVar>(
    SEARCH_ORGANIZATIONS_GQL,
    {
      variables,
      errorPolicy: 'all'
    }
  )

  return { loading, data, error }
}


export const SEARCH_ORGANIZATIONS_GQL = gql`
  query searchOrganizationsQuery(
    $query: String
    $cursor: String
    $types: String
    $country: String
  ) {
    organizations(
      query: $query
      after: $cursor
      types: $types
      country: $country
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      types {
        id
        count
        title
      }
      countries {
        id
        count
        title
      }
      nodes {
        id
        name
        memberId
        memberRoleId
        alternateName
        inceptionYear
        types
        url
        wikipediaUrl
        country {
          id
          name
        }
        identifiers {
          identifier
          identifierType
        }
      }
    }
  }
`


export interface QueryData {
  organizations: Organizations
}

export interface QueryVar {
  query: string
  cursor?: string
  types?: string
  country?: string
}
