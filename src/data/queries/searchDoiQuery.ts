import { gql } from '@apollo/client'
import { Works } from 'src/data/types'


const workConnection = gql`
  fragment WorkConnectionFragment on WorkConnectionWithTotal {
    totalCount
    totalContentUrl
    totalOpenLicenses
    pageInfo {
      endCursor
      hasNextPage
    }
    resourceTypes {
      id
      title
      count
    }
    openLicenseResourceTypes {
      id
      title
      count
    }
    published {
      id
      title
      count
    }
    languages {
      id
      title
      count
    }
    fieldsOfScience {
      id
      title
      count
    }
    licenses {
      id
      title
      count
    }
    registrationAgencies {
      id
      title
      count
    }
    authors {
      id
      title
      count
    }
    creatorsAndContributors {
      id
      title
      count
    }
    personToWorkTypesMultilevel {
      id
      title
      count
      inner {
        id
        title
        count
      }
    }
  }
`

const workFragment = gql`
  fragment WorkFragment on Work {
    id
    doi
    identifiers {
      identifier
      identifierType
      identifierUrl
    }
    types {
      resourceTypeGeneral
      resourceType
    }
    titles {
      title
    }
    creators {
      id
      name
      givenName
      familyName
      affiliation {
        id
        name
      }
    }
    descriptions {
      description
      descriptionType
    }
    publicationYear
    publisher
    version
    container {
      identifier
      identifierType
      title
    }
    repository {
      id:uid
      name
    }
    rights {
      rights
      rightsUri
      rightsIdentifier
    }
    claims {
      state
    }
    fieldsOfScience {
      id
      name
    }
    language {
      id
      name
    }
    registrationAgency {
      id
      name
    }
    registered
    citationCount
    viewCount
    downloadCount
  }
`


const SEARCH_DOI_QUERY = gql`
  query getContentQuery(
    $query: String
    $cursor: String
    $published: String
    $resourceTypeId: String
    $fieldOfScience: String
    $language: String
    $license: String
    $registrationAgency: String
  ) {
    works(
      first: 25
      query: $query
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
  ${workConnection}
  ${workFragment}
`


export interface QueryData {
  works: Works
}

export interface QueryVar {
  query: string
  cursor?: string
  published?: string
  resourceTypeId?: string
  language?: string
  fieldOfScience?: string
  license?: string
  registrationAgency?: string
}


export default SEARCH_DOI_QUERY