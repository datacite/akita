import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { useQueryState } from 'next-usequerystate'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Row, Col } from 'react-bootstrap'
import { useRouter } from 'next/router'

import Layout from '../../components/Layout/Layout'
import Error from '../../components/Error/Error'
import Organization from '../../components/Organization/Organization'
import WorksListing from '../../components/WorksListing/WorksListing'
import Loading from '../../components/Loading/Loading'
import {
  Works,
  connectionFragment,
  contentFragment
} from '../../components/SearchWork/SearchWork'
import { rorFromUrl, pluralize } from '../../utils/helpers'
import ShareLinks from '../../components/ShareLinks/ShareLinks'
import { Title } from 'src/components/Title/Title'
import DownloadReports from 'src/components/DownloadReports/DownloadReports'

type Props = {
  rorId?: string
  gridId?: string
  crossrefFunderId?: string
  isBot?: boolean
}

const ORGANIZATION_GQL = gql`
  query getOrganizationQuery(
    $id: ID
    $gridId: ID
    $crossrefFunderId: ID
  ) {
    organization(
      id: $id
      gridId: $gridId
      crossrefFunderId: $crossrefFunderId
    ) {
      id
      name
      memberId
      memberRoleId
      alternateName
      inceptionYear
      url
      wikipediaUrl
      twitter
      types
      country {
        id
        name
      }
      geolocation {
        pointLongitude
        pointLatitude
      }
      identifiers {
        identifier
        identifierType
      }
      citationCount
      viewCount
      downloadCount,
      works(first: 0) {
        totalCount
      }
    }
  }
`

export const RELATED_CONTENT_GQL = gql`
  query getRelatedContentQuery(
    $id: ID
    $gridId: ID
    $crossrefFunderId: ID
    $cursor: String
    $filterQuery: String
    $published: String
    $resourceTypeId: String
    $fieldOfScience: String
    $language: String
    $license: String
    $registrationAgency: String
  ) {
    organization(
      id: $id
      gridId: $gridId
      crossrefFunderId: $crossrefFunderId
    ) {
      works(
        first: 25
        after: $cursor
        query: $filterQuery
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
  }
  ${connectionFragment.workConnection}
  ${contentFragment.work}
`

interface OrganizationType {
  id: string
  name: string
  memberId: string
  memberRoleId: string
  alternateName: string[]
  inceptionYear: number
  url: string
  wikipediaUrl: string
  twitter: string
  types: string[]
  citationCount: number
  viewCount: number
  downloadCount: number
  country: {
    id: string
    name: string
  }
  geolocation: {
    pointLongitude: number
    pointLatitude: number
  }
  identifiers: [
    {
      identifier: string
      identifierType: string
    }
  ]
  works: Works
}

interface OrganizationQueryData {
  organization: OrganizationType
}

interface OrganizationQueryVar {
  id: string
  gridId: string
  crossrefFunderId: string
  filterQuery: string
  cursor: string
  published: string
  resourceTypeId: string
  language: string
  fieldOfScience: string
  license: string
  registrationAgency: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const rorId = context.params.rorid as string

  return {
    props: {
      rorId,
      isBot: JSON.parse(context.query.isBot as string)
    }
  }
}

const OrganizationPage: React.FunctionComponent<Props> = ({
  rorId,
  gridId,
  crossrefFunderId,
  isBot = false
}) => {
  const router = useRouter()
  const [filterQuery] = useQueryState('filterQuery')
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

  const variables = {
    id: rorId,
    gridId: gridId,
    crossrefFunderId: crossrefFunderId,
    cursor: cursor,
    filterQuery: filterQuery,
    published: published,
    resourceTypeId: resourceType,
    fieldOfScience: fieldOfScience,
    language: language,
    license: license,
    registrationAgency: registrationAgency
  }

  const organizationQuery = useQuery<
    OrganizationQueryData,
    OrganizationQueryVar
  >(ORGANIZATION_GQL, {
    errorPolicy: 'all',
    variables: variables
  })

  const relatedContentQuery = useQuery<
    OrganizationQueryData,
    OrganizationQueryVar
  >(RELATED_CONTENT_GQL, {
    errorPolicy: 'all',
    variables: variables,
    skip: isBot
  })

  if (organizationQuery.loading)
    return (
      <Layout path={'/ror.org/' + rorId}>
        <Loading />
      </Layout>
    )

  if (organizationQuery.error)
    return (
      <Layout path={'/ror.org/' + rorId}>
        <Col md={9} mdOffset={3}>
          <Error title="An error occured." message={organizationQuery.error.message} />
        </Col>
      </Layout>
    )

  const organization = organizationQuery.data.organization

  // if query was for gridId or crossrefFunderId and organization was found
  if (!rorId && router) {
    router.push('/ror.org' + rorFromUrl(organization.id))
    return (
      <div className="row">
        <Loading />
      </div>
    )
  }

  const title = organization.name
    ? 'DataCite Commons: ' + organization.name
    : 'DataCite Commons: No Name'

  const pageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/ror.org' + rorId
      : 'https://commons.stage.datacite.org/ror.org' + rorId

  const imageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/images/logo.png'
      : 'https://commons.stage.datacite.org/images/logo.png'

  const content = () => {
    return (
      <>
        <Col md={3} className="panel-list" id="side-bar">
          { !isBot && <DownloadReports
            links={[
              {
                title: 'Related Works (CSV)',
                helpText: 'Includes descriptions and formatted citations in APA style for up to 200 DOIs associated with this organization.',
                type: 'ror/related-works',
              },
              {
                title: 'Funders (CSV)',
                helpText: 'Includes up to 200 funders associated with related works.',
                type: 'ror/funders',
              }
            ]}
            variables={{
              id: rorId,
              gridId: gridId,
              crossrefFunderId: crossrefFunderId,
              cursor: cursor,
              filterQuery: filterQuery,
              published: published,
              resourceTypeId: resourceType,
              fieldOfScience: fieldOfScience,
              language: language,
              license: license,
              registrationAgency: registrationAgency
            }}
          /> }
          <ShareLinks url={'ror.org' + rorFromUrl(organization.id)} title={organization.name} />
        </Col>
        <Col md={9}>
          <Organization organization={organization} />
        </Col>
      </>
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

    const relatedWorks = relatedContentQuery.data.organization.works

    const hasNextPage = relatedWorks.totalCount > 25
    const endCursor = relatedWorks.pageInfo
      ? relatedWorks.pageInfo.endCursor
      : ''

    const totalCount = relatedWorks.totalCount

    return (
      <div>
        <Col md={9} mdOffset={3}>
          {totalCount > 0 && (
            <h3 className="member-results">{pluralize(totalCount, 'Work')}</h3>
          )}
        </Col>
        <WorksListing
          works={relatedWorks}
          loading={relatedContentQuery.loading}
          showFacets={true}
          showAnalytics={true}
          showClaimStatus={true}
          hasPagination={relatedWorks.totalCount > 25}
          hasNextPage={hasNextPage}
          model={'organization'}
          url={'/ror.org/' + rorId + '/?'}
          endCursor={endCursor}
        />
      </div>
    )
  }

  return (
    <Layout path={'/ror.org'}>
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta name="og:url" content={pageUrl} />
        <meta name="og:image" content={imageUrl} />
        <meta name="og:type" content="organization" />
      </Head>
      <Title title={organization.name} titleLink={organization.id} link={organization.id} />
      <Row>{content()}</Row>
      <Row>{relatedContent()}</Row>
    </Layout>
  )
}

export default OrganizationPage
