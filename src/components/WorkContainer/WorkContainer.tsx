import React from 'react'
import Error from '../Error/Error'
import { gql, useQuery } from '@apollo/client'
import Work from '../Work/Work'
import { connectionFragment, contentFragment } from '../SearchWork/SearchWork'
import { useQueryState } from 'next-usequerystate'
import { Row, Col, Tab, Nav, NavItem } from 'react-bootstrap'
import Pluralize from 'react-pluralize'
import { compactNumbers } from '../../utils/helpers'
import WorksListing from '../WorksListing/WorksListing'
import Loading from '../Loading/Loading'

type Props = {
  item?: string
  searchQuery: string
}

export const DOI_GQL = gql`
  query getContentQuery(
    $id: ID!
    $query: String
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
      ...WorkFragment
      formattedCitation
      viewsOverTime {
        yearMonth
        total
      }
      downloadsOverTime {
        yearMonth
        total
      }
      citations(
        first: 25
        query: $query
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
        query: $query
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
  ${connectionFragment.workConnection}
  ${contentFragment.work}
`
export interface WorkType {
  id: string
  doi: string
  url: string
  types: {
    resourceTypeGeneral?: string
    resourceType?: string
  }
  creators: Creator[]
  titles: Title[]
  publicationYear: number
  publisher: string
  container?: {
    identifier: string
    identifierType: string
    title: string
  }
  descriptions?: Description[]
  fieldsOfScience?: FieldOfScience[]
  rights?: Rights[]
  version?: string
  language?: {
    id: string
    name: string
  }
  repository?: {
    id: string
    name: string
  }
  registrationAgency: {
    id: string
    name: string
  }
  registered?: Date
  formattedCitation?: string
  citationCount?: number
  citations?: {
    published: Facet[]
    resourceTypes: Facet[]
    languages: Facet[]
    licenses: Facet[]
    fieldsOfScience: Facet[]
    registrationAgencies: Facet[]
    nodes: WorkType[]
    pageInfo: PageInfo
    totalCount: number
  }
  viewCount?: number
  viewsOverTime?: UsageMonth[]
  downloadCount?: number
  downloadsOverTime?: UsageMonth[]
  references?: {
    published: Facet[]
    resourceTypes: Facet[]
    languages: Facet[]
    licenses: Facet[]
    fieldsOfScience: Facet[]
    registrationAgencies: Facet[]
    nodes: WorkType[]
    pageInfo: PageInfo
    totalCount: number
  }
}

interface Facet {
  id: string
  title: string
  count: number
}

interface Creator {
  id: string
  name: string
  givenName: string
  familyName: string
}

interface Title {
  title: string
}

interface Rights {
  rights: string
  rightsUri: string
  rightsIdentifier: string
}

interface FieldOfScience {
  id: string
  name: string
}

interface Description {
  description: string
}

interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}

export interface UsageMonth {
  yearMonth: string
  total: number
}

export interface RelatedContentList {
  nodes: {
    id: string
    formattedCitation: string
    registrationAgency: {
      name: string
      id: string
    }
  }
}

export interface WorkQueryData {
  work: WorkType
}

interface QueryVar {
  id: string
  query: string
  cursor: string
  published: string
  resourceTypeId: string
  language: string
  license: string
  fieldOfScience: string
  registrationAgency: string
}

const WorkContainer: React.FunctionComponent<Props> = ({ item, searchQuery }) => {
  const [cursor] = useQueryState('cursor', { history: 'push' })
  const [published] = useQueryState('published', { history: 'push' })
  const [resourceType] = useQueryState('resource-type', { history: 'push' })
  const [fieldOfScience] = useQueryState('field-of-science', {
    history: 'push'
  })
  const [language] = useQueryState('language', { history: 'push' })
  const [license] = useQueryState('license', { history: 'push' })
  const [registrationAgency] = useQueryState('registration-agency', {
    history: 'push'
  })

  const { loading, error, data } = useQuery<WorkQueryData, QueryVar>(DOI_GQL, {
    errorPolicy: 'all',
    variables: {
      id: item,
      cursor: cursor,
      query: searchQuery,
      published: published as string,
      resourceTypeId: resourceType as string,
      fieldOfScience: fieldOfScience as string,
      language: language as string,
      license: license as string,
      registrationAgency: registrationAgency as string
    }
  })

  if (loading)
    return (
      <Loading />
    )

  if (error)
    return (
      <Col md={9} mdOffset={3}>
        <Error title="An error occured." message={error.message} />
      </Col>
    )

  const doi = data.work

  const content = () => {
    return (
      <Col md={9} mdOffset={3} className="panel-list" id="content">
        <Work doi={doi}></Work>
      </Col>
    )
  }

  const relatedContent = () => {
    const referencesTabLabel = Pluralize({
      count: compactNumbers(doi.references.totalCount),
      singular: 'Reference',
      showCount: true
    })
    const citationsTabLabel = Pluralize({
      count: compactNumbers(doi.citations.totalCount),
      singular: 'Citation',
      showCount: true
    })

    const hasNextPageCitations = doi.citations.pageInfo
      ? doi.citations.pageInfo.hasNextPage
      : false
    const endCursorCitations = doi.citations.pageInfo
      ? doi.citations.pageInfo.endCursor
      : ''

    const hasNextPageReferences = doi.references.pageInfo
      ? doi.references.pageInfo.hasNextPage
      : false
    const endCursorReferences = doi.references.pageInfo
      ? doi.references.pageInfo.endCursor
      : ''

    const url = '/doi.org/' + doi.doi + '/?'

    if (doi.references.totalCount + doi.citations.totalCount == 0) return ''

    const defaultActiveKey =
      doi.references.totalCount > 0 ? 'referencesList' : 'citationsList'
    return (
      <div className="panel panel-transparent">
        <div className="panel-body nav-tabs-member">
          <Tab.Container
            className="content-tabs"
            id="related-content-tabs"
            defaultActiveKey={defaultActiveKey}
          >
            <>
              <Col md={9} mdOffset={3}>
                <Nav bsStyle="tabs">
                  {doi.references.totalCount > 0 && (
                    <NavItem eventKey="referencesList">
                      {referencesTabLabel}
                    </NavItem>
                  )}
                  {doi.citations.totalCount > 0 && (
                    <NavItem eventKey="citationsList">
                      {citationsTabLabel}
                    </NavItem>
                  )}
                </Nav>
              </Col>
              <Tab.Content>
                {doi.references.totalCount > 0 && (
                  <Tab.Pane
                    className="references-list"
                    eventKey="referencesList"
                  >
                    <WorksListing
                      works={doi.references}
                      loading={false}
                      showFacets={true}
                      showAnalytics={true}
                      hasPagination={doi.references.totalCount > 25}
                      hasNextPage={hasNextPageReferences}
                      model={'doi'}
                      url={url}
                      endCursor={endCursorReferences}
                    />
                  </Tab.Pane>
                )}

                {doi.citations.totalCount > 0 && (
                  <Tab.Pane className="citations-list" eventKey="citationsList">
                    <WorksListing
                      works={doi.citations}
                      loading={false}
                      showFacets={true}
                      showAnalytics={true}
                      hasPagination={doi.citations.totalCount > 25}
                      hasNextPage={hasNextPageCitations}
                      model={'doi'}
                      url={url}
                      endCursor={endCursorCitations}
                    />
                  </Tab.Pane>
                )}
              </Tab.Content>
            </>
          </Tab.Container>
        </div>
      </div>
    )
  }

  return (
    <>
      <Row>{content()}</Row>
      <Row>{relatedContent()}</Row>
    </>
  )
}

export default WorkContainer
