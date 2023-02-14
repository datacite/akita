import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useQueryState } from 'next-usequerystate'
import truncate from 'lodash/truncate'
import { Row, Col, Tab, Nav, NavItem, Button, Modal } from 'react-bootstrap'

import apolloClient from '../../utils/apolloClient'
import Layout from '../../components/Layout/Layout'
import Error from '../../components/Error/Error'
import Work from '../../components/Work/Work'
import WorksListing from '../../components/WorksListing/WorksListing'
import Loading from '../../components/Loading/Loading'
import {
  connectionFragment,
  contentFragment
} from '../../components/SearchWork/SearchWork'
import { pluralize, rorFromUrl } from '../../utils/helpers'
import ShareLinks from '../../components/ShareLinks/ShareLinks'

type Props = {
  doi: string
  metadata: MetadataQueryData
}

export const CROSSREF_FUNDER_GQL = gql`
  query getOrganizationQuery($crossrefFunderId: ID) {
    organization(crossrefFunderId: $crossrefFunderId) {
      id
    }
  }
`

const METADATA_GQL = gql`
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

export interface MetadataQueryVar {
  id: string
}
export interface MetadataQueryData {
  work: MetadataType
}

interface MetadataType {
  id: string
  doi: string
  types: {
    resourceTypeGeneral?: string
    resourceType?: string
  }
  creators: Creator[]
  titles: Title[]
  descriptions: Description[]
  registrationAgency: {
    id: string
    name: string
  }
  schemaOrg: string
}

export const DOI_GQL = gql`
  query getDoiQuery(
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
    }
  }
  ${connectionFragment.workConnection}
  ${contentFragment.work}
