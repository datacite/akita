'use client'

import React from 'react'
import { useQuery } from '@apollo/client'
import { Col, Row } from "src/components/Layout";
import Loading from 'src/components/Loading/Loading'

import { RELATED_CONTENT_QUERY, QueryVar, QueryData } from 'src/data/queries/doiQuery'
import { Works } from 'src/data/types'

import Error from 'src/components/Error/Error'
import WorksListing from 'src/components/WorksListing/Server'

interface Props {
  variables: QueryVar
  showSankey: boolean
  connectionType?: string
  isBot?: boolean
}

export default function RelatedContent (props: Props) {
  const { variables: vars, showSankey, connectionType, isBot = false } = props

  const variables = {
    ...vars,
    resourceTypeId: vars['resource-type'],
    fieldOfScience: vars['field-of-science'],
    registrationAgency: vars['registration-agency']
  }

  const { loading, data, error } = useQuery<QueryData, QueryVar>(
    RELATED_CONTENT_QUERY,
    {
      variables: variables,
      errorPolicy: 'all',
      skip: isBot
    }
  )

  if (isBot) return null

  if (loading) return <Row><Loading /></Row>

  if (error)
    return <Row>
      <Col mdOffset={3} className="panel panel-transparent">
        <Error title="An error occured loading related content." message={error.message} />
      </Col>
    </Row>

  if (!data) return

  const relatedWorks = data.work

  const referenceCount = relatedWorks.references?.totalCount || 0
  const citationCount = relatedWorks.citations?.totalCount || 0
  const partCount = relatedWorks.parts?.totalCount || 0
  const partOfCount = relatedWorks.partOf?.totalCount || 0
  const otherRelatedCount = relatedWorks.otherRelated?.totalCount || 0

  if (referenceCount + citationCount + partCount + partOfCount + otherRelatedCount === 0) return ''

  const url = '/doi.org/' + relatedWorks.doi + '/?'

  const connectionTypeCounts = {
    references: referenceCount,
    citations: citationCount,
    parts: partCount,
    partOf: partOfCount,
    otherRelated: otherRelatedCount
  }

  const defaultConnectionType =
    referenceCount > 0 ? 'references' :
    citationCount > 0 ? 'citations' :
    partCount > 0 ? 'parts' :
    partOfCount > 0 ? 'partOf' : 'otherRelated'

  const displayedConnectionType = connectionType ? connectionType : defaultConnectionType


  const works: Works = displayedConnectionType in relatedWorks ?
    relatedWorks[displayedConnectionType] :
    { totalCount: 0, nodes: [] }

  const hasNextPage = works.pageInfo ? works.pageInfo.hasNextPage : false
  const endCursor = works.pageInfo ? works.pageInfo.endCursor : ''
  
  return (
    <>
      <Row>
        <Col mdOffset={3} className="panel panel-transparent">
          <div className="panel-body">
            <h3 className="member-results" id="title">Related Works</h3>
          </div>
        </Col>
      </Row>
      <Row>
        <div className="panel panel-transparent">
          <div className="panel-body">
            <WorksListing
              works={works}
              loading={false}
              showFacets={true}
              connectionTypesCounts={connectionTypeCounts}
              showAnalytics={true}
              showSankey={showSankey}
              sankeyTitle={`Contributions to ${displayedConnectionType}`}
              showClaimStatus={true}
              hasPagination={works.totalCount > 25}
              hasNextPage={hasNextPage}
              model={'doi'}
              url={url}
              endCursor={endCursor} />
          </div>
        </div>
      </Row>
    </>
  )
}