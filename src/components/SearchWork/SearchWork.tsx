'use client'

import React from 'react'
import Loading from '../Loading/Loading'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Error from 'src/components/Error/Error'

import { QueryVar, useSearchDoiQuery } from 'src/data/queries/searchDoiQuery'

import WorksListing from 'src/components/WorksListing/WorksListing'
import { pluralize } from 'src/utils/helpers'

interface Props {
  variables: QueryVar
}

export default function SearchWork(props: Props) {
  const { loading, data, error } = useSearchDoiQuery(props.variables)

  if (loading) return <Row><Loading /></Row>

  if (error) return (
    <Row>
      <Col md={{ span: 9, offset: 3 }}>
        <Error title="An error occured." message={error.message} />
      </Col>
    </Row>
  )

  const works = data?.works


  if (!works || works.nodes.length == 0) return (
    <Col md={{ span: 9, offset: 3 }}>
      <div className="alert-works">
        <Alert variant="warning">No works found.</Alert>
      </div>
    </Col>
  )

  return (<>
    <Row>
      <Col md={{ span: 9, offset: 3 }}>
        {works.totalCount > 0 && (
          <h3 className="member-results">{pluralize(works.totalCount, 'Work')}</h3>
        )}
      </Col>
    </Row>
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
  </>
  )
}
