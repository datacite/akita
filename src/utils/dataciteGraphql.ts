import { DATACITE_API_URL } from 'src/data/constants'

export const GET_CLAIM_QUERY = `
  query getDoiClaimQuery($id: ID!) {
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

export const CREATE_CLAIM_MUTATION = `
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

export const DELETE_CLAIM_MUTATION = `
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

export interface GraphqlError {
  message: string
  path?: string[]
}

export interface GraphqlResponse<T> {
  data?: T
  errors?: GraphqlError[]
}

export async function dataciteGraphql<T>(
  query: string,
  variables: Record<string, unknown>,
  token?: string
): Promise<GraphqlResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${DATACITE_API_URL}/graphql`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`DataCite GraphQL request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
