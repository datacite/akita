'use client'

import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import { pluralize } from '../../utils/helpers'

import Pager from 'src/components/Pager/Pager'
import Error from 'src/components/Error/Error'
import OrganizationMetadata from 'src/components/OrganizationMetadata/OrganizationMetadata'
import Loading from 'src/components/Loading/Loading'

import { QueryVar, useSearchOrganizationQuery } from 'src/data/queries/searchOrganizationQuery'
import FacetList from 'src/components/FacetList/FacetList'
import FacetListGroup from 'src/components/FacetList/FacetListGroup'

type Props = {
  variables: QueryVar
}

export default function SearchOrganizations(props: Props) {
  const { loading, data, error } = useSearchOrganizationQuery(props.variables)

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

  const renderResults = () => {
    const hasNextPage = organizations.pageInfo
      ? organizations.pageInfo.hasNextPage
      : false
    const endCursor = organizations.pageInfo
      ? organizations.pageInfo.endCursor
      : ''

    return (
      <>
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
      </>
    )
  }

  const renderFacets = () => {
    const defaultActiveKeys = ['country-facets', 'organization-type-facets']
    return (
      <FacetListGroup defaultActiveKey={defaultActiveKeys} >
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
      </FacetListGroup>
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
      <Col md={3}>
        {renderFacets()}
      </Col>
      <Col md={9}>
        {renderResults()}
      </Col>
    </Row>
  </>)
}
