'use client'

import React from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import CommonsError from 'src/components/Error/Error'
import Loading from 'src/components/Loading/Loading'
import WorksListing from 'src/components/WorksListing/WorksListing'
import SearchBox from 'src/components/SearchBox/SearchBox'
import mapSearchparams from './mapSearchParams'
import { useRelatedContentManager } from 'src/data/managers/RelatedContentManager'
import SummarySearchMetrics from 'src/components/SummarySearchMetrics/SummarySearchMetrics'

function getQueryVariables(doi: string, searchParams: URLSearchParams) {
  const { variables, connectionType } = mapSearchparams(Object.fromEntries(searchParams.entries()) as any)
  return { relatedDoi: doi, ...variables, connectionType }
}

export default function RelatedContent() {
  
  const doiParams = useParams().doi as string[]
  const doi = decodeURIComponent(doiParams.join('/'))
  const searchParams = useSearchParams()
  
  const vars = getQueryVariables(doi, searchParams)
  const manager = useRelatedContentManager(doi, vars)

  if (manager.isLoading) return <Row><Loading /></Row>

  if (manager.hasError)
    return <Row>
      <Col md={{ offset: 3 }} className="panel panel-transparent">
        <CommonsError title="An error occurred loading related content." message={manager.errorMessage} />
      </Col>
    </Row>

  if (!manager.hasData || !manager.hasAnyRelatedWorks) return (
    <Container fluid>
      <Row>
        <Col md={{ offset: 3 }}>
          <h3 className="member-results" id="title">Related Works</h3>
        </Col>
      </Row>
      <Row>
        <Col md={{ offset: 3 }} className="panel panel-transparent">
          <p>No related works found for this DOI.</p>
        </Col>
      </Row>
    </Container>
  )

  const { works, title: displayedConnectionTitle } = manager.selectedContent
  const { hasPagination, hasNextPage, endCursor } = manager.pagination
  const url = '/doi.org/' + doi + '/'
  return (
    <Container fluid>
      <Row>
        <Col md={3} className="d-none d-md-block">
          <SearchBox path={url} />
        </Col>
        <Col md={9}>
          <h3 className="member-results" id="title">Related Works</h3>
        </Col>
      </Row>
      <Row>
        <WorksListing
          works={works}
          loading={manager.isLoading}
          loadingFacets={manager.facetsAreLoading || manager.connectionCountsLoading}
          connectionTypesCounts={manager.connectionTypeCounts}
          showAnalytics={!manager.facetsAreLoading}
          showSankey={manager.showSankey}
          sankeyTitle={`Contributions to ${displayedConnectionTitle}`}
          showClaimStatus={true}
          hasPagination={hasPagination}
          hasNextPage={hasNextPage}
          model={'doi'}
          url={url+ '/?'}
          endCursor={endCursor} />
      </Row>
    </Container>
  )
}
