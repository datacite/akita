import { gql, useQuery } from '@apollo/client'
import { Claim } from 'src/data/types'


export function useGetClaimQuery(variables: QueryVar) {
  const { loading, data, error, refetch } = useQuery<QueryData, QueryVar>(
    GET_CLAIM_GQL,
    {
      variables,
      errorPolicy: 'all'
    }
  )

  return { loading, data, error, refetch }
}


export const GET_CLAIM_GQL = gql`
  query getDoiClaimQuery(
    $id: ID!
  ) {
    work(id: $id) {
     id
     registrationAgency {
       id
     }
     claims {
       id
       sourceId
       state
       claimAction
       claimed
       errorMessages {
         status
         title
       }
     }
    }
  }
`

export const CREATE_CLAIM_GQL = gql`
  mutation createClaim($doi: ID!, $sourceId: String!) {
    createClaim(doi: $doi, sourceId: $sourceId) {
      claim {
        id
        sourceId
        state
        claimAction
        claimed
        errorMessages {
          status
          title
        }
      }
      errors {
        status
        source
        title
      }
    }
  }
`

export const DELETE_CLAIM_GQL = gql`
  mutation deleteClaim($id: ID!) {
    deleteClaim(id: $id) {
      claim {
        id
        sourceId
        state
        claimAction
        claimed
        errorMessages {
          status
          title
        }
      }
      errors {
        status
        source
        title
      }
    }
  }
`

export interface QueryData {
  work: {
    id: string
    registrationAgency: { id: string }
    claims: Claim[]
  }
}

export interface QueryVar {
  id: string
}


