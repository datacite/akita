'use client'

import React from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Row from 'react-bootstrap/Row'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

import WorkFacets from 'src/components/WorkFacets/WorkFacets'
import WorkMetadata from 'src/components/WorkMetadata/WorkMetadata'
import { Works } from 'src/data/types'
import Loading from 'src/components/Loading/Loading'
import LoadingFacetList from 'src/components/Loading/LoadingFacetList'
import NoResults from 'src/components/NoResults/NoResults'

import Pager from 'src/components/Pager/Pager'
import WorksDashboard from 'src/components/WorksDashboard/WorksDashboard'
import SankeyGraph, { multilevelToSankey } from 'src/components/SankeyGraph/SankeyGraph'

interface Props {
  works: Works
  showAnalytics: boolean
  showSankey?: boolean
  sankeyTitle?: string
  connectionTypesCounts?: { references: number, citations: number, parts: number, partOf: number, otherRelated: number, allRelated: number }
  showClaimStatus: boolean
  loading: boolean
  loadingFacets?: boolean
  model: string
  url: string
  hasPagination: boolean
  hasNextPage: boolean
  endCursor: string
}

export default function WorksListing({
  works,
  showAnalytics,
  connectionTypesCounts,
  showSankey,
  sankeyTitle = 'Contributions to Related Works',
  showClaimStatus,
  loading,
  loadingFacets = false,
  model,
  url,
  hasPagination,
  hasNextPage,
  endCursor
}: Props) {

  const hasNoWorks = works.totalCount == 0
  const sankeyData = showSankey ? multilevelToSankey(works.personToWorkTypesMultilevel) : []

  const renderFacets = () => {
    return (
        <WorkFacets
          model={model}
          url={url}
          data={works}
          connectionTypesCounts={connectionTypesCounts}
        />
    )
  }

  const renderNoWorks = () => {
    return (
      <NoResults />
    )
  }

  const renderWorks = () => {
    if (hasNoWorks) return renderNoWorks()
    return (
      <>
        {showAnalytics && <WorksDashboard works={works} />}
        {showSankey && <Row>
          <Col xs={12}>
            <SankeyGraph titleText={sankeyTitle} data={sankeyData} tooltipText='This chart shows the number of times the top Creators & Contributors with ORCID iDs were associated with different work types.' />
          </Col>
        </Row>}

        {works.nodes.map((doi) => (
          <Row key={doi.doi} className="mb-4 work">
            <WorkMetadata metadata={doi} linkToExternal={false} showClaimStatus={showClaimStatus} />
          </Row>
        ))}

        {hasPagination && (
          <Row>
            <Pager
              url={url}
              hasNextPage={hasNextPage}
              endCursor={endCursor}
            />
          </Row>
        )}
      </>
    )
  }
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Row>
    <Col md={3} className="d-none d-md-block">
    <Offcanvas show={show} onHide={handleClose} responsive="md" >
    <Offcanvas.Header closeButton>
    <Offcanvas.Title>Filter Works</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
    { loadingFacets ? <Row><LoadingFacetList count={4} numberOfLines={10}/></Row>: renderFacets() }
    </Offcanvas.Body>
    </Offcanvas>
    </Col>
      <Col md={9}>
        <div className="d-md-none position-sticky top-0 pt-1" style= {{ float: 'right', zIndex: 1020, backgroundColor: 'white' }}>
        <Button variant="primary" className="d-md-none" onClick={handleShow}>
        Filter <FontAwesomeIcon icon={faFilter} />
        </Button>
        </div>
        { loading ? <Loading /> : renderWorks() }
      </Col>
    </Row>
  )
}
