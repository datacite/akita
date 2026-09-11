'use client'

import React from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import CommonsError from 'src/components/Error/Error'
import Loading from 'src/components/Loading/Loading'
import WorksListing, { SortBy } from 'src/components/WorksListing/WorksListing'
import SearchBox from 'src/components/SearchBox/SearchBox'
import mapSearchparams from './mapSearchParams'
import { useRelatedContentManager } from 'src/data/managers/RelatedContentManager'
import CommonsLayout from 'src/components/CommonsLayout/CommonsLayout'

function getQueryVariables(doi: string, searchParams: URLSearchParams) {
  const { variables, connectionType } = mapSearchparams(
    Object.fromEntries(searchParams.entries()) as any
  )
  return { relatedDoi: doi, ...variables, connectionType }
}

export default function RelatedContent() {
  const doiParams = useParams().doi as string[]
  const doi = decodeURIComponent(doiParams.join('/'))
  const searchParams = useSearchParams()

  const vars = getQueryVariables(doi, searchParams)
  const manager = useRelatedContentManager(doi, vars)

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
          <p>No related works found for this DOI.</p>
        </CommonsLayout>
      </>
    )

  const { works, title: displayedConnectionTitle } = manager.selectedContent
  const { hasPagination, hasNextPage, endCursor } = manager.pagination
  const url = '/doi.org/' + doi + '/'
  return (
    <>
      <CommonsLayout>
        <Row className="border-bottom ms-1 mb-3">
          <Col className="ps-0">
            <h3 className="member-results border-0 mb-0" id="title">
              Related Works
            </h3>
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
          manager.facetsAreLoading || manager.connectionCountsLoading
        }
        connectionTypesCounts={manager.connectionTypeCounts}
        showAnalytics={!manager.facetsAreLoading}
        showSankey={manager.showSankey}
        sankeyTitle={`Contributions to ${displayedConnectionTitle}`}
        showClaimStatus={true}
        hasPagination={hasPagination}
        hasNextPage={hasNextPage}
        model={'doi'}
        url={url + '?'}
        endCursor={endCursor}
        searchBox={
          <SearchBox path={url} placeholder="Search within these works..." />
        }
      />
    </>
  )
}
