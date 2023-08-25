import React from 'react'
import { Col, Alert, Row } from 'react-bootstrap'

import WorkFacets from '../WorkFacets/WorkFacets'
import WorkMetadata from '../WorkMetadata/WorkMetadata'
import { Works } from '../SearchWork/SearchWork'

import Pager from '../Pager/Pager'
import WorksDashboard from '../WorksDashboard/WorksDashboard'
import SankeyGraph, { multilevelToSankey } from '../SankeyGraph/SankeyGraph'

type Props = {
  works: Works
  showAnalytics: boolean
  showSankey?: boolean
  sankeyTitle?: string
  showFacets: boolean
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

const WorksListing: React.FunctionComponent<Props> = ({
  works,
  showAnalytics,
  showFacets,
  showSankey,
  sankeyTitle = 'SANKEY',
  showClaimStatus,
  loading,
  model,
  url,
  hasPagination,
  hasNextPage,
  endCursor
}) => {

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
            <SankeyGraph titleText={sankeyTitle} data={sankeyData} />
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

export default WorksListing
