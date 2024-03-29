import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Col, Alert } from 'react-bootstrap'
import { useQueryState } from 'nuqs'
import { pluralize } from '../../utils/helpers'

import Pager from '../Pager/Pager'
import FilterItem from '../FilterItem/FilterItem'
import Error from '../Error/Error'
import { OrganizationMetadata } from '../OrganizationMetadata/OrganizationMetadata'
import Loading from '../Loading/Loading'

type Props = {
  searchQuery: string
}

interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}

interface OrganizationsNode {
  id: string
  name: string
  memberId: string
  memberRoleId: string
  alternateName: string[]
  inceptionYear: number
  types: string[]
  url: string
  wikipediaUrl: string
  twitter: string
  citationCount: number
  viewCount: number
  downloadCount: number
  geolocation: {
    pointLongitude: number
    pointLatitude: number
  }
  country: {
    id: string
    name: string
  }
  identifiers: [
    {
      identifier: string
      identifierType: string
    }
  ]
}

interface OrganizationFacet {
  id: string
  title: string
  count: number
}

interface OrganizationsQueryVar {
  query: string
  cursor: string
  types: string
  country: string
}

interface OrganizationsQueryData {
  organizations: {
    totalCount: number
    pageInfo: PageInfo
    types: OrganizationFacet[]
    countries: OrganizationFacet[]
    nodes: OrganizationsNode[]
  }
}

export const ORGANIZATIONS_GQL = gql`
  query searchOrganizationsQuery(
    $query: String
    $cursor: String
    $types: String
    $country: String
  ) {
    organizations(
      query: $query
      after: $cursor
      types: $types
      country: $country
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      types {
        id
        count
        title
      }
      countries {
        id
        count
        title
      }
      nodes {
        id
        name
        memberId
        memberRoleId
        alternateName
        inceptionYear
        types
        url
        wikipediaUrl
        country {
          id
          name
        }
        identifiers {
          identifier
          identifierType
        }
      }
    }
  }
`

const SearchOrganizations: React.FunctionComponent<Props> = ({
  searchQuery
}) => {
  const [cursor] = useQueryState('cursor', { history: 'push' })
  const [types] = useQueryState('types')
  const [country] = useQueryState('country')

  const { loading, error, data } = useQuery<
    OrganizationsQueryData,
    OrganizationsQueryVar
  >(ORGANIZATIONS_GQL, {
    errorPolicy: 'all',
    variables: {
      query: searchQuery,
      cursor: cursor as string,
      types: types as string,
      country: country as string
    }
  })

  const renderResults = () => {
    if (loading) return <Loading />

    if (error)
      return (
        <Col md={9} mdOffset={3}>
          <Error title="An error occured." message={error.message} />
        </Col>
      )

    if (data?.organizations.nodes.length == 0)
      return (
        <Col md={9} mdOffset={3}>
          <div className="alert-works">
            <Alert bsStyle="warning">No organizations found.</Alert>
          </div>
        </Col>
      )

    const hasNextPage = data?.organizations.pageInfo
      ? data.organizations.pageInfo.hasNextPage
      : false
    const endCursor = data?.organizations.pageInfo
      ? data.organizations.pageInfo.endCursor
      : ''

    return (
      <Col md={9} id="content">
        {(data?.organizations.nodes.length || 0) > 0 && (
          <h3 className="member-results">
            {pluralize(data?.organizations.totalCount || 0, 'Organization')}
          </h3>
        )}

        {data?.organizations.nodes.map((item) => (
          <React.Fragment key={item.id}>
            <OrganizationMetadata
              metadata={item}
              linkToExternal={false}
          ></OrganizationMetadata>
          </React.Fragment>
        ))}

        {(data?.organizations.totalCount || 0) > 20 && (
          <Pager
            url={'/ror.org?'}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
          ></Pager>
        )}
      </Col>
    )
  }

  const renderFacets = () => {
    if (loading) return <div className="col-md-3"></div>

    if (!loading && data && data.organizations.totalCount == 0)
      return <div className="col-md-3"></div>

    return (
      <div className="col-md-3 hidden-xs hidden-sm">
        <div className="panel facets add">
          <div className="panel-body">
            <h4>Country</h4>
            <ul>
              {data &&
                data.organizations.countries.map((facet) => (
                  <li key={facet.id}>
                    <FilterItem
                      name="country"
                      id={facet.id}
                      title={facet.title}
                      count={facet.count}
                    />
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="panel facets add">
          <div className="panel-body">
            <h4>Organization Type</h4>
            <ul>
              {data &&
                data.organizations.types.map((facet) => (
                  <li key={facet.id}>
                    <FilterItem
                      name="types"
                      id={facet.id}
                      title={facet.title}
                      count={facet.count}
                    />
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Row>
      {renderFacets()}
      {renderResults()}
    </Row>
  )
}

export default SearchOrganizations
