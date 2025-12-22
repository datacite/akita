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
import { Work } from 'src/data/types'

interface Props {
  isBot?: boolean
  work?: Work
}

function getQueryVariables(){
  const doiParams = useParams().doi as string[]
  const doi = decodeURIComponent(doiParams.join('/'))
  const searchParams = useSearchParams()
  const { variables, connectionType } = mapSearchparams(Object.fromEntries(searchParams.entries()) as any)
  return { id: doi, relatedDoi: doi, ...variables, connectionType }
}


function getCounts(work: Work) {
  return {
    references: work.referenceCount || 0,
    allRelated: work.allRelatedCount || 0,
    citations: work.citationCount || 0,
    parts: work.partCount || 0,
    partOf: work.partOfCount || 0,
    otherRelated: work.otherRelatedCount || 0
  }
}

function extractRelatedDois(work: Work | undefined): string[] {
  if (!work) return []
  
  // Check if relatedIdentifiers exists on the work object (even if not in the type)
  const workWithRelatedIdentifiers = work as any
  if (!workWithRelatedIdentifiers?.relatedIdentifiers) return []
  
  return workWithRelatedIdentifiers.relatedIdentifiers
    .filter((identifier: any) => identifier.relatedIdentifierType === 'DOI')
    .map((identifier: any) => identifier.relatedIdentifier)
    .filter(Boolean) // Remove any undefined/null values
}

export default function RelatedContent(props: Props) {
  const { isBot = false } = props
  if (isBot) return null
  const relatedDois = extractRelatedDois(props.work)
  const vars = getQueryVariables()
  // Merge related DOIs with existing variables as uidList
  const varsWithRelatedDois = {
    ...vars,
    uidList: relatedDois
  }
  
  const manager = useRelatedContentManager(varsWithRelatedDois, varsWithRelatedDois.connectionType)

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
  // const connectionTypeCounts = manager.connectionTypeCounts
  const connectionTypeCounts = props.work && getCounts(props.work)
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
          loadingFacets={manager.facetsAreLoading}
          connectionTypesCounts={connectionTypeCounts}
          showAnalytics={!manager.facetsAreLoading}
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
