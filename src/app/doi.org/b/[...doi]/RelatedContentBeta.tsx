'use client'

import React from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Loading from 'src/components/Loading/Loading'
import { ConnectionTypeManager , getValidConnectionType} from './ConnectionTypeManager'
import { PaginationManager } from './PaginationManager'

import { useDoiRelatedContentQueryGQL as useDoiRelatedContentQuery } from 'src/data/queries/doiRelatedContentQuery'
// import { Works, Work } from 'src/data/types'

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

function getConnectionType(){
  const searchParams = useSearchParams()
  const { connectionType } = mapSearchparams(Object.fromEntries(searchParams.entries()) as any)
  return getValidConnectionType(connectionType)
}

export default function RelatedContent(props: Props) {
  const { isBot = false } = props
  if (isBot) return null
  const vars = getQueryVariables()
  const connectionType = getConnectionType()
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
  const connectionManager = new ConnectionTypeManager(data.work)
  if (!connectionManager.hasAnyRelatedWorks()) return ''


  const {works, title: displayedConnectionTitle} = connectionManager.getWorksAndTitle(connectionType)
  const paginationManager = new PaginationManager(works)
  const connectionTypeCounts = connectionManager.getCounts()

  const url = '/doi.org/b/' + vars.id + '/?'
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
          hasPagination={paginationManager.hasPagination}
          hasNextPage={paginationManager.hasNextPage}
          model={'doi'}
          url={url}
          endCursor={paginationManager.endCursor} />
      </Row>
    </Container>
  )
}
