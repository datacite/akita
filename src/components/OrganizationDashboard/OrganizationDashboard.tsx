import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Col } from 'react-bootstrap'
import clone from 'lodash/clone'

import HorizontalStackedBarChart, { getTopFive, toBarRecord } from '../HorizontalStackedBarChart/HorizontalStackedBarChart'
import { Works } from '../SearchWork/SearchWork'
import ProductionChart from '../ProductionChart/ProductionChart'
import ForceDirectedGraph, { ForceDirectedGraphLink, ForceDirectedGraphNode } from '../ForceDirectedGraph/ForceDirectedGraph'
import { licenseDomain, licenseRange, typesDomain, typesRange } from '../DonutChart/DonutChart'

type Props = {
  rorId?: string
  gridId?: string
  crossrefFunderId?: string
  works: Works
}

export interface ContentFacet {
  id: string
  title: string
  count: number
}

const FORCE_DIRECTED_GRAPH_GQL = gql`
  query getOrganizationQuery(
    $id: ID
    $gridId: ID
    $crossrefFunderId: ID
    $referenceOrganizationId: String
  ) {
    organization(
      id: $id
      gridId: $gridId
      crossrefFunderId: $crossrefFunderId
    ) {
      name
      works(first: 100) {
        totalCount
        nodes {
          id
          types {
            resourceTypeGeneral
            resourceType
          }
          titles {
            title
          }
          references(organizationId: $referenceOrganizationId) {
            totalCount
            nodes {
              id
            }
          }
        }
      }
    }
  }
`

interface ForceDirectedOrganizationType {
  works: Works
}

interface ForceDirectedQueryData {
  organization: ForceDirectedOrganizationType
}

interface ForceDirectedQueryVar {
  id: string
  gridId: string
  crossrefFunderId: string
}

const OrganizationDashboard: React.FunctionComponent<Props> = ({
  works,
  rorId,
  gridId,
  crossrefFunderId
}) => {
  const { loading, error, data } = useQuery<
    ForceDirectedQueryData,
    ForceDirectedQueryVar
  >(FORCE_DIRECTED_GRAPH_GQL, {
    errorPolicy: 'all',
    variables: {
      id: rorId,
      gridId: gridId,
      crossrefFunderId: crossrefFunderId
    }
  })

  console.log(error)

  if (works.totalCount == 0) return null

  const published = works.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const resourceTypes = getTopFive(works.resourceTypes.map(toBarRecord))
  

  const noLicenseValue: ContentFacet = {
    id: 'no-license',
    title: 'No License',
    count:
      works.totalCount -
      works.licenses.reduce((a, b) => a + (b['count'] || 0), 0)
  }
  const licensesData = clone(works.licenses)
  licensesData.unshift(noLicenseValue)
  const licenses = getTopFive(licensesData.map(toBarRecord))

  const forceDirectedWorks = loading ? [] : data.organization.works.nodes
  const nodes: ForceDirectedGraphNode[] = []
  const links: ForceDirectedGraphLink[] = []
  forceDirectedWorks.forEach((work, index) => {
    const title = work.titles[0] && work.titles[0].title ? work.titles[0].title : 'Unknown'

    const type = work.types && work.types.resourceTypeGeneral ?
      typesDomain.find(d => d === work.types.resourceTypeGeneral) ? work.types.resourceTypeGeneral : 'Other'
      : 'Missing'

    const node = { name: title, group: type}
    nodes.push(node)

    links.concat(work.references.nodes.map(ref => {
      const relatedWork = forceDirectedWorks.findIndex(w => w.id === ref.id)
      return { source: index, target: relatedWork, value: 1 }
    }))



    // TESTING RANDOM LINKS
    for (let i = 0; i < Math.floor(Math.random() * 2); i++) {
      const randomLink = { source: index, target: Math.floor(Math.random() * forceDirectedWorks.length), value: 1 }
      links.push(randomLink)
    }

    
  })
  // const nodes: ForceDirectedGraphNode[] = forceDirectedWorks.map(w => ({ name: w.titles[0] && w.titles[0].title ? w.titles[0].title : 'unknown', group: w.types[0] && w.types[0].resourceTypeGeneral ? w.types[0].resourceTypeGeneral : 'unknown'}))

  // Links between nodes
  // Authors -> dois
  // Dois -> dois
  

  return (
    <>
      <Row>
        <Col xs={12} sm={8}>
          <ForceDirectedGraph
              titleText='Organization Works'
              nodes={nodes}
              links={links} />
        </Col>
        <Col xs={12} sm={4}>
          <ProductionChart
            title='Publication Year'
            data={published} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={4}>
          <HorizontalStackedBarChart
            titlePercent={-1}
            titleText={[`of scholarly outputs use`, `a persistent identifier (i.e. DOI)`]}
            data={[{title: 'PLACEHOLDER', count: 0}]}
            domain={[]}
            range={[]} />
        </Col>
        <Col xs={12} sm={4}>
          <HorizontalStackedBarChart
            titlePercent={resourceTypes.topPercent}
            titleText={`of scholarly outputs are ${resourceTypes.topCategory}`}
            data={resourceTypes.data}
            domain={typesDomain}
            range={typesRange} />
        </Col>
        <Col xs={12} sm={4}>
          <HorizontalStackedBarChart 
            titlePercent={licenses.topPercent}
            titleText={`of scholarly outputs use ${licenses.topCategory}`}
            data={licenses.data}
            domain={licenseDomain}
            range={licenseRange}
            />
        </Col>
      </Row>
    </>
  )
}

export default OrganizationDashboard
