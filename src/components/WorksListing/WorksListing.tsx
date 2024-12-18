'use client'

import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'

import WorkFacets from 'src/components/WorkFacets/WorkFacets'
import WorkMetadata from 'src/components/WorkMetadata/WorkMetadata'
import { Works } from 'src/data/types'

import Pager from '../Pager/Pager'
import WorksDashboard from '../WorksDashboard/WorksDashboard'
import SankeyGraph, { multilevelToSankey } from 'src/components/SankeyGraph/SankeyGraph'

interface Props {
  works: Works
  showAnalytics: boolean
  showSankey?: boolean
  sankeyTitle?: string
  showFacets: boolean
  connectionTypesCounts?: { references: number, citations: number, parts: number, partOf: number, otherRelated: number, allRelated: number }
  showClaimStatus: boolean
  loading: boolean
  model: string
  url: string
  hasPagination: boolean
  hasNextPage: boolean
  endCursor: string
}

export default function WorksListing({
  works,
  showAnalytics,
  showFacets,
  connectionTypesCounts,
  showSankey,
  sankeyTitle = 'Contributions to Related Works',
  showClaimStatus,
  loading,
  model,
  url,
  hasPagination,
  hasNextPage,
  endCursor
}: Props) {

  const hasNoWorks = works.totalCount == 0
  const sankeyData = showSankey ? multilevelToSankey(works.personToWorkTypesMultilevel) : []

  const renderFacets = () => {
    return (
      <Col md={3} className="d-none d-md-block">
        <WorkFacets
          model={model}
          url={url}
          data={works}
          loading={loading}
          connectionTypesCounts={connectionTypesCounts}
        />
      </Col>
    )
  }

  const renderNoWorks = () => {
    return (
      <Col md={9}>
        <div className="alert-works">
          <Alert variant="warning">No works found.</Alert>
        </div>
      </Col>
    )
  }

  const renderWorks = () => {
    return (
      <Col md={9}>
        {showAnalytics && <WorksDashboard works={works} />}
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
      </Col>
    )
  }

  return (
    <Row>
      {showFacets && renderFacets()}
      {hasNoWorks ? renderNoWorks() : renderWorks()}
    </Row>
  )
}
