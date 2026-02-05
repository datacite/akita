'use client'

import React from 'react'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Loading from 'src/components/Loading/Loading'
import CommonsError from 'src/components/Error/Error'
import WorksListing from 'src/components/WorksListing/WorksListing'
import { useSearchParams } from 'next/navigation'
import mapSearchparams from './mapSearchParams'
import { useOrganizationRelatedContentManager } from 'src/data/managers/OrganizationRelatedContentManager'
import SummarySearchMetrics from 'src/components/SummarySearchMetrics/SummarySearchMetrics'

interface Props {
  rorId: string
}

export default function RelatedContent(props: Props) {
  const { rorId } = props

  const searchParams = useSearchParams()
  const { variables } = mapSearchparams(Object.fromEntries(searchParams.entries()) as any)

  const vars = { rorId, ...variables }
  const manager = useOrganizationRelatedContentManager(vars)

  if (manager.isLoading) return <Row><Loading /></Row>

  if (manager.hasError)
    return (
      <Row>
        <Col md={{ offset: 3 }} className="panel panel-transparent">
          <CommonsError title="An error occurred loading related content." message={manager.errorMessage} />
        </Col>
      </Row>
    )

  if (!manager.hasData || !manager.hasAnyRelatedWorks)
    return (
      <Container fluid>
        <Row>
          <Col md={{ offset: 3 }}>
            <h3 className="member-results" id="title">Related Works</h3>
          </Col>
        </Row>
        <Row>
          <Col md={{ offset: 3 }} className="panel panel-transparent">
            <p>No related works found for this organization.</p>
          </Col>
        </Row>
      </Container>
    )

  const { works, title: displayedConnectionTitle } = manager.selectedContent
  const { hasPagination, hasNextPage, endCursor } = manager.pagination

  return (
    <Container fluid className="mt-5">
      <Row>
        <Col md={{ offset: 3 }}>
          <h3 className="member-results" id="title">Related Works</h3>
          <SummarySearchMetrics {...vars} />
        </Col>
      </Row>
      <Row>
        <WorksListing
          works={works}
          loading={manager.isLoading}
          loadingFacets={manager.facetsAreLoading || manager.organizationCountsLoading}
          organizationRelationTypeCounts={manager.organizationRelationTypeCounts}
          showAnalytics={!manager.facetsAreLoading}
          showClaimStatus={true}
          hasPagination={hasPagination}
          hasNextPage={hasNextPage}
          model={'organization'}
          url={'/ror.org/' + vars.rorId + '/?'}
          endCursor={endCursor}
        />
      </Row>
    </Container>
  )
}
