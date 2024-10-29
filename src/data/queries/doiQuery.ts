import { gql } from '@apollo/client'
import apolloClient from 'src/utils/apolloClient/apolloClient'
import { WorkMetadata, Work } from 'src/data/types'
import { workFragment } from 'src/data/queries/queryFragments'


export async function fetchDoiMetadata(id: string) {
  const { data } = await apolloClient.query<MetadataQueryData, MetadataQueryVar>({
    query: DOI_METADATA_QUERY,
    variables: { id },
    errorPolicy: 'all'
  })

  return { data }
}

export async function fetchDoi(variables: QueryVar) {
  const { data, error } = await apolloClient.query<QueryData, QueryVar>({
    query: DOI_QUERY,
    variables,
    errorPolicy: 'all'
  })

  return { data, error }
}

export const DOI_METADATA_QUERY = gql`
  query getMetadataQuery($id: ID!) {
    work(id: $id) {
      id
      doi
      types {
        resourceTypeGeneral
        resourceType
      }
      titles {
        title
      }
      descriptions {
        description
      }
      registrationAgency {
        id
        name
      }
      schemaOrg
    }
  }
`

export const DOI_QUERY = gql`
  query getDoiQuery($id: ID!) {
    work(id: $id) {
      ...WorkFragment
      contentUrl
      contributors {
        id
        givenName
        familyName
        name
        contributorType
        affiliation {
          id
          name
        }
      }
      fundingReferences {
        funderIdentifier
        funderIdentifierType
        funderName
        awardTitle
        awardUri
        awardNumber
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
      formattedCitation
      schemaOrg
      viewsOverTime {
        yearMonth
        total
      }
      downloadsOverTime {
        yearMonth
        total
      }
    }
  }
  ${workFragment}
`

export interface MetadataQueryVar {
  id: string
}

export interface MetadataQueryData {
  work: WorkMetadata
}

export interface QueryData {
  work: Work
}

export interface QueryVar {
  id: string
  filterQuery?: string
  cursor?: string
  published?: string
  resourceTypeId?: string
  language?: string
  license?: string
  fieldOfScience?: string
  registrationAgency?: string
}
