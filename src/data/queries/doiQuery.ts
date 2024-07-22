import { gql } from '@apollo/client'
import { WorkMetadata, Work } from 'src/data/types'

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

export const RELATED_CONTENT_QUERY = gql`
  query getRelatedContentDoiQuery(
    $id: ID!
    $filterQuery: String
    $cursor: String
    $published: String
    $resourceTypeId: String
    $fieldOfScience: String
    $language: String
    $license: String
    $registrationAgency: String
    $repositoryId: String
  ) {
    work(id: $id) {
      doi
      types {
        resourceTypeGeneral
        resourceType
      }
      allRelated(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
      ) {
        ...WorkConnectionFragment
        nodes {
          ...WorkFragment
        }
      }
      citations(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
      ) {
        ...WorkConnectionFragment
        nodes {
          ...WorkFragment
        }
      }
      references(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
      ) {
        ...WorkConnectionFragment
        nodes {
          ...WorkFragment
        }
      }
      parts(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
      ) {
        ...WorkConnectionFragment
        nodes {
          ...WorkFragment
        }
      }
      partOf(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
      ) {
        ...WorkConnectionFragment
        nodes {
          ...WorkFragment
        }
      }
      otherRelated(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
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