`

export interface WorkType {
  id: string
  doi: string
  url: string
  identifiers?: Identifier[]
  contentUrl: string
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
  schemaOrg: string
  claims?: ClaimType[]
  contributors?: Contributor[]
  fundingReferences?: FundingReference[]
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

export interface Creator {
  id: string
  name: string
  givenName: string
  familyName: string
  affiliation: Affiliation[]
}

interface Identifier {
  identifier: string
  identifierType: string
  identifierUrl: string
}

interface Contributor {
  id: string
  name: string
  givenName: string
  familyName: string
  contributorType: string
  affiliation: Affiliation[]
}

interface Affiliation {
  id: string
  name: string
}

interface Title {
  title: string
}

interface Rights {
  rights: string
  rightsUri: string
  rightsIdentifier: string
}

export interface ClaimType {
  id: string
  sourceId: string
  state: string
  claimAction: string
  claimed: Date
  errorMessages: ClaimError[]
}

interface ClaimError {
  status?: number
  title: string
}

export interface FundingReference {
  funderIdentifier?: string
  funderIdentifierType?: string
  funderName?: string
  awardUri?: string
  awardTitle?: string
  awardNumber?: string
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
  filterQuery: string
  cursor: string
  published: string
  resourceTypeId: string
  language: string
  license: string
  fieldOfScience: string
  registrationAgency: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const doi = (context.query.doi as string[]).join('/')
  const filterQuery = context.query.filterQuery as string

  // redirect to organization page if doi is a Crossref Funder ID
  if (doi.startsWith('10.13039')) {
    const { data } = await apolloClient.query({
      query: CROSSREF_FUNDER_GQL,
      variables: { crossrefFunderId: doi },
      errorPolicy: 'all'
    })
    // redirect to our 404 page if funder is not found
    if (!data) {
      context.res.writeHead(302, { Location: '/404' })
      context.res.end()
      return { props: {} }
    } else {
      const location = '/ror.org' + rorFromUrl(data.organization.id)
      context.res.writeHead(302, {
        Location: filterQuery ? location + '?filterQuery=' + filterQuery : location
      })
      context.res.end()
      return { props: {} }
    }
  } else {
    const { data } = await apolloClient.query({
      query: METADATA_GQL,
      variables: { id: doi },
      errorPolicy: 'all'
    })
    // redirect to our 404 page if doi is not found
    if (!data) {
      context.res.writeHead(302, { Location: '/404' })
      context.res.end()
      return { props: {} }
    } else {
      return { props: { doi, metadata: data } }
    }
  }
}

const WorkPage: React.FunctionComponent<Props> = ({ doi, metadata }) => {
  const pageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/doi.org/' + metadata.work.doi
      : 'https://commons.stage.datacite.org/doi.org/' + metadata.work.doi

  const imageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/images/logo.png'
      : 'https://commons.stage.datacite.org/images/logo.png'

  const title = metadata.work.titles[0]
    ? 'DataCite Commons: ' + metadata.work.titles[0].title
    : 'DataCite Commons: No Title'

  const description = !metadata.work.descriptions[0]
    ? null
    : truncate(metadata.work.descriptions[0].description, {
        length: 2500,
        separator: '… '
      })

  let type: string = metadata.work.types.resourceTypeGeneral
    ? metadata.work.types.resourceTypeGeneral.toLowerCase()
    : null
  if (
    metadata.work.registrationAgency.id !== 'datacite' &&
    metadata.work.types.resourceType
  )
    type = metadata.work.types.resourceType.toLowerCase()

  const [filterQuery] = useQueryState('filterQuery')
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
      id: doi,
      cursor: cursor,
      filterQuery: filterQuery,
      published: published as string,
      resourceTypeId: resourceType as string,
      fieldOfScience: fieldOfScience as string,
      language: language as string,
      license: license as string,
      registrationAgency: registrationAgency as string
    }
  })

  const [showDownloadMetadataModal, setShowDownloadMetadataModal] = useState(false)

  if (loading)
    return (
      <Layout path={'/doi.org/' + doi}>
        <Loading />
      </Layout>
    )

  if (error)
    return (
      <Layout path={'/doi.org/' + doi}>
        <Col md={9} mdOffset={3}>
          <Error title="An error occured." message={error.message} />
        </Col>
      </Layout>
    )

  const work = data.work

  const content = () => {
    const exportMetadata = () => {
      const showCrossrefMetadata = work.registrationAgency.id === 'crossref'
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'https://api.stage.datacite.org'
    
      return (
        <>
          <h3 className="member-results" id="download">
            Download
          </h3>
          <div className="panel panel-transparent download">
            <div className="panel-body">
              <Row>
                <Col className="download-list" id="full-metadata" xs={6} md={4}>
                  <h5>Full Metadata</h5>
                  {showCrossrefMetadata && (
                    <div id="export-crossref">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={
                          'https://api.crossref.org/works/' +
                          work.doi +
                          '/transform/application/vnd.crossref.unixsd+xml'
                        }
                      >
                        Crossref UNIXREF
                      </a>
                    </div>
                  )}
                  <div id="export-xml">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={
                        apiUrl +
                        '/application/vnd.datacite.datacite+xml/' +
                        work.doi
                      }
                    >
                      DataCite XML
                    </a>
                  </div>
                  <div id="export-json">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={
                        apiUrl +
                        '/application/vnd.datacite.datacite+json/' +
                        work.doi
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
                        apiUrl + '/application/vnd.schemaorg.ld+json/' + work.doi
                      }
                    >
                      Schema.org JSON-LD
                    </a>
                  </div>
                </Col>
                <Col
                  className="download-list"
                  id="citation-metadata"
                  xs={6}
                  md={4}
                >
                  <h5>Citation Metadata</h5>
                  <div id="export-citeproc" className="download">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={
                        apiUrl +
                        '/application/vnd.citationstyles.csl+json/' +
                        work.doi
                      }
                    >
                      Citeproc JSON
                    </a>
                  </div>
                  <div id="export-bibtex" className="download">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={apiUrl + '/application/x-bibtex/' + work.doi}
                    >
                      BibTeX
                    </a>
                  </div>
                  <div id="export-ris" className="download">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={
                        apiUrl + '/application/x-research-info-systems/' + work.doi
                      }
                    >
                      RIS
                    </a>
                  </div>
                  {work.types.resourceTypeGeneral === 'Software' && (
                    <div id="export-codemeta" className="download">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={
                          apiUrl + '/application/vnd.codemeta.ld+json/' + work.doi
                        }
                      >
                        Codemeta
                      </a>
                    </div>
                  )}
                </Col>
                {work.contentUrl && (
                  <Col xs={6} md={4}>
                    <h5>Fulltext Article</h5>
                    <div>
                      <a href={work.contentUrl} target="_blank" rel="noreferrer">
                        via Unpaywall
                      </a>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        </>
      )
    }

    const downloadMetadataButton = () => {      
      return (<>
        <Button
          bsStyle={'btn-default'}
          title="Download Metadata"
          onClick={() => setShowDownloadMetadataModal(true)}
          id="download-metadata-button"
          style={{marginBottom: 20}}
        >
          Download Metadata
        </Button>

        <Modal show={showDownloadMetadataModal} onHide={() => setShowDownloadMetadataModal(false)}>
          {/* <Modal.Header closeButton>
            <Modal.Title>Download Metadata</Modal.Title>
          </Modal.Header> */}
          <Modal.Body>{exportMetadata()}</Modal.Body>
          <Modal.Footer style={{padding: 10}}>
            <Button id='close-modal' onClick={() => setShowDownloadMetadataModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </>)
    }


    return (
      <>
        <Col md={3} className="panel-list" id="side-bar">
          {downloadMetadataButton()}
          <ShareLinks url={'doi.org/' + work.doi} title={work.titles[0] ? work.titles[0].title : undefined} />
        </Col>
        <Col md={9} className="panel-list" id="content">
          <Work doi={work}></Work>
        </Col>
      </>
    )
  }

  const relatedContent = () => {
    const referencesTabLabel = pluralize(
      work.references.totalCount,
      'Reference'
    )
    const citationsTabLabel = pluralize(work.citations.totalCount, 'Citation')

    const hasNextPageCitations = work.citations.pageInfo
      ? work.citations.pageInfo.hasNextPage
      : false
    const endCursorCitations = work.citations.pageInfo
      ? work.citations.pageInfo.endCursor
      : ''

    const hasNextPageReferences = work.references.pageInfo
      ? work.references.pageInfo.hasNextPage
      : false
    const endCursorReferences = work.references.pageInfo
      ? work.references.pageInfo.endCursor
      : ''

    const url = '/doi.org/' + work.doi + '/?'

    if (work.references.totalCount + work.citations.totalCount == 0) return ''

    const defaultActiveKey =
      work.references.totalCount > 0 ? 'referencesList' : 'citationsList'

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
                  {work.references.totalCount > 0 && (
                    <NavItem eventKey="referencesList">
                      {referencesTabLabel}
                    </NavItem>
                  )}
                  {work.citations.totalCount > 0 && (
                    <NavItem eventKey="citationsList">
                      {citationsTabLabel}
                    </NavItem>
                  )}
                </Nav>
              </Col>
              <Tab.Content>
                {work.references.totalCount > 0 && (
                  <Tab.Pane
                    className="references-list"
                    eventKey="referencesList"
                  >
                    <WorksListing
                      works={work.references}
                      loading={false}
                      showFacets={true}
                      showAnalytics={true}
                      showClaimStatus={true}
                      hasPagination={work.references.totalCount > 25}
                      hasNextPage={hasNextPageReferences}
                      model={'doi'}
                      url={url}
                      endCursor={endCursorReferences}
                    />
                  </Tab.Pane>
                )}

                {work.citations.totalCount > 0 && (
                  <Tab.Pane className="citations-list" eventKey="citationsList">
                    <WorksListing
                      works={work.citations}
                      loading={false}
                      showFacets={true}
                      showAnalytics={true}
                      showClaimStatus={true}
                      hasPagination={work.citations.totalCount > 25}
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
    <Layout path={'/doi.org'}>
      <Head>
        <title key="title">{title}</title>
        <meta name="og:title" content={title} />
        {description && (
          <>
            <meta name="description" content={description} />
            <meta name="og:description" content={description} />
          </>
        )}
        <meta name="og:url" content={pageUrl} />
        <meta name="og:image" content={imageUrl} />
        {type && <meta name="og:type" content={type} />}
        <script type="application/ld+json">{work.schemaOrg}</script>
      </Head>
      <Row>{content()}</Row>
      <Row>{relatedContent()}</Row>
    </Layout>
  )
}

export default WorkPage
