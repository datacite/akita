'use client'

import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Loading from 'src/components/Loading/Loading'
import CommonsError from 'src/components/Error/Error'
import WorksListing, { SortBy } from 'src/components/WorksListing/WorksListing'
import { useParams, useSearchParams } from 'next/navigation'
import mapSearchparams from './mapSearchParams'
import { useOrganizationRelatedContentManager } from 'src/data/managers/OrganizationRelatedContentManager'
import SummarySearchMetrics from 'src/components/SummarySearchMetrics/SummarySearchMetrics'
import SearchBox from 'src/components/SearchBox/SearchBox'
import CommonsLayout from 'src/components/CommonsLayout/CommonsLayout'

export default function RelatedContent() {
  const rorId = useParams().rorid as string
  const searchParams = useSearchParams()
  const { variables } = mapSearchparams(
    Object.fromEntries(searchParams.entries()) as any
  )

  const vars = { rorId, ...variables }
  const manager = useOrganizationRelatedContentManager(vars)

  if (manager.isLoading)
    return (
      <Row>
        <Loading />
      </Row>
    )

  if (manager.hasError)
    return (
      <CommonsLayout mainClassName="panel panel-transparent">
        <CommonsError
          title="An error occurred loading related content."
          message={manager.errorMessage}
        />
      </CommonsLayout>
    )

  if (!manager.hasData || !manager.hasAnyRelatedWorks)
    return (
      <>
        <CommonsLayout>
          <h3 className="member-results" id="title">
            Related Works
          </h3>
        </CommonsLayout>
        <CommonsLayout mainClassName="panel panel-transparent">
          <p>No related works found for this organization.</p>
        </CommonsLayout>
      </>
    )

  const { works } = manager.selectedContent
  const { hasPagination, hasNextPage, endCursor } = manager.pagination
  const url = '/ror.org/' + vars.rorId + '/'

  return (
    <>
      <CommonsLayout className="mt-5" mainClassName="px-0">
        <Row className="border-bottom ms-1 mb-3">
          <Col className="ps-0">
            <h3 className="member-results border-0 mb-0">Related Works</h3>
          </Col>
          <Col xs="auto">
            <SortBy />
          </Col>
        </Row>
      </CommonsLayout>
      <WorksListing
        works={works}
        loading={manager.isLoading}
        loadingFacets={
          manager.facetsAreLoading || manager.organizationCountsLoading
        }
        organizationRelationTypeCounts={manager.organizationRelationTypeCounts}
        showAnalytics={!manager.facetsAreLoading}
        showClaimStatus={true}
        hasPagination={hasPagination}
        hasNextPage={hasNextPage}
        model={'organization'}
        url={url + '?'}
        endCursor={endCursor}
        searchBox={
          <SearchBox path={url} placeholder="Search within these works..." />
        }
      >
        <div className="mt-1 mb-5">
          <SummarySearchMetrics {...vars} />
        </div>
      </WorksListing>
    </>
  )
}
