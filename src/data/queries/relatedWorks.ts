import {
  ForceDirectedGraphNode,
  ForceDirectedGraphLink
} from 'src/components/ForceDirectedGraph/ForceDirectedSpec'
import { VERCEL_URL, URLS } from 'src/data/constants'

function getBaseUrl(): string {
  if (VERCEL_URL && VERCEL_URL !== 'localhost:3000')
    return `https://${VERCEL_URL}`

  return URLS.localhost
}

export interface GraphData {
  nodes: ForceDirectedGraphNode[]
  links: ForceDirectedGraphLink[]
}

export async function getRelatedWorksGraph(doi: string): Promise<GraphData> {
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
    return nullGraph
  }
}
