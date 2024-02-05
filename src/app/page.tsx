import React from 'react'
import { gql } from '@apollo/client'
import apolloClient from 'src/utils/server/apolloClient'

import { Row, Col } from 'src/components/Layout'
import Error from 'src/components/Error/Server'
import ExampleText from 'src/components/ExampleText/ExampleText'
import SearchWork from 'src/components/SearchWork/Server'
import { WorkType } from 'src/pages/doi.org/[...doi]'

interface Props {
  searchParams: SearchParams
}

interface SearchParams extends Partial<QueryVar> {
  filterQuery?: string
}


interface QueryData {
  works: Works
}

interface QueryVar {
  query: string
  cursor?: string
  published?: string
  resourceTypeId?: string
  language?: string
  fieldOfScience?: string
  license?: string
  registrationAgency?: string
}

export interface Works {
  totalCount: number
  pageInfo: PageInfo
  published: Facet[]
  resourceTypes: Facet[]
  languages: Facet[]
  licenses: Facet[]
  fieldsOfScience: Facet[]
  registrationAgencies: Facet[]
  nodes: WorkType[]
  personToWorkTypesMultilevel: MultilevelFacet[]
}

interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}

export interface Facet {
  id: string
  title: string
  count: number
}

interface MultilevelFacet extends Facet {
  inner: Facet[]
}


const connectionFragment = {
  workConnection: gql`
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
}

const contentFragment = {
  work: gql`
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
}

const CONTENT_GQL = gql`
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
  ${connectionFragment.workConnection}
  ${contentFragment.work}
`

export default async function IndexPage ({ searchParams }: Props) {
  const { query, filterQuery, ...vars } = searchParams

  // Show examply text if there is no query
  if (!query || query === '') return (
    <ExampleText>
      <div>
        Search works by keyword(s) or DOI.<br /><br />

        Examples:
        <ul>
          <li><a href="/doi.org?query=climate+change">climate change</a></li>
          <li><a href="/doi.org?query=10.14454%2F3w3z-sa82">10.14454/3w3z-sa82</a></li>
        </ul>

        Documentation is available in <a href="https://support.datacite.org/docs/datacite-commons" target="_blank" rel="noreferrer">DataCite Support.</a>
      </div>
    </ExampleText>
  )


  // Fetch data
  const queryStatement = query + (filterQuery ? ' AND ' + filterQuery : '')

  const { data, error } = await apolloClient.query<QueryData, QueryVar>({
    query: CONTENT_GQL,
    variables: { query: queryStatement, ...vars },
    errorPolicy: 'all'
  })

  if (error) return (
    <Row>
      <Col md={9} mdOffset={3}>
        <Error title="An error occured." message={error.message} />
      </Col>
    </Row>
  )

  if (data.works.nodes.length == 0) return (
    <Row>
      <Col md={9} mdOffset={3}>
        <div className="alert-works">
          <Error title="No works found." message='' />
        </div>
      </Col>
    </Row>
  )

  return <SearchWork {...data.works} />
}
