import { gql } from "@apollo/client";


export const workConnection = gql`
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


export const workFragment = gql`
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
    publisher {
      name
    }
    version
    container {
      identifier
      identifierType
      title
    }
    repository {
      id: uid
      name
    }
    rights {
      rights
      rightsUri
      rightsIdentifier
      rightsIdentifierScheme
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

