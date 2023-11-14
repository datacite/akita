import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useQueryState } from 'next-usequerystate'
import truncate from 'lodash/truncate'
import ReactHtmlParser from 'react-html-parser'
import { Row, Col } from 'react-bootstrap'

import apolloClient from '../../utils/apolloClient'
import Layout from '../../components/Layout/Layout'
import Error from '../../components/Error/Error'
import Work from '../../components/Work/Work'
import WorksListing from '../../components/WorksListing/WorksListing'
import Loading from '../../components/Loading/Loading'
import {
  Works,
  connectionFragment,
  contentFragment
} from '../../components/SearchWork/SearchWork'
import { rorFromUrl } from '../../utils/helpers'
import ShareLinks from '../../components/ShareLinks/ShareLinks'
import { Title as TitleComponent } from '../../components/Title/Title'
import CiteAs from '../../components/CiteAs/CiteAs'
import Claim from '../../components/Claim/Claim'
import DownloadMetadata from 'src/components/DownloadMetadata/DownloadMetadata'
import DownloadReports from 'src/components/DownloadReports/DownloadReports'


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
  citations?: Works
  viewCount?: number
  viewsOverTime?: UsageMonth[]
  downloadCount?: number
  downloadsOverTime?: UsageMonth[]
  references?: Works
  parts?: Works
  partOf?: Works
  otherRelated?: Works
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

export interface Rights {
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


function isDMP (work: WorkType) {
  return work.types.resourceTypeGeneral === 'OutputManagementPlan'
}


function isProject (work: WorkType) {
  return work.types.resourceType === 'Project' && (work.types.resourceTypeGeneral === 'Other' || work.types.resourceTypeGeneral === 'Text')
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
  const [fieldOfScience] = useQueryState('field-of-science', { history: 'push' })
  const [language] = useQueryState('language', { history: 'push' })
  const [license] = useQueryState('license', { history: 'push' })
  const [registrationAgency] = useQueryState('registration-agency', { history: 'push' })
  const [connectionType] = useQueryState('connection-type', { history: 'push' })

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
    return (
      <>
        <Col md={3} id="side-bar">
          <div className='left-menu-buttons'>
            { work.registrationAgency.id == "datacite" && ( 
              <Claim doi_id={work.doi} />
            )}
            <DownloadMetadata doi={work} />
          </div>
          <CiteAs doi={work} />
          <DownloadReports
            links={[
              {
                title: 'Related Works (CSV)',
                helpText: 'Includes descriptions and formatted citations in APA style for up to 200 DOIs associated with this organization.',
                type: 'doi/related-works',
              }
            ]}
            variables={{
              id: doi,
              cursor: cursor,
              filterQuery: filterQuery,
              published: published,
              resourceTypeId: resourceType,
              fieldOfScience: fieldOfScience,
              language: language,
              license: license,
              registrationAgency: registrationAgency
            }}
          />
          <ShareLinks url={'doi.org/' + work.doi} title={work.titles[0] ? work.titles[0].title : undefined} />
        </Col>
        <Col md={9} id="content">
          <Work doi={work}></Work>
        </Col>
      </>
    )
  }

  const relatedContent = () => {
    if (
      work.references.totalCount +
      work.citations.totalCount +
      work.parts.totalCount +
      work.partOf.totalCount +
      work.otherRelated.totalCount
      == 0
    ) return ''

    const url = '/doi.org/' + work.doi + '/?'

    const connectionTypeCounts = {
      references: work.references.totalCount,
      citations: work.citations.totalCount,
      parts: work.parts.totalCount,
      partOf: work.partOf.totalCount,
      otherRelated: work.otherRelated.totalCount
    }

    const defaultConnectionType =
      work.references.totalCount > 0 ? 'references' :
      work.citations.totalCount > 0 ? 'citations' :
      work.parts.totalCount > 0 ? 'parts' :
      work.partOf.totalCount > 0 ? 'partOf' : 'otherRelated'

    const displayedConnectionType = connectionType ? connectionType : defaultConnectionType


    const works: Works = displayedConnectionType in work ?
      work[displayedConnectionType] :
      { totalCount: 0, nodes: [] }

    const hasNextPage = works.pageInfo ? works.pageInfo.hasNextPage : false
    const endCursor = works.pageInfo ? works.pageInfo.endCursor : ''
    
    const showSankey = isDMP(work) || isProject(work)
    
    return (
      <div className="panel panel-transparent">
        <div className="panel-body">
          <WorksListing
            works={works}
            loading={false}
            showFacets={true}
            connectionTypesCounts={connectionTypeCounts}
            showAnalytics={true}
            showSankey={showSankey}
            sankeyTitle={`Contributions to ${displayedConnectionType}`}
            showClaimStatus={true}
            hasPagination={works.totalCount > 25}
            hasNextPage={hasNextPage}
            model={'doi'}
            url={url}
            endCursor={endCursor} />
        </div>
      </div>
    )
  }

  const handleUrl =
    work.registrationAgency.id === 'datacite'
      ? work.id
      : 'https://doi.org/' + work.doi

    const titleHtml = work.titles[0].title

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
      
      <TitleComponent title={ReactHtmlParser(titleHtml)} titleLink={handleUrl} link={'https://doi.org/' + work.doi} rights={work.rights} />
           
      <Row>{content()}</Row>
      <Row>
        <Col mdOffset={3} className="panel panel-transparent">
          <div className="panel-body">
            <h3 className="member-results" id="title">Related Works</h3>
          </div>
        </Col>
      </Row>
      <Row>{relatedContent()}</Row>
    </Layout>
  )
}

export default WorkPage
