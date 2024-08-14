import {
  ForceDirectedGraphNode,
  ForceDirectedGraphLink
} from 'src/components/ForceDirectedGraph/ForceDirectedSpec'

function getBaseUrl(): string {
  const localhost = 'http://localhost:3000'
  const baseUrl =
    process.env.VERCEL_URL === 'localhost:3000'
      ? localhost
      : `https://${process.env.VERCEL_URL}`
  if (process.env.VERCEL_URL) return baseUrl
  return localhost
}

interface RelatedWorksGraph {
  nodes: ForceDirectedGraphNode[]
  links: ForceDirectedGraphLink[]
}

export async function getRelatedWorksGraph(
  doi: string
): Promise<RelatedWorksGraph> {
  const nullGraph = {
    nodes: [],
    links: []
  }
  const baseUrl = getBaseUrl()
  try {
    const response = await fetch(`${baseUrl}/api/doi/related-graph/${doi}`)
    if (!response.ok) {
      return nullGraph
    }
    return response.json()
  } catch (error) {
    // Non-critical data fetch.  If it fails, we return the nullGraph
    console.error(error)
    return nullGraph
  }
}

export interface Node {
  id: string
  label: string
  [key: string]: any // allow for additional properties
}

export interface Edge {
  id?: number | string
  from: string
  to: string
  [key: string]: any // allow for additional properties
}

export interface Options {
  [key: string]: any // allow for additional options
}

export interface GraphData {
  nodes: Node[]
  edges: Edge[]
  options?: Options
}

export async function getRelatedNetworkGraph(doi: string): Promise<GraphData> {
  const nullGraph = {
    nodes: [],
    edges: [],
    options: {}
  }
  const baseUrl = getBaseUrl()
  try {
    const response = await fetch(`${baseUrl}/api/doi/network-graph/${doi}`)
    if (!response.ok) {
      return nullGraph
    }
    return response.json()
  } catch (error) {
    // Non-critical data fetch.  If it fails, we return the nullGraph
    console.error(error)
    return nullGraph
  }
}
