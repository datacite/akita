// 'use client'
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
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/doi/related-graph/${doi}`)
  if (!response.ok) {
    return {
      nodes: [],
      links: []
    }
  }
  return response.json()
}
