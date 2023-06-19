import React from 'react'
import { gql, useQuery } from '@apollo/client'

import { Works } from '../SearchWork/SearchWork'
import ForceDirectedGraph, { ForceDirectedGraphLink, ForceDirectedGraphNode } from '../ForceDirectedGraph/ForceDirectedGraph'
import WorksDashboard from '../WorksDashboard/WorksDashboard'
import { resourceTypeDomain } from 'src/data/color_palettes'

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
  const { loading, data } = useQuery<
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

  // Links between nodes
  // Authors -> dois
  // Dois -> dois
  
  const forceDirectedWorks = loading ? [] : data.organization.works.nodes
  const nodes: ForceDirectedGraphNode[] = []
  const links: ForceDirectedGraphLink[] = []
  forceDirectedWorks.forEach((work, index) => {
    const title = work.titles[0] && work.titles[0].title ? work.titles[0].title : 'Unknown'

    const type = work.types && work.types.resourceTypeGeneral ?
    resourceTypeDomain.find(d => d === work.types.resourceTypeGeneral) ? work.types.resourceTypeGeneral : 'Other'
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

  
  return (
    <WorksDashboard works={works}>
      <ForceDirectedGraph
          titleText='Organization Works'
          nodes={nodes}
          links={links}
          domain={resourceTypeDomain}
          range={resourceTypeDomain} />
    </WorksDashboard>
  )
}

export default OrganizationDashboard
