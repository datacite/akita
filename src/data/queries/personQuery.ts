import { gql } from '@apollo/client'
import { Person, PersonMetadata } from 'src/data/types'
import { workConnection, workFragment } from './doiQuery'



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

export const RELATED_CONTENT_QUERY = gql`
  query getRelatedContentQuery(
    $id: ID!
    $filterQuery: String
    $cursor: String
    $published: String
    $resourceTypeId: String
    $fieldOfScience: String
    $language: String
    $license: String
    $registrationAgency: String
  ) {
    person(id: $id) {
      works(
        first: 25
        query: $filterQuery
        after: $cursor
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
  person: PersonMetadata
}


export interface QueryData {
  person: Person
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