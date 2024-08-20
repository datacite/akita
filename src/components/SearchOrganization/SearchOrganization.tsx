'use client'

import React from 'react'
import { useQuery } from '@apollo/client'
import { Row, Col, Alert } from 'src/components/Layout-4'
import { pluralize } from '../../utils/helpers'

import Pager from '../Pager/Pager'
import Error from '../Error/Error'
import OrganizationMetadata from '../OrganizationMetadata/OrganizationMetadata'
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
      <Col md={{ span: 9, offset: 3 }}>
        <Error title="An error occured." message={error.message} />
      </Col>
    </Row>
  )

  const organizations = data?.organizations

  if (!organizations || organizations.nodes.length == 0) return (
    <Col md={{ span: 9, offset: 3 }}>
      <div className="alert-works">
        <Alert variant="warning">No organizations found.</Alert>
      </div>
    </Col>
  )



  if (!organizations || organizations.nodes.length == 0) return (
    <Col md={{ span: 9, offset: 3 }}>
      <div className="alert-works">
        <Alert variant="warning">No organizations found.</Alert>
      </div>
    </Col>
  )

  const renderResults = () => {
    const hasNextPage = organizations.pageInfo
      ? organizations.pageInfo.hasNextPage
      : false
    const endCursor = organizations.pageInfo
      ? organizations.pageInfo.endCursor
      : ''

    return (
      <Col md={9}>
        {organizations.nodes.map((item) => (
          <Row key={item.id} className="mb-4 organization"><Col>
            <OrganizationMetadata
              metadata={item}
              linkToExternal={false}
            />
          </Col></Row>
        ))}

        {(organizations.totalCount || 0) > 20 && (
          <Row>
            <Pager
              url={'/ror.org?'}
              hasNextPage={hasNextPage}
              endCursor={endCursor}
            />
          </Row>
        )}
      </Col>
    )
  }

  const renderFacets = () => {
    return (
      <Col md={3} className="d-none d-md-block facets">
        <FacetList
          data={organizations.countries}
          title="Country"
          id="country-facets"
          param="country"
          url="ror.org/?"
        />

        <FacetList
          data={organizations.types}
          title="Organization Type"
          id="organization-type-facets"
          param="types"
          url="ror.org/?"
        />
      </Col>
    )
  }

  return (<>
    <Row>
      <Col md={{ span: 9, offset: 3 }}>
        {organizations.totalCount > 0 && (
          <h3 className="member-results">{pluralize(organizations.totalCount || 0, 'Organization')}</h3>
        )}
      </Col>
    </Row>
    <Row>
      {renderFacets()}
      {renderResults()}
    </Row>
  </>)
}
