import { gql } from '@apollo/client'

export const CROSSREF_FUNDER_GQL = gql`
  query getOrganizationQuery($crossrefFunderId: ID) {
    organization(crossrefFunderId: $crossrefFunderId) {
      id
    }
  }
`