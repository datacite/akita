import { gql } from '@apollo/client'
import { Organization, OrganizationMetadata } from 'src/data/types'
import { workConnection, workFragment } from './doiQuery'


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

export const RELATED_CONTENT_QUERY = gql`
  query getRelatedContentQuery(
    $id: ID
    $gridId: ID
    $crossrefFunderId: ID
    $cursor: String
    $filterQuery: String
    $published: String
    $resourceTypeId: String
    $fieldOfScience: String
    $language: String
    $license: String
    $registrationAgency: String
  ) {
    organization(
      id: $id
      gridId: $gridId
      crossrefFunderId: $crossrefFunderId
    ) {
      works(
        first: 25
        after: $cursor
        query: $filterQuery
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
      ) {
        ...WorkConnectionFragment
        nodes {
          ...WorkFragment
        }
      }
    }
  }
  ${workConnection}
  ${workFragment}
`


export interface MetadataQueryVar {
  id: string
}

export interface MetadataQueryData {
  organization: OrganizationMetadata
}


export interface QueryData {
  organization: Organization
}

export interface QueryVar {
  id: string
  gridId?: string
  crossrefFunderId?: string
  filterQuery?: string
  cursor?: string
  published?: string
  resourceTypeId?: string
  language?: string
  fieldOfScience?: string
  license?: string
  registrationAgency?: string
}