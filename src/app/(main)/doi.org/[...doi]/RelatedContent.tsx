'use client'

import React from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Loading from 'src/components/Loading/Loading'

import { useDoiRelatedContentQuery } from 'src/data/queries/doiRelatedContentQuery'
import { Work } from 'src/data/types'

import Error from 'src/components/Error/Error'
import WorksListing from 'src/components/WorksListing/WorksListing'
import mapSearchparams from './mapSearchParams'
import { isDMP, isProject } from 'src/utils/helpers'

interface Props {
  work: Work,
  relatedDois: string[],
  isBot?: boolean
}

export default function RelatedContent(props: Props) {
  const { isBot = false, work, relatedDois } = props

  const searchParams = useSearchParams()
  const { variables } = mapSearchparams(Object.fromEntries(searchParams.entries()) as any)

  const vars = { relatedToDoi: work.doi, relatedDois, ...variables }
  const { loading, data, error } = useDoiRelatedContentQuery(vars)

  if (isBot) return null

  if (loading) return <Row><Loading /></Row>

  if (error)
    return <Row>
      <Col md={{ offset: 3 }} className="panel panel-transparent">
        <Error title="An error occured loading related content." message={error.message} />
      </Col>
    </Row>

  if (!data || data.works.totalCount === 0) return

  const relatedWorks = data.works
  const showSankey = isDMP(work) || isProject(work)

  const defaultConnectionType = 'allRelated'
  const connectionType = searchParams.get('connection-type') || defaultConnectionType
  //convert camel case to title and make first letter uppercase
  //convert connectionType to title, allRelated becomes All Related Wokrs, references becomes References, citations becomes Citations, parts becomes Parts, partOf becomes Part Of, and otherRelated becomes Other Works
  const displayedConnectionTitle =
    connectionType === 'allRelated' ? 'All Related Works' :
      connectionType === 'otherRelated' ? 'Other Works' :
        connectionType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())

  const url = '/doi.org/' + work.doi + '/?'

  const hasNextPage = relatedWorks.totalCount > 25
  const endCursor = relatedWorks.pageInfo
    ? relatedWorks.pageInfo.endCursor
    : ''

  return (
    <Container fluid>
      <Row>
        <Col md={{ offset: 3 }}>
          <h3 className="member-results" id="title">Related Works</h3>
        </Col>
      </Row>
      <Row>
        <WorksListing
          works={relatedWorks}
          loading={loading}
          vars={vars}
          showAnalytics={true}
          showSankey={showSankey}
          // TO DO: Fix sankey title
          sankeyTitle={`Contributions to ${displayedConnectionTitle}`}
          showClaimStatus={true}
          hasPagination={relatedWorks.totalCount > 25}
          hasNextPage={hasNextPage}
          model={'doi'}
          url={url}
          endCursor={endCursor} />
      </Row>
    </Container>
  )
}
