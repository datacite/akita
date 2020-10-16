import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { useQueryState } from 'next-usequerystate'
import { Alert, Row, Col } from 'react-bootstrap'

import WorksListing from '../WorksListing/WorksListing'
import { WorkType } from '../WorkContainer/WorkContainer'
import Error from '../Error/Error'
import Loading from '../Loading/Loading'
import { pluralize } from '../../utils/helpers'

type Props = {
  searchQuery: string
}

interface Facet {
  id: string
  title: string
  count: number
}

export interface PageInfo {
  endCursor: string
  hasNextPage: boolean
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
}

interface WorkQueryData {
  works: Works
}

interface QueryVar {
  query: string
  cursor: string
  published: string
  resourceTypeId: string
  language: string
  fieldOfScience: string
  license: string
  registrationAgency: string
}

export const connectionFragment = {
  workConnection: gql`
    fragment WorkConnectionFragment on WorkConnectionWithTotal {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      resourceTypes {
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
    }
  `
}

export const contentFragment = {
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
        id
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

export const CONTENT_GQL = gql`
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

const SearchWork: React.FunctionComponent<Props> = ({ searchQuery }) => {
  const [published] = useQueryState('published', {
    history: 'push'
  })
  const [resourceType] = useQueryState('resource-type', {
    history: 'push'
  })
  const [fieldOfScience] = useQueryState('field-of-science', {
    history: 'push'
  })
  const [license] = useQueryState('license', { history: 'push' })
  const [language] = useQueryState('language', { history: 'push' })
  const [registrationAgency] = useQueryState('registration-agency', {
    history: 'push'
  })
  const [cursor] = useQueryState('cursor', { history: 'push' })
  const { loading, error, data } = useQuery<WorkQueryData, QueryVar>(
    CONTENT_GQL,
    {
      errorPolicy: 'all',
      variables: {
        query: searchQuery,
        cursor: cursor,
        published: published as string,
        resourceTypeId: resourceType as string,
        fieldOfScience: fieldOfScience as string,
        language: language as string,
        license: license as string,
        registrationAgency: registrationAgency as string
      }
    }
  )

  const renderResults = () => {
    if (loading) return <Loading />

    if (error)
      return (
        <Col md={9} mdOffset={3}>
          <Error title="An error occured." message={error.message} />
        </Col>
      )

    if (data.works.nodes.length == 0)
      return (
        <Col md={9} mdOffset={3}>
          <div className="alert-works">
            <Alert bsStyle="warning">No works found.</Alert>
          </div>
        </Col>
      )

    const hasNextPage = data.works.pageInfo
      ? data.works.pageInfo.hasNextPage
      : false
    const endCursor = data.works.pageInfo ? data.works.pageInfo.endCursor : ''

    const totalCount = data.works.totalCount

    return (
      <div>
        <Col md={9} mdOffset={3} id="content">
          {totalCount > 0 && (
            <h3 className="member-results">{pluralize(totalCount, 'Work')}</h3>
          )}
        </Col>

        <WorksListing
          works={data.works}
          loading={loading}
          showFacets={true}
          showAnalytics={false}
          model={'doi'}
          url={'/doi.org?'}
          hasPagination={data.works.totalCount > 25}
          hasNextPage={hasNextPage}
          endCursor={endCursor}
        />
      </div>
    )
  }

  return (
    <>
      <Row>{renderResults()}</Row>
    </>
  )
}

export default SearchWork
