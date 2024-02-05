import React from 'react'
import { Col, Alert, Row } from 'react-bootstrap'

import WorkFacets from '../WorkFacets/Server'
import WorkMetadata from '../WorkMetadata/WorkMetadata'
import { Works } from '../SearchWork/SearchWork'

import Pager from '../Pager/Server'
import WorksDashboard from '../WorksDashboard/WorksDashboard'
import SankeyGraph, { multilevelToSankey } from '../SankeyGraph/SankeyGraph'

type Props = {
  works: Works
  showAnalytics: boolean
  showSankey?: boolean
  sankeyTitle?: string
  showFacets: boolean
  connectionTypesCounts?: { references: number, citations: number, parts: number, partOf: number, otherRelated: number }
  showClaimStatus: boolean
  loading: boolean
  model: string
  url: string
  hasPagination: boolean
  hasNextPage: boolean
  endCursor: string
}

export interface ContentFacet {
  id: string
  title: string
  count: number
}

export default function WorksListing ({
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
      <div className="col-md-3 hidden-xs hidden-sm">
        <WorkFacets
          model={model}
          url={url}
          data={works}
          loading={loading}
          connectionTypesCounts={connectionTypesCounts}
        ></WorkFacets>
      </div>
    )
  }

  const renderNoWorks = () => {
    return (
      <Col md={9}>
        <div className="alert-works">
          <Alert bsStyle="warning">No works found.</Alert>
        </div>
      </Col>
    )
  }

  const renderWorks = () => {
    return (
      <Col md={9} id="content">
        {showAnalytics && <WorksDashboard works={works} />}
        {showSankey && <Row>
          <Col xs={12}>
            <SankeyGraph titleText={sankeyTitle} data={sankeyData} tooltipText='This chart shows the number of times the top Creators & Contributors with ORCID iDs were associated with different work types.' />
          </Col>
        </Row>}

        {works.nodes.map((doi) => (
          <React.Fragment key={doi.doi}>
            <WorkMetadata metadata={doi} linkToExternal={false} showClaimStatus={showClaimStatus}></WorkMetadata>
          </React.Fragment>
        ))}

        {hasPagination && (
          <Pager
            url={url}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
          ></Pager>
        )}
      </Col>
    )
  }

  return (
    <>
      {showFacets && renderFacets()}

      {hasNoWorks ? renderNoWorks() : renderWorks()}
    </>
  )
}
