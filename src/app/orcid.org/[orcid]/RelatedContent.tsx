'use client'

import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Loading from 'src/components/Loading/Loading'

import { usePersonRelatedContentQuery } from 'src/data/queries/personRelatedContentQuery'

import Error from 'src/components/Error/Error'
import WorksListing from 'src/components/WorksListing/WorksListing'
import { pluralize } from 'src/utils/helpers';
import { useParams, useSearchParams } from 'next/navigation'
import mapSearchparams from './mapSearchParams'

interface Props {
  isBot?: boolean
}

export default function RelatedContent(props: Props) {
  const { isBot = false } = props
  const orcid = useParams().orcid as string

  const searchParams = useSearchParams()
  const { variables } = mapSearchparams(Object.fromEntries(searchParams.entries()) as any)

  const vars = { id: 'http://orcid.org/' + orcid, ...variables }

  const { loading, data, error } = usePersonRelatedContentQuery(vars)

  if (isBot) return null

  if (loading) return <Row><Loading /></Row>

  if (error)
    return <Row>
      <Col md={{ offset: 3 }} className="panel panel-transparent">
        <Error title="An error occured loading related content." message={error.message} />
      </Col>
    </Row>

  if (!data) return

  const relatedWorks = data.person.works

  const hasNextPage = relatedWorks.pageInfo
    ? relatedWorks.pageInfo.hasNextPage
    : false
  const endCursor = relatedWorks.pageInfo
    ? relatedWorks.pageInfo.endCursor
    : ''

  return (<Container fluid>
    <Row>
      <Col md={{ offset: 3 }}>
        <h3 className="member-results" id="title">{pluralize(relatedWorks.totalCount, 'Work')}</h3>
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
      model={'person'}
      url={'/orcid.org/' + orcid + '/?'}
      endCursor={endCursor}
    />
  </Container>)
}
