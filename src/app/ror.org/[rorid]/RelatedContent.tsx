'use client'

import React from 'react'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Loading from 'src/components/Loading/Loading'

import { useOrganizationRelatedContentQuery } from 'src/data/queries/organizationRelatedContentQuery';

import Error from 'src/components/Error/Error'
import WorksListing from 'src/components/WorksListing/WorksListing'
import { pluralize } from 'src/utils/helpers';
import { useSearchParams } from 'next/navigation';
import mapSearchparams from './mapSearchParams';

interface Props {
  isBot?: boolean
  rorId: string
  rorFundingIds: string[]
}

export default function RelatedContent(props: Props) {
  const { isBot = false, rorId, rorFundingIds } = props

  const searchParams = useSearchParams()
  const { variables } = mapSearchparams(Object.fromEntries(searchParams.entries()) as any)

  const vars = { rorId, rorFundingIds, ...variables }
  const { loading, data, error } = useOrganizationRelatedContentQuery(vars)

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
    <Container fluid>
      <Row className="mt-5">
        <Col md={{ offset: 3 }} className="px-0">
          <h3 className="member-results">{pluralize(totalCount, 'Work')}</h3>
        </Col>
      </Row>
      <WorksListing
        works={relatedWorks}
        loading={loading}
        showAnalytics={true}
        showClaimStatus={true}
        hasPagination={relatedWorks.totalCount > 25}
        hasNextPage={hasNextPage}
        model={'organization'}
        url={'/ror.org/' + vars.rorId + '/?'}
        endCursor={endCursor}
      />
    </Container>
  )
}
