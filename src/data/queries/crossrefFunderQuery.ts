import { gql } from '@apollo/client'
import apolloClient from 'src/utils/apolloClient/apolloClient'

export async function fetchCrossrefFunder(crossrefFunderId: string) {
  const { data } = await apolloClient.query({
    query: CROSSREF_FUNDER_GQL,
    variables: { id: crossrefFunderId },
    errorPolicy: 'all'
  })

  return { data }
}

export const CROSSREF_FUNDER_GQL = gql`
  query getOrganizationQuery($crossrefFunderId: ID) {
    organization(crossrefFunderId: $crossrefFunderId) {
      id
    }
  }
`
