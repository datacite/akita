'use client'

import React from 'react'
import { Col, Row } from 'react-bootstrap';
import Loading from 'src/components/Loading/Loading'

import { useOrganizationRelatedContentQuery, QueryVar } from 'src/data/queries/organizationRelatedContentQuery';

import Error from 'src/components/Error/Error'
import WorksListing from 'src/components/WorksListing/WorksListing'
import { pluralize } from 'src/utils/helpers';

interface Props {
  variables: QueryVar
  isBot?: boolean
}

export default function RelatedContent(props: Props) {
  const { variables, isBot = false } = props

  const { loading, data, error } = useOrganizationRelatedContentQuery(variables)

  if (isBot) return null

  if (loading) return <Row><Loading /></Row>

  if (error)
    return <Row>
      <Col md={{ offset: 3 }} className="panel panel-transparent">
        <Error title="An error occured loading related content." message={error.message} />
      </Col>
    </Row>

  if (!data) return

  const relatedWorks = data.organization.works

  const hasNextPage = relatedWorks.totalCount > 25
  const endCursor = relatedWorks.pageInfo
    ? relatedWorks.pageInfo.endCursor
    : ''

  const totalCount = relatedWorks.totalCount

  return (
    <>
      <Row className="mt-5">
        <Col md={{ offset: 3 }} className="px-0">
          <h3 className="member-results">{pluralize(totalCount, 'Work')}</h3>
        </Col>
      </Row>
      <WorksListing
        works={relatedWorks}
        loading={loading}
        showFacets={true}
        showAnalytics={true}
        showClaimStatus={true}
        hasPagination={relatedWorks.totalCount > 25}
        hasNextPage={hasNextPage}
        model={'organization'}
        url={'/ror.org/' + variables.id + '/?'}
        endCursor={endCursor}
      />
    </>
  )
}
