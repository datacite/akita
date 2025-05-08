'use client'

import React from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Error from 'src/components/Error/Error'
import Loading from 'src/components/Loading/Loading'
import WorksListing from 'src/components/WorksListing/WorksListing'

import mapSearchparams from '../../[...doi]/mapSearchParams'
import { useRelatedContentManager } from './RelatedContentManager'

interface Props {
  isBot?: boolean
}

function getQueryVariables(){
  const doiParams = useParams().doi as string[]
  const doi = decodeURIComponent(doiParams.join('/'))
  const searchParams = useSearchParams()
  const { variables } = mapSearchparams(Object.fromEntries(searchParams.entries()) as any)
  return { id: doi, ...variables }
}

function getConnectionType(){
  const searchParams = useSearchParams()
  const { connectionType } = mapSearchparams(Object.fromEntries(searchParams.entries()) as any)
  return connectionType
}

export default function RelatedContent(props: Props) {
  const { isBot = false } = props
  if (isBot) return null
  const vars = getQueryVariables()
  const connectionType = getConnectionType()
  const manager = useRelatedContentManager(vars, connectionType)

  if (manager.isLoading) return <Row><Loading /></Row>

  if (manager.hasError)
    return <Row>
      <Col md={{ offset: 3 }} className="panel panel-transparent">
        <Error title="An error occured loading related content." message={manager.errorMessage} />
      </Col>
    </Row>

  if (!manager.hasData || !manager.hasAnyRelatedWorks) return ''

  const { works, title: displayedConnectionTitle } = manager.selectedContent
  const { hasPagination, hasNextPage, endCursor } = manager.pagination
  const connectionTypeCounts = manager.connectionTypeCounts
  const url = manager.getUrl()
  return (
    <Container fluid>
      <Row>
        <Col md={{ offset: 3 }}>
          <h3 className="member-results" id="title">BETA - Related Works</h3>
        </Col>
      </Row>
      <Row>
        <WorksListing
          works={works}
          loading={manager.isLoading}
          connectionTypesCounts={connectionTypeCounts}
          showAnalytics={true}
          showSankey={manager.showSankey}
          sankeyTitle={`Contributions to ${displayedConnectionTitle}`}
          showClaimStatus={true}
          hasPagination={hasPagination}
          hasNextPage={hasNextPage}
          model={'doi'}
          url={url}
          endCursor={endCursor} />
      </Row>
    </Container>
  )
}
