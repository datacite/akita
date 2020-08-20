import * as React from 'react'
import Error from '../Error/Error'
import { gql, useQuery } from '@apollo/client'
import Work from '../Work/Work'
import { connectionFragment, contentFragment } from '../SearchWork/SearchWork'
import ContentLoader from 'react-content-loader'
import { useQueryState } from 'next-usequerystate'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton
} from 'react-share'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'
import { Row, Tab, Nav, NavItem } from 'react-bootstrap'
import Pluralize from 'react-pluralize'
import { compactNumbers } from '../../utils/helpers'
import WorksListing from '../WorksListing/WorksListing'

type Props = {
  item?: string
}

export const DOI_GQL = gql`
  query getContentQuery(
    $id: ID!
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
      citationCount
      citationsOverTime {
        year
        total
      }
      viewCount
      viewsOverTime {
        yearMonth
        total
      }
      downloadCount
      downloadsOverTime {
        yearMonth
        total
      }
      citations(
        first: 25
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
        first: 5
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
  descriptions?: Description[]
  fieldsOfScience?: FieldOfScience[]
  rights?: Rights[]
  version?: string
  language?: {
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
  citationsOverTime?: CitationsYear[]
  citations?: {
    published: ContentFacet[]
    resourceTypes: ContentFacet[]
    languages: ContentFacet[]
    licenses: ContentFacet[]
    fieldsOfScience: ContentFacet[]
    registrationAgencies: ContentFacet[]
    nodes: WorkType[]
    pageInfo: PageInfo
    totalCount: number
  }
  viewCount?: number
  viewsOverTime?: UsageMonth[]
  downloadCount?: number
  downloadsOverTime?: UsageMonth[]
  references?: {
    published: ContentFacet[]
    resourceTypes: ContentFacet[]
    languages: ContentFacet[]
    licenses: ContentFacet[]
    fieldsOfScience: ContentFacet[]
    registrationAgencies: ContentFacet[]
    nodes: WorkType[]
    pageInfo: PageInfo
    totalCount: number
  }
}

interface ContentFacet {
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

interface CitationsYear {
  year: number
  total: number
}

export interface UsageMonth {
  yearMonth: string
  total: number
}

export interface RelatedContentList {
  nodes: {
    id: string
    formattedCitation: string
    repository: {
      name: string
      re3dataId: string
      id: string
    }
    registrationAgency: {
      name: string
      id: string
    }
    member: {
      name: string
      id: string
    }
  }
}

export interface DoiQueryData {
  work: WorkType
}

interface DoiQueryVar {
  id: string
  cursor: string
  published: string
  resourceTypeId: string
  language: string
  license: string
  fieldOfScience: string
  registrationAgency: string
}

const DoiContainer: React.FunctionComponent<Props> = ({ item }) => {
  const [doi, setDoi] = React.useState<WorkType>()
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

  const { loading, error, data } = useQuery<DoiQueryData, DoiQueryVar>(
    DOI_GQL,
    {
      errorPolicy: 'all',
      variables: {
        id: item,
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

  React.useEffect(() => {
    let result = undefined
    if (data) {
      result = data.work
    }

    setDoi(result)
  }, [item, data])

  if (loading || !doi)
    return (
      <React.Fragment>
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <ContentLoader
            speed={1}
            width={1000}
            height={250}
            uniqueKey="2"
            viewBox="0 0 1000 250"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="117" y="34" rx="3" ry="3" width="198" height="14" />
            <rect x="117" y="75" rx="3" ry="3" width="117" height="14" />
            <rect x="9" y="142" rx="3" ry="3" width="923" height="14" />
            <rect x="9" y="178" rx="3" ry="3" width="855" height="14" />
            <rect x="9" y="214" rx="3" ry="3" width="401" height="14" />
            <circle cx="54" cy="61" r="45" />
          </ContentLoader>
        </div>
      </React.Fragment>
    )

  if (error) {
    return <Error title="No Content" message="Unable to retrieve Content" />
  }

  const leftSideBar = () => {
    const title = 'DataCite Commons: ' + doi.titles[0].title
    const url = window.location.href

    return (
      <div className="col-md-3 hidden-xs hidden-sm">
        <div className="panel panel-transparent">
          <div className="panel-body">
            <div className="edit"></div>
          </div>
        </div>
        <div className="panel panel-transparent">
          <div className="facets panel-body">
            <h4>Export</h4>
            <div id="export-xml" className="download">
              <a
                target="_blank"
                rel="noreferrer"
                href={
                  process.env.NEXT_PUBLIC_API_URL +
                  '/application/vnd.datacite.datacite+xml/' +
                  doi.doi
                }
              >
                DataCite XML
              </a>
            </div>
            <div id="export-json" className="download">
              <a
                target="_blank"
                rel="noreferrer"
                href={
                  process.env.NEXT_PUBLIC_API_URL +
                  '/application/vnd.datacite.datacite+json/' +
                  doi.doi
                }
              >
                DataCite JSON
              </a>
            </div>
            <div id="export-ld" className="download">
              <a
                target="_blank"
                rel="noreferrer"
                href={
                  process.env.NEXT_PUBLIC_API_URL +
                  '/application/vnd.schemaorg.ld+json/' +
                  doi.doi
                }
              >
                Schema.org JSON-LD
              </a>
            </div>
            <div id="export-bibtex" className="download">
              <a
                target="_blank"
                rel="noreferrer"
                href={
                  process.env.NEXT_PUBLIC_API_URL +
                  '/application/x-bibtex/' +
                  doi.doi
                }
              >
                BibTeX
              </a>
            </div>
            <div id="export-ris" className="download">
              <a
                target="_blank"
                rel="noreferrer"
                href={
                  process.env.NEXT_PUBLIC_API_URL +
                  '/application/x-research-info-systems/' +
                  doi.doi
                }
              >
                RIS
              </a>
            </div>
            <div id="export-jats" className="download">
              <a
                target="_blank"
                rel="noreferrer"
                href={
                  process.env.NEXT_PUBLIC_API_URL +
                  '/application/vnd.jats+xml/' +
                  doi.doi
                }
              >
                JATS
              </a>
            </div>
            {doi.types.resourceTypeGeneral === 'Software' && (
              <div id="export-codemeta" className="download">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    '/application/vnd.codemeta.ld+json/' +
                    doi.doi
                  }
                >
                  Codemeta
                </a>
              </div>
            )}
          </div>
          <div className="facets panel-body">
            <h4>Share</h4>
            <span className="share-button">
              <EmailShareButton url={url} title={title}>
                <FontAwesomeIcon icon={faEnvelope} size="lg" />
              </EmailShareButton>
            </span>
            <span className="share-button">
              <TwitterShareButton url={url} title={title}>
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </TwitterShareButton>
            </span>
            <span className="share-button">
              <FacebookShareButton url={url} title={title}>
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </FacebookShareButton>
            </span>
          </div>
        </div>
      </div>
    )
  }

  const content = () => {
    return (
      <div className="col-md-9 panel-list" id="content">
        <Work doi={doi}></Work>
      </div>
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

    if (doi.citations.totalCount == 0) return ''

    return (
      <div className="panel panel-transparent">
        <div className="panel-body nav-tabs-member">
          <Tab.Container
            className="content-tabs"
            id="related-content-tabs"
            defaultActiveKey="referencesList"
          >
            <div>
              <div className="col-md-9 col-md-offset-3">
                <Nav bsStyle="tabs">
                  <NavItem eventKey="referencesList">
                    {referencesTabLabel}
                  </NavItem>
                  <NavItem eventKey="citationsList">
                    {citationsTabLabel}
                  </NavItem>
                </Nav>
              </div>
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
                      url={url}
                      endCursor={endCursorCitations}
                    />
                  </Tab.Pane>
                )}
              </Tab.Content>
            </div>
          </Tab.Container>
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      <Row>
        {leftSideBar()}
        {content()}
      </Row>
      <Row>{relatedContent()}</Row>
    </React.Fragment>
  )
}

export default DoiContainer
