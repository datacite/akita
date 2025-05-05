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
  console.log("getRelatedWorksGraph", baseUrl, doi)
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
