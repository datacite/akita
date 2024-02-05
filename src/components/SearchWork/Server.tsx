'use client'

import React from 'react'
import { Alert, Row, Col } from 'react-bootstrap'

import WorksListing from '../WorksListing/Server'
import { pluralize } from '../../utils/helpers'
import { Works } from 'src/app/page'

export default function SearchWork (works: Works) {
  if (works.nodes.length == 0) return (
    <Col md={9} mdOffset={3}>
      <div className="alert-works">
        <Alert bsStyle="warning">No works found.</Alert>
      </div>
    </Col>
  )


  return (
    <Row>
      <div>
        <Col md={9} mdOffset={3} id="content">
          {works.totalCount > 0 && (
            <h3 className="member-results">{pluralize(works.totalCount, 'Work')}</h3>
          )}
        </Col>

        <WorksListing
          works={works}
          loading={false}
          showFacets={true}
          showAnalytics={false}
          sankeyTitle='test'
          showClaimStatus={true}
          model={'doi'}
          url={'doi.org/?'}
          hasPagination={works.totalCount > 25}
          hasNextPage={works.pageInfo.hasNextPage}
          endCursor={works.pageInfo.endCursor}
        />
      </div>
    </Row>
  )
}
