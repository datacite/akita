'use client'

import React from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Col, Container, Row } from 'react-bootstrap'
import Loading from 'src/components/Loading/Loading'

import { useDoiRelatedContentQuery } from 'src/data/queries/doiRelatedContentQuery'
import { Works } from 'src/data/types'

import Error from 'src/components/Error/Error'
import WorksListing from 'src/components/WorksListing/WorksListing'
import mapSearchparams from './mapSearchParams'
import { isDMP, isProject } from 'src/utils/helpers'

interface Props {
  isBot?: boolean
}

export default function RelatedContent(props: Props) {
  const { isBot = false } = props
  const doiParams = useParams().doi as string[]
  const doi = decodeURIComponent(doiParams.join('/'))

  const searchParams = useSearchParams()
  const { variables, connectionType } = mapSearchparams(Object.fromEntries(searchParams.entries()) as any)

  const vars = { id: doi, ...variables }
  const { loading, data, error } = useDoiRelatedContentQuery(vars)

  if (isBot) return null

  if (loading) return <Row><Loading /></Row>

  if (error)
    return <Row>
      <Col md={{ offset: 3 }} className="panel panel-transparent">
        <Error title="An error occured loading related content." message={error.message} />
      </Col>
    </Row>

  if (!data) return

  const showSankey = isDMP(data.work) || isProject(data.work)
  const relatedWorks = data.work

  const allRelatedCount = relatedWorks.allRelated?.totalCount || 0
  const referenceCount = relatedWorks.references?.totalCount || 0
  const citationCount = relatedWorks.citations?.totalCount || 0
  const partCount = relatedWorks.parts?.totalCount || 0
  const partOfCount = relatedWorks.partOf?.totalCount || 0
  const otherRelatedCount = relatedWorks.otherRelated?.totalCount || 0

  if (referenceCount + citationCount + partCount + partOfCount + otherRelatedCount === 0) return ''

  const url = '/doi.org/' + relatedWorks.doi + '/?'

  const connectionTypeCounts = {
    allRelated: allRelatedCount,
    references: referenceCount,
    citations: citationCount,
    parts: partCount,
    partOf: partOfCount,
    otherRelated: otherRelatedCount
  }

  const defaultConnectionType =
    allRelatedCount > 0 ? 'allRelated' :
      referenceCount > 0 ? 'references' :
        citationCount > 0 ? 'citations' :
          partCount > 0 ? 'parts' :
            partOfCount > 0 ? 'partOf' : 'otherRelated'

  const displayedConnectionType = connectionType ? connectionType : defaultConnectionType
  //convert camel case to title and make first letter uppercase
  //convert connectionType to title, allRelated becomes All Related Wokrs, references becomes References, citations becomes Citations, parts becomes Parts, partOf becomes Part Of, and otherRelated becomes Other Works
  const displayedConnectionTitle =
    displayedConnectionType === 'allRelated' ? 'All Related Works' :
      displayedConnectionType === 'otherRelated' ? 'Other Works' :
        displayedConnectionType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())




  const works: Works = displayedConnectionType in relatedWorks ?
    relatedWorks[displayedConnectionType] :
    { totalCount: 0, nodes: [] }

  const hasNextPage = works.pageInfo ? works.pageInfo.hasNextPage : false
  const endCursor = works.pageInfo ? works.pageInfo.endCursor : ''

  return (
    <Container fluid>
      <Row>
        <Col md={{ offset: 3 }}>
          <h3 className="member-results" id="title">Related Works</h3>
        </Col>
      </Row>
      <Row>
        <WorksListing
          works={works}
          loading={loading}
          showFacets={true}
          connectionTypesCounts={connectionTypeCounts}
          showAnalytics={true}
          showSankey={showSankey}
          sankeyTitle={`Contributions to ${displayedConnectionTitle}`}
          showClaimStatus={true}
          hasPagination={works.totalCount > 25}
          hasNextPage={hasNextPage}
          model={'doi'}
          url={url}
          endCursor={endCursor} />
      </Row>
    </Container>
  )
}
