import { gql, useQuery } from "@apollo/client"
import { FormattedCitation } from "src/data/types"
import { useQuery as useReactQuery, UseQueryResult } from "@tanstack/react-query"
import { DATACITE_API_URL } from 'src/data/constants'

const BASE_CITATION_URL = `${DATACITE_API_URL}/text/x-bibliography/`

export interface QueryVar {
  id: string
  style: string
  locale?: string
}

export interface QueryData {
  work: FormattedCitation
}

// GraphQL query implementation
export function useFormattedCitationQuery(variables: QueryVar) {
  const { loading, data, error } = useQuery<QueryData, QueryVar>(
    FORMATTED_CITATION_GQL,
    {
      variables,
      errorPolicy: 'all'
    }
  )

  return { loading, data, error }
}

export const FORMATTED_CITATION_GQL = gql`
  query getCitationFormatter($id: ID!, $style: String!, $locale: String!) {
    work(id: $id) {
      id
      formattedCitation(style: $style, locale: $locale)
    }
  }
`

// Direct API fetch implementation
async function fetchFormattedCitation(variables: QueryVar): Promise<string> {
  const params = new URLSearchParams({
    style: variables.style,
    lang: variables.locale || 'en-US'
  })

  const url = `${BASE_CITATION_URL}${variables.id}?${params.toString()}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Citation API returned ${response.status}: ${response.statusText}`)
  }

  const text = await response.text()
  return text
}

// React Query hook
export function useDirectCitationQuery(variables: QueryVar): UseQueryResult<QueryData, Error> {
  return useReactQuery({
    queryKey: ['citation', variables.id, variables.style, variables.locale],
    queryFn: () => fetchFormattedCitation(variables),
    staleTime: 1000 * 60 * 60, // Consider citations fresh for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    select: (data) => ({
      work: {
        id: variables.id,
        formattedCitation: data
      }
    } as QueryData)
  })
}
