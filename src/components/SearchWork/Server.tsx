'use client'

import React from 'react'
import { useQuery } from '@apollo/client'
import Loading from '../Loading/Loading'
import { Alert, Row, Col } from 'src/components/Layout'
import Error from 'src/components/Error/Server'

import { SEARCH_DOI_QUERY, QueryData, QueryVar } from 'src/data/queries/searchDoiQuery'

import WorksListing from 'src/components/WorksListing/Server'
import { pluralize } from 'src/utils/helpers'

interface Props {
  variables: QueryVar
}

export default function SearchWork (props: Props) {
  const { loading, data, error } = useQuery<QueryData, QueryVar>(
    SEARCH_DOI_QUERY,
    {
      variables: props.variables,
      errorPolicy: 'all'
    }
  )

  if (loading) return <Row><Loading /></Row>

  if (error) return (
    <Row>
      <Col md={9} mdOffset={3}>
        <Error title="An error occured." message={error.message} />
      </Col>
    </Row>
  )

  const works = data?.works


  if (!works || works.nodes.length == 0) return (
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
