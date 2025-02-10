import { gql, useQuery as useGQLQuery } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { parseInt } from 'lodash'
import { People } from 'src/data/types'
import { mapSearchJsonToPerson } from 'src/utils/helpers'

function buildSearchParams(variables: QueryVar): URLSearchParams {
  return new URLSearchParams({
    q: variables.query,
    rows: '25',
    start: variables.cursor || '0'
  })
}

function convertToQueryData(json: any, pageStr: string): QueryData {
  const page = parseInt(pageStr)
  const totalCount = parseInt(json['num-found'])
  return {
    people: {
      __typename: 'PersonConnectionWithTotal',
      totalCount,
      pageInfo: { endCursor: (page + 25).toString(), hasNextPage: page + 25 < totalCount },
      nodes: json['expanded-result'].map(w => mapSearchJsonToPerson(w)),
    }
  }
}

export async function fetchPeople(variables: QueryVar) {
  try {
    const options = {
      method: 'GET',
      headers: { 'Content-type': 'application/json' }
    }
    const searchParams = buildSearchParams(variables)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ORCID_API_URL}/expanded-search?${searchParams.toString()}`,
      options
    )
    const json = await res.json()

    const data = convertToQueryData(json, variables.cursor || '0')
    return { data }
  } catch (error) {
    return { error }
  }
}

export function useSearchPersonQuery(variables: QueryVar) {
  const { isPending, data, error } = useQuery({ queryKey: ['doiSearch', variables], queryFn: async () => fetchPeople(variables) })

  return { loading: isPending, data: data?.data, error }
}

export function useSearchPersonQueryGQL(variables: QueryVar) {
  const { loading, data, error } = useGQLQuery<QueryData, QueryVar>(
    SEARCH_PERSON_QUERY,
    {
      variables,
      errorPolicy: 'all'
    }
  )

  return { loading, data, error }
}


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
