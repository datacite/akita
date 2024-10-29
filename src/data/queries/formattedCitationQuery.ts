import { gql, useQuery } from "@apollo/client"
import { FormattedCitation } from "src/data/types"


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

export interface QueryVar {
  id: string
  style: string
  locale?: string
}

export interface QueryData {
  work: FormattedCitation
}
