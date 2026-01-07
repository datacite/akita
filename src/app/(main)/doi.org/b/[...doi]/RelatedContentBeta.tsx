'use client'

import React from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Error from 'src/components/Error/Error'
import Loading from 'src/components/Loading/Loading'
import WorksListing from 'src/components/WorksListing/WorksListing'

import mapSearchparams from '../../[...doi]/mapSearchParams'
import { useRelatedContentManager } from './RelatedContentManager'
import { Work } from 'src/data/types'
import { fetchDoi } from 'src/data/queries/doiQuery'

function getQueryVariables(doi: string, searchParams: any){
  const { variables, connectionType } = mapSearchparams(Object.fromEntries(searchParams.entries()) as any)
  return { id: doi, relatedDoi: doi, ...variables, connectionType }
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

export default function RelatedContent() {
  
  const doiParams = useParams().doi as string[]
  const doi = decodeURIComponent(doiParams.join('/'))
  const searchParams = useSearchParams()

  // Use TanStack Query to fetch DOI data on client side
  const { data: doiData, isLoading: isDoiLoading, error: doiError } = useQuery({
    queryKey: ['doi', doi],
    queryFn: () => fetchDoi(doi),
    enabled: !!doi,
  })

  // Use fetched data
  const work = doiData?.data?.work

  const relatedDois = extractRelatedDois(work)
  const vars = getQueryVariables(doi, searchParams)
  // Merge related DOIs with existing variables as uidList
  const varsWithRelatedDois = {
    ...vars,
    uidList: relatedDois
  }
  
  const manager = useRelatedContentManager(varsWithRelatedDois, varsWithRelatedDois.connectionType)


  if (isDoiLoading) return <Row><Loading /></Row>

  if (doiError)
    return <Row>
      <Col md={{ offset: 3 }} className="panel panel-transparent">
        <Error title="An error occurred loading DOI data." message={doiError.message || 'Failed to fetch DOI data'} />
      </Col>
    </Row>

  if (!work)
    return <Row>
      <Col md={{ offset: 3 }} className="panel panel-transparent">
        <Error title="DOI not found" message="The requested DOI could not be found." />
      </Col>
    </Row>

  if (manager.isLoading) return <Row><Loading /></Row>

  if (manager.hasError)
    return <Row>
      <Col md={{ offset: 3 }} className="panel panel-transparent">
        <Error title="An error occured loading related content." message={manager.errorMessage} />
      </Col>
    </Row>

  if (!manager.hasData || !manager.hasAnyRelatedWorks) return (
    <Container fluid>
      <Row>
        <Col md={{ offset: 3 }}>
          <h3 className="member-results" id="title">BETA - Related Works</h3>
        </Col>
      </Row>
      <Row>
        <Col md={{ offset: 3 }} className="panel panel-transparent">
          <p>No related works found for this DOI.</p>
        </Col>
      </Row>
    </Container>
  )

  const { works, title: displayedConnectionTitle } = manager.selectedContent
  const { hasPagination, hasNextPage, endCursor } = manager.pagination
  const connectionTypeCounts = manager.connectionTypeCounts
  const url = manager.getUrl()
  return (
    <Container fluid>
      <Row>
        <Col md={{ offset: 3 }}>
          <h3 className="member-results" id="title">BETA - {displayedConnectionTitle}</h3>
        </Col>
      </Row>
      <Row>
        <WorksListing
          works={works}
          loading={manager.isLoading}
          loadingFacets={manager.facetsAreLoading || manager.connectionCountsLoading}
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
