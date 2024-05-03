import { gql } from '@apollo/client'
import { People } from 'src/data/types'


export const SEARCH_PERSON_QUERY = gql`
  query getSearchPersonQuery($query: String, $cursor: String) {
    people(first: 25, query: $query, after: $cursor) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        id
        name
        givenName
        familyName
        alternateName
      }
    }
  }
`


export interface QueryData {
  people: People
}

export interface QueryVar {
  query: string
  cursor?: string
}
