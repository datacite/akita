import { gql } from '@apollo/client'
import apolloClient from 'src/utils/apolloClient/apolloClient'


export async function fetchGrid(variables: QueryVar) {
  const { data, error } = await apolloClient.query<QueryData, QueryVar>({
    query: GRID_GQL,
    variables,
    errorPolicy: 'all'
  })

  return { data, error }
}


export const GRID_GQL = gql`
  query getGridQuery($gridId: ID) {
    organization(gridId: $gridId) {
      id
    }
  }
`

export interface QueryVar {
  gridId: string
}

export interface QueryData {
  organization: { id: string }
}
