import React from 'react'
import { Col, Alert, Row } from 'react-bootstrap'

import WorkFacets from '../WorkFacets/WorkFacets'
import WorkMetadata from '../WorkMetadata/WorkMetadata'
import { Works } from '../SearchWork/SearchWork'

import Pager from '../Pager/Pager'
import WorksDashboard from '../WorksDashboard/WorksDashboard'
import SankeyGraph, { multilevelToSankey } from '../SankeyGraph/SankeyGraph'
import ForceDirectedGraph from '../ForceDirectedGraph/ForceDirectedGraph'
import { ForceDirectedGraphLink, ForceDirectedGraphNode } from '../ForceDirectedGraph/ForceDirectedSpec'
import { resourceTypeDomain, resourceTypeRange } from 'src/data/color_palettes'

type Props = {
  works: Works
  showAnalytics: boolean
  showSankey?: boolean
  sankeyTitle?: string
  showForceDirected?: boolean
  forceDirectedTitle?: string
  showFacets: boolean
  showClaimStatus: boolean
  loading: boolean
  model: string
  url: string
  hasPagination: boolean
  hasNextPage: boolean
  endCursor: string
}

export interface ContentFacet {
  id: string
  title: string
  count: number
}

const WorksListing: React.FunctionComponent<Props> = ({
  works,
  showAnalytics,
  showFacets,
  showSankey,
  sankeyTitle = 'Contributions to Related Works',
  showForceDirected,
  forceDirectedTitle = 'Connections',
  showClaimStatus,
  loading,
  model,
  url,
  hasPagination,
  hasNextPage,
  endCursor
}) => {

  const hasNoWorks = works.totalCount == 0
  const sankeyData = showSankey ? multilevelToSankey(works.personToWorkTypesMultilevel) : []

  const renderFacets = () => {
    return (
      <div className="col-md-3 hidden-xs hidden-sm">
        <WorkFacets
          model={model}
          url={url}
          data={works}
          loading={loading}
        ></WorkFacets>
      </div>
    )
  }

  const renderNoWorks = () => {
    return (
      <Col md={9}>
        <div className="alert-works">
          <Alert bsStyle="warning">No works found.</Alert>
        </div>
      </Col>
    )
  }

  const renderWorks = () => {
    const forceDirectedWorks = loading ? [] : works.nodes
    const nodes: ForceDirectedGraphNode[] = []
    const links: ForceDirectedGraphLink[] = []
    forceDirectedWorks.forEach((work, index) => {
      const title = work.titles[0] && work.titles[0].title ? work.titles[0].title : 'Unknown'

      const type = work.types && work.types.resourceTypeGeneral ?
      resourceTypeDomain.find(d => d === work.types.resourceTypeGeneral) ? work.types.resourceTypeGeneral : 'Other'
        : 'Missing'

      const node = { name: title, group: type}
      nodes.push(node)

      links.concat(forceDirectedWorks.map(ref => {
        const relatedWork = forceDirectedWorks.findIndex(w => w.id === ref.id)
        return { source: index, target: relatedWork, value: 1 }
      }))



      // TESTING RANDOM LINKS
      for (let i = 0; i < Math.floor(Math.random() * 2); i++) {
        const randomLink = { source: index, target: Math.floor(Math.random() * forceDirectedWorks.length), value: 1 }
        links.push(randomLink)
      }
    })
  
    return (
      <Col md={9} id="content">
        {showAnalytics && <WorksDashboard works={works} />}
        {showSankey && <Row>
          <Col xs={12}>
            <SankeyGraph titleText={sankeyTitle} data={sankeyData} tooltipText='This chart shows the number of times the top Creators & Contributors with ORCID iDs were associated with different work types.' />
          </Col>
        </Row>}
        {showForceDirected && <Row>
          <Col xs={12}>
            <ForceDirectedGraph
              titleText={forceDirectedTitle}
              nodes={nodes}
              links={links}
              domain={resourceTypeDomain}
              range={resourceTypeRange} />
          </Col>
        </Row>}

        {works.nodes.map((doi) => (
          <React.Fragment key={doi.doi}>
            <WorkMetadata metadata={doi} linkToExternal={false} showClaimStatus={showClaimStatus}></WorkMetadata>
          </React.Fragment>
        ))}

        {hasPagination && (
          <Pager
            url={url}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
          ></Pager>
        )}
      </Col>
    )
  }

  return (
    <>
      {showFacets && renderFacets()}

      {hasNoWorks ? renderNoWorks() : renderWorks()}
    </>
  )
}

export default WorksListing
