import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useQueryState } from 'nuqs'
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

import { Work as WorkType, Metadata as MetadataType } from 'src/data/types'

type Props = {
  doi: string
  metadata: MetadataQueryData
  isBot?: boolean
}

export const CROSSREF_FUNDER_GQL = gql`
  query getCrossFunderQuery($crossrefFunderId: ID) {
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


const DOI_GQL = gql`
  query getDoiQuery(
    $id: ID!
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
    }
  }
  ${contentFragment.work}
`

export const RELATED_CONTENT_GQL = gql`
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
      doi,
      types {
        resourceTypeGeneral,
        resourceType
      },
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
      return {
        props: {
          doi,
          metadata: data,
          isBot: JSON.parse(context.query.isBot as string)
        }
      }
    }
  }
}


function isDMP (work: WorkType) {
  return work.types.resourceTypeGeneral === 'OutputManagementPlan'
}


function isProject (work: WorkType) {
  return work.types.resourceType === 'Project' && (work.types.resourceTypeGeneral === 'Other' || work.types.resourceTypeGeneral === 'Text')
}



const WorkPage: React.FunctionComponent<Props> = ({ doi, metadata, isBot = false }) => {
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

  let type = metadata.work.types.resourceTypeGeneral
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

  const variables = {
    id: doi,
    cursor: cursor as string,
    filterQuery: filterQuery as string,
    published: published as string,
    resourceTypeId: resourceType as string,
    fieldOfScience: fieldOfScience as string,
    language: language as string,
    license: license as string,
    registrationAgency: registrationAgency as string
  }

  const doiQuery = useQuery<WorkQueryData, QueryVar>(DOI_GQL, { errorPolicy: 'all', variables: variables })
  const relatedContentQuery = useQuery<WorkQueryData, QueryVar>(RELATED_CONTENT_GQL, {
    errorPolicy: 'all',
    variables: variables,
    skip: isBot
  })

  if (doiQuery.loading)
    return (
      <Layout path={'/doi.org/' + doi}>
        <Loading />
      </Layout>
    )

  if (doiQuery.error)
    return (
      <Layout path={'/doi.org/' + doi}>
        <Col md={9} mdOffset={3}>
          <Error title="An error occured." message={doiQuery.error.message} />
        </Col>
      </Layout>
    )

  const work = doiQuery.data?.work || {} as WorkType


  const content = () => {
    return (
      <Row>
        <Col md={3} id="side-bar">
          <div className='left-menu-buttons'>
            { work.registrationAgency.id == "datacite" && (
              <Claim doi_id={work.doi} />
            )}
            <DownloadMetadata doi={work} />
          </div>
          <CiteAs doi={work} />
          { !isBot && <DownloadReports
            links={[
              {
                title: 'Related Works (CSV)',
                helpText: `Includes descriptions and formatted citations in APA style for up to 200 DOIs associated with this ${isProject(work) ? 'project' : 'work'}.`,
                type: 'doi/related-works',
              }
            ]}
            variables={{
              id: doi,
              cursor: cursor as string,
              filterQuery: filterQuery as string,
              published: published as string,
              resourceTypeId: resourceType as string,
              fieldOfScience: fieldOfScience as string,
              language: language as string,
              license: license as string,
              registrationAgency: registrationAgency as string
            }}
          /> }
          <ShareLinks url={'doi.org/' + work.doi} title={work.titles[0] ? work.titles[0].title : undefined} />
        </Col>
        <Col md={9} id="content">
          <Work doi={work}></Work>
        </Col>
      </Row>
    )
  }

  const relatedContent = () => {
    if (relatedContentQuery.loading) return <Loading />

    if (relatedContentQuery.error)
      return <Row>
        <Col mdOffset={3} className="panel panel-transparent">
          <Error title="An error occured loading related content." message={relatedContentQuery.error.message} />
        </Col>
      </Row>

    if (!relatedContentQuery.data) return

    const relatedWorks = relatedContentQuery.data.work

    const referenceCount = relatedWorks.references?.totalCount || 0
    const citationCount = relatedWorks.citations?.totalCount || 0
    const partCount = relatedWorks.parts?.totalCount || 0
    const partOfCount = relatedWorks.partOf?.totalCount || 0
    const otherRelatedCount = relatedWorks.otherRelated?.totalCount || 0

    if (referenceCount + citationCount + partCount + partOfCount + otherRelatedCount === 0) return ''

    const url = '/doi.org/' + relatedWorks.doi + '/?'

    const connectionTypeCounts = {
      references: referenceCount,
      citations: citationCount,
      parts: partCount,
      partOf: partOfCount,
      otherRelated: otherRelatedCount
    }

    const defaultConnectionType =
      referenceCount > 0 ? 'references' :
      citationCount > 0 ? 'citations' :
      partCount > 0 ? 'parts' :
      partOfCount > 0 ? 'partOf' : 'otherRelated'

    const displayedConnectionType = connectionType ? connectionType : defaultConnectionType


    const works: Works = displayedConnectionType in relatedWorks ?
      relatedWorks[displayedConnectionType] :
      { totalCount: 0, nodes: [] }

    const hasNextPage = works.pageInfo ? works.pageInfo.hasNextPage : false
    const endCursor = works.pageInfo ? works.pageInfo.endCursor : ''

    const showSankey = isDMP(relatedWorks) || isProject(relatedWorks)

    return (
      <>
        <Row>
          <Col mdOffset={3} className="panel panel-transparent">
            <div className="panel-body">
              <h3 className="member-results" id="title">Related Works</h3>
            </div>
          </Col>
        </Row>
        <Row>
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
        </Row>
      </>
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

      {content()}
      {relatedContent()}
    </Layout>
  )
}

export default WorkPage
