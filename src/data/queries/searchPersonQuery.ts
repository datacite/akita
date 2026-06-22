import { useQuery } from '@tanstack/react-query'
import { People } from 'src/data/types'
import { mapSearchJsonToPerson } from 'src/utils/helpers'
import { ORCID_API_URL } from 'src/data/constants'

function buildSearchParams(variables: QueryVar): URLSearchParams {
  return new URLSearchParams({
    q: variables.query,
    rows: '25',
    start: variables.cursor || '0'
  })
}

function convertToQueryData(json: any, pageStr: string): QueryData {
  const page = Number.parseInt(pageStr, 10)
  const totalCount = Number.parseInt(json['num-found'], 10)
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
      `${ORCID_API_URL}/expanded-search?${searchParams.toString()}`,
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


export interface QueryData {
  people: People
}

export interface QueryVar {
  query: string
  cursor?: string
}
