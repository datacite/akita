import { gql } from '@apollo/client'

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