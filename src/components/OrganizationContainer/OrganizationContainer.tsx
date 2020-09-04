import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Col } from 'react-bootstrap'
import { useQueryState } from 'next-usequerystate'
import { useRouter } from 'next/router'
import Pluralize from 'react-pluralize'

import Error from '../Error/Error'
import Organization from '../Organization/Organization'
import { OrganizationMetadataRecord } from '../OrganizationMetadata/OrganizationMetadata'
import WorksListing from '../WorksListing/WorksListing'
import Loading from '../Loading/Loading'
import { rorFromUrl } from '../../utils/helpers'

import {
  Works,
  connectionFragment,
  contentFragment
} from '../SearchWork/SearchWork'

type Props = {
  rorId?: string
  gridId?: string
  crossrefFunderId?: string
  searchQuery: string
}

interface OrganizationResult {
  id: string
  name: string
  alternateName: string[]
  inceptionYear: number
  url: string
  wikipediaUrl: string
  twitter: string
  types: string[]
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

interface ContentFacet {
  id: string
  title: string
  count: number
}

interface OrganizationQueryData {
  organization: OrganizationResult
}

interface OrganizationQueryVar {
  id: string
  gridId: string
  crossrefFunderId: string
  query: string
  cursor: string
  published: string
  resourceTypeId: string
  language: string
  fieldOfScience: string
  license: string
  registrationAgency: string
}

export const ORGANIZATION_GQL = gql`
  query getOrganizationQuery(
    $id: ID
    $gridId: ID
    $crossrefFunderId: ID
    $cursor: String
    $query: String
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
      id
      name
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
      works(
        first: 25
        after: $cursor
        query: $query
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

const OrganizationContainer: React.FunctionComponent<Props> = ({
  rorId,
  gridId,
  crossrefFunderId,
  searchQuery
}) => {
  const router = useRouter()
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
  const { loading, error, data } = useQuery<
    OrganizationQueryData,
    OrganizationQueryVar
  >(ORGANIZATION_GQL, {
    errorPolicy: 'all',
    variables: {
      id: rorId,
      gridId: gridId,
      crossrefFunderId: crossrefFunderId,
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
      <div className="row">
        <Loading />
      </div>
    )

  if (error)
    return (
      <Col md={9} mdOffset={3}>
        <Error title="An error occured." message={error.message} />
      </Col>
    )

  const organization = (() => {
    let organization = data.organization
    let grid = organization.identifiers.filter((i) => {
      return i.identifierType === 'grid'
    })
    let fundref = organization.identifiers.filter((i) => {
      return i.identifierType === 'fundref'
    })
    let isni = organization.identifiers.filter((i) => {
      return i.identifierType === 'isni'
    })
    let wikidata = organization.identifiers.filter((i) => {
      return i.identifierType === 'wikidata'
    })

    let orgMetadata: OrganizationMetadataRecord = {
      id: organization.id,
      name: organization.name,
      alternateNames: organization.alternateName,
      inceptionYear: organization.inceptionYear,
      types: organization.types,
      url: organization.url,
      wikipediaUrl: organization.wikipediaUrl,
      twitter: organization.twitter,
      country: organization.country,
      geolocation: organization.geolocation,
      grid: grid,
      fundref: fundref,
      isni: isni,
      wikidata: wikidata,
      identifiers: organization.identifiers
    }

    return {
      metadata: orgMetadata
    }
  })()

  if (!organization) return <div></div>

  // if query was for gridId or crossrefFunderId and organization was found 
  if (!rorId && router) {
    router.push('/ror.org' + rorFromUrl(organization.metadata.id))
    return (
      <div className="row">
        <Loading />
      </div>
    )
  }

  const relatedContent = () => {
    const hasNextPage = data.organization.works.totalCount > 25
    const endCursor = data.organization.works.pageInfo
      ? data.organization.works.pageInfo.endCursor
      : ''

    const totalCount = data.organization.works.totalCount

    return (
      <div>
        <Col md={9} mdOffset={3}>
          {totalCount > 0 && (
            <h3 className="member-results">
              {totalCount.toLocaleString('en-US') + ' '}
              <Pluralize
                singular={'Work'}
                count={totalCount}
                showCount={false}
              />
            </h3>
          )}
        </Col>
        {/* TODO: I think the pager element within this should be more dynamic
        and not need to rely on passing in precalculated //
        hasNextPage/endCursor instead calculate based on data provided */}
        <WorksListing
          works={data.organization.works}
          loading={loading}
          showFacets={true}
          showAnalytics={true}
          hasPagination={data.organization.works.totalCount > 25}
          hasNextPage={hasNextPage}
          model={'organization'}
          url={'/ror.org/' + rorId + '/?'}
          endCursor={endCursor}
        />
      </div>
    )
  }

  const content = () => {
    return (
      <Col md={9} mdOffset={3} className="panel-list" id="content">
        <h3 className="member-results">{organization.metadata.id}</h3>
        <Organization organization={organization} />
      </Col>
    )
  }

  return (
    <>
      <Row>{content()}</Row>
      <Row>{relatedContent()}</Row>
    </>
  )
}

export default OrganizationContainer
