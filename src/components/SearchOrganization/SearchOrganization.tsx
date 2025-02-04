'use client'

import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { pluralize } from '../../utils/helpers'

import Pager from 'src/components/Pager/Pager'
import NoResults from 'src/components/NoResults/NoResults'
import OrganizationMetadata from 'src/components/OrganizationMetadata/OrganizationMetadata'
import Loading from 'src/components/Loading/Loading'

import { QueryVar, useRORSearch } from 'src/data/queries/searchOrganizationQuery'
import FacetList from 'src/components/FacetList/FacetList'

type Props = {
  variables: QueryVar
}

export default function SearchOrganizations(props: Props) {
  const { loading, data, error } = useRORSearch(props.variables)

  if (loading) return <Row><Loading /></Row>

  const organizations = data?.organizations
  if (error || !organizations || organizations.nodes.length == 0) return (
    <Row>
      <Col md={{ span: 9, offset: 3 }}>
        <NoResults />
      </Col>
    </Row>
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
