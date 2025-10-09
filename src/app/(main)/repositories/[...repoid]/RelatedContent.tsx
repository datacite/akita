'use client'

import React from 'react'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Loading from 'src/components/Loading/Loading'

import { useRepositoryRelatedContentQuery } from 'src/data/queries/repositoryRelatedContentQuery'

import Error from 'src/components/Error/Error'
import WorksListing from 'src/components/WorksListing/WorksListing'
import { pluralize } from 'src/utils/helpers';
import { useSearchParams } from 'next/navigation';
import mapSearchparams from './mapSearchParams';
import { Repository } from 'src/data/types'

interface Props {
  repository: Repository
}

export default function RelatedContent({ repository }: Props) {
  const clientId = repository.clientId

  const searchParams = useSearchParams()
  const { variables } = mapSearchparams(Object.fromEntries(searchParams.entries()) as any)

  const vars = { clientId, ...variables }
  const { loading, data, error } = useRepositoryRelatedContentQuery(vars)

  if (loading) return <Row><Loading /></Row>

  if (error)
    return <Row>
      <Col md={{ offset: 3 }} className="panel panel-transparent">
        <Error title="An error occured loading related content." message={error.message} />
      </Col>
    </Row>

  if (!data) return

  const relatedWorks = data.works

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
        model={'repository'}
        url={'/repositories/' + clientId + '/?'}
        endCursor={endCursor}
        show={{ all: true }}
      />
    </Container>
  )
}
