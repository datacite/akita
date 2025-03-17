'use client'

import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import WorkFacets from 'src/components/WorkFacets/WorkFacets'
import WorkMetadata from 'src/components/WorkMetadata/WorkMetadata'
import { Works } from 'src/data/types'
import Loading from 'src/components/Loading/Loading'
import LoadingFacetList from 'src/components/Loading/LoadingFacetList'
import NoResults from 'src/components/NoResults/NoResults'

import Pager from 'src/components/Pager/Pager'
import WorksDashboard, { ShowCharts } from 'src/components/WorksDashboard/WorksDashboard'
import SankeyGraph, { multilevelToSankey } from 'src/components/SankeyGraph/SankeyGraph'

interface Props {
  works: Works
  showAnalytics: boolean
  showSankey?: boolean
  sankeyTitle?: string
  connectionTypesCounts?: { references: number, citations: number, parts: number, partOf: number, otherRelated: number, allRelated: number }
  showClaimStatus: boolean
  loading: boolean
  loadingFacets?: boolean
  model: string
  url: string
  hasPagination: boolean
  hasNextPage: boolean
  endCursor: string
  show: ShowCharts
}

export default function WorksListing({
  works,
  showAnalytics,
  connectionTypesCounts,
  showSankey,
  sankeyTitle = 'Contributions to Related Works',
  showClaimStatus,
  loading,
  loadingFacets = false,
  model,
  url,
  hasPagination,
  hasNextPage,
  endCursor,
  show = { publicationYear: true, resourceTypes: true, licenses: true }
}: Props) {

  const hasNoWorks = works.totalCount == 0
  const sankeyData = showSankey ? multilevelToSankey(works.personToWorkTypesMultilevel) : []

  const renderFacets = () => {
    return (
      <WorkFacets
        model={model}
        url={url}
        data={works}
        connectionTypesCounts={connectionTypesCounts}
      />
    )
  }

  const renderNoWorks = () => {
    return (
      <NoResults />
    )
  }

  const renderWorks = () => {
    if (hasNoWorks) return renderNoWorks()
    return (
      <>
        {showAnalytics && <WorksDashboard works={works} show={show} />}
        {showSankey && <Row>
          <Col xs={12}>
            <SankeyGraph titleText={sankeyTitle} data={sankeyData} tooltipText='This chart shows the number of times the top Creators & Contributors with ORCID iDs were associated with different work types.' />
          </Col>
        </Row>}

        {works.nodes.map((doi) => (
          <Row key={doi.doi} className="mb-4 work">
            <WorkMetadata metadata={doi} linkToExternal={false} showClaimStatus={showClaimStatus} />
          </Row>
        ))}

        {hasPagination && (
          <Row>
            <Pager
              url={url}
              hasNextPage={hasNextPage}
              endCursor={endCursor}
            />
          </Row>
        )}
      </>
    )
  }

  return (
    <Row>
      <Col md={3} className={'d-none d-md-block' + (['doi.org/?'].includes(url) ? ' px-4' : ' pe-4')}>
        {loadingFacets ? <Row><LoadingFacetList count={4} numberOfLines={10} /></Row> : renderFacets()}
      </Col>
      <Col md={9}>
        {loading ? <Loading /> : renderWorks()}
      </Col>
    </Row>
  )
}
