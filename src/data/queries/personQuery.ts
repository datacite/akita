import { gql } from '@apollo/client'
import { Person, PersonMetadata } from 'src/data/types'
import apolloClient from 'src/utils/apolloClient/apolloClient'


export async function fetchPersonMetadata(id: string) {
  const { data, error } = await apolloClient.query<MetadataQueryData, QueryVar>({
    query: PERSON_METADATA_QUERY,
    variables: { id },
    errorPolicy: 'all'
  })

  return { data, error }
}

export async function fetchPerson(id: string) {
  const { data, error } = await apolloClient.query<QueryData, QueryVar>({
    query: PERSON_QUERY,
    variables: { id },
    errorPolicy: 'all'
  })

  return { data, error }
}


export const PERSON_METADATA_QUERY = gql`
  query getPersonQuery(
    $id: ID!
  ) {
    person(id: $id) {
      id
      description
      name
    }
  }
`

export const PERSON_QUERY = gql`
  query getPersonQuery(
    $id: ID!
  ) {
    person(id: $id) {
      id
      description
      links {
        url
        name
      }
      identifiers {
        identifier
        identifierType
        identifierUrl
      }
      country {
        name
        id
      }
      name
      alternateName
      givenName
      familyName
      employment {
        organizationId
        organizationName
        roleTitle
        startDate
        endDate
      }
      citationCount
      viewCount
      downloadCount
      totalWorks: works {
        totalCount
        totalContentUrl
        totalOpenLicenses
        openLicenseResourceTypes {
          id
          title
          count
        }
      }
    }
  }
`

export interface MetadataQueryData {
  person: PersonMetadata
}


export interface QueryData {
  person: Person
}

export interface QueryVar {
  id: string
}
