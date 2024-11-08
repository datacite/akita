import { gql } from '@apollo/client'
import { Organization, OrganizationMetadata } from 'src/data/types'
import apolloClient from 'src/utils/apolloClient/apolloClient'


export async function fetchOrganizationMetadata(id: string) {
  const { data } = await apolloClient.query<MetadataQueryData, QueryVar>({
    query: ORGANIZATION_METADATA_QUERY,
    variables: { id },
    errorPolicy: 'all'
  })

  return { data }
}

export async function fetchOrganization(id: string) {
  const { data, error } = await apolloClient.query<QueryData, QueryVar>({
    query: ORGANIZATION_QUERY,
    variables: { id },
    errorPolicy: 'all'
  })

  return { data, error }
}


export const ORGANIZATION_METADATA_QUERY = gql`
  query getOrganizationQuery(
    $id: ID
    $gridId: ID
    $crossrefFunderId: ID
  ) {
    organization(
      id: $id
      gridId: $gridId
      crossrefFunderId: $crossrefFunderId
    ) {
      name
    }
  }
`

export const ORGANIZATION_QUERY = gql`
  query getOrganizationQuery(
    $id: ID
    $gridId: ID
    $crossrefFunderId: ID
  ) {
    organization(
      id: $id
      gridId: $gridId
      crossrefFunderId: $crossrefFunderId
    ) {
      id
      name
      memberId
      memberRoleId
      alternateName
      inceptionYear
      url
      wikipediaUrl
      twitter
      types
      country {
        id
        name
      }
      geolocation {
        pointLongitude
        pointLatitude
      }
      identifiers {
        identifier
        identifierType
      }
      citationCount
      viewCount
      downloadCount,
      works(first: 0) {
        totalCount
      }
    }
  }
`

export interface MetadataQueryData {
  organization: OrganizationMetadata
}


export interface QueryData {
  organization: Organization
}

export interface QueryVar {
  id: string
}
