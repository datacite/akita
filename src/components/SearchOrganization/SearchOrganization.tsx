'use client'

import React from 'react'
import { useQuery } from '@apollo/client'
import { Row, Col, Alert } from 'react-bootstrap'
import { pluralize } from '../../utils/helpers'

import Pager from '../Pager/Pager'
import Error from '../Error/Error'
import { OrganizationMetadata } from '../OrganizationMetadata/OrganizationMetadata'
import Loading from '../Loading/Loading'

import { SEARCH_ORGANIZATIONS_GQL, QueryData, QueryVar } from 'src/data/queries/searchOrganizationQuery'
import FacetList from '../FacetList/FacetList'

type Props = {
  variables: QueryVar
}

export default function SearchOrganizations(props: Props) {
  const { loading, data, error } = useQuery<QueryData, QueryVar>(
    SEARCH_ORGANIZATIONS_GQL,
    {
      variables: props.variables,
      errorPolicy: 'all'
    }
  )

  if (loading) return <Row><Loading /></Row>

  if (error) return (
    <Row>
      <Col md={9} mdOffset={3}>
        <Error title="An error occured." message={error.message} />
      </Col>
    </Row>
  )

  const organizations = data?.organizations


  if (!organizations || organizations.nodes.length == 0) return (
    <Col md={9} mdOffset={3}>
      <div className="alert-works">
        <Alert bsStyle="warning">No organizations found.</Alert>
      </div>
    </Col>
  )

  const renderResults = () => {

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
          <OrganizationMetadata
            metadata={item}
            linkToExternal={false}
            key={item.id}
          />
        ))}

        {(data?.organizations.totalCount || 0) > 20 && (
          <Pager
            url={'/ror.org?'}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
          />
        )}
      </Col>
    )
  }

  const renderFacets = () => {

    return (
      <div className="col-md-3 hidden-xs hidden-sm">
        <FacetList
          data={data.organizations.countries}
          title="Country"
          id="country-facets"
          param="country"
          url="ror.org/?"
        />

        <FacetList
          data={data.organizations.types}
          title="Organization Type"
          id="organization-type-facets"
          param="types"
          url="ror.org/?"
        />
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
