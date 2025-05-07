'use client'

import React from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Loading from 'src/components/Loading/Loading'

import { useDoiRelatedContentQueryGQL as useDoiRelatedContentQuery } from 'src/data/queries/doiRelatedContentQuery'
import { Works, Work } from 'src/data/types'

import Error from 'src/components/Error/Error'
import WorksListing from 'src/components/WorksListing/WorksListing'
import mapSearchparams from '../../[...doi]/mapSearchParams'
import { isDMP, isProject } from 'src/utils/helpers'

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

function getConnectionTypeCounts( work: Work) {

  const allRelatedCount = work.allRelated?.totalCount || 0
  const referenceCount = work.references?.totalCount || 0
  const citationCount = work.citations?.totalCount || 0
  const partCount = work.parts?.totalCount || 0
  const partOfCount = work.partOf?.totalCount || 0
  const otherRelatedCount = work.otherRelated?.totalCount || 0
  return {
      allRelated: allRelatedCount,
      references: referenceCount,
      citations: citationCount,
      parts: partCount,
      partOf: partOfCount,
      otherRelated: otherRelatedCount
    }

}
function hasAnyRelatedWorks(counts: ReturnType<typeof getConnectionTypeCounts>) {
  const { references, citations, parts, partOf, otherRelated } = counts
  return references + citations + parts + partOf + otherRelated > 0
}

function getDefaultConnectionType(counts: ReturnType<typeof getConnectionTypeCounts>) {
  const { allRelated, references, citations, parts, partOf } = counts
  if (allRelated > 0) return 'allRelated'
  if (references > 0) return 'references'
  if (citations > 0) return 'citations'
  if (parts > 0) return 'parts'
  if (partOf > 0) return 'partOf'
  return 'otherRelated'
}

function getConnectionType(){
  const searchParams = useSearchParams()
  const { connectionType } = mapSearchparams(Object.fromEntries(searchParams.entries()) as any)
  return connectionType
}
export default function RelatedContent(props: Props) {
  const { isBot = false } = props
  if (isBot) return null

  const connectionType = getConnectionType()

  // const vars = { id: doi, ...variables }
  const vars = getQueryVariables()
  const { loading, data, error } = useDoiRelatedContentQuery(vars)


  if (loading) return <Row><Loading /></Row>

  if (error)
    return <Row>
      <Col md={{ offset: 3 }} className="panel panel-transparent">
        <Error title="An error occured loading related content." message={error.message} />
      </Col>
    </Row>

  if (!data) return

  const showSankey = isDMP(data.work) || isProject(data.work)

  const connectionTypeCounts = getConnectionTypeCounts(data.work)
  if (!hasAnyRelatedWorks(connectionTypeCounts)) return ''


  const defaultConnectionType = getDefaultConnectionType(connectionTypeCounts)

  const displayedConnectionType = connectionType ? connectionType : defaultConnectionType
  const displayedConnectionTitle =
    displayedConnectionType === 'allRelated' ? 'All Related Works' :
      displayedConnectionType === 'otherRelated' ? 'Other Works' :
        displayedConnectionType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())




  const relatedWorks = data.work
  const works: Works = displayedConnectionType in relatedWorks ?
    relatedWorks[displayedConnectionType] :
    { totalCount: 0, nodes: [] }

  const hasNextPage = works.pageInfo ? works.pageInfo.hasNextPage : false
  const endCursor = works.pageInfo ? works.pageInfo.endCursor : ''

  const url = '/doi.org/b/' + relatedWorks.doi + '/?'
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
          loading={loading}
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
