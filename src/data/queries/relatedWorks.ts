// 'use client'
function getBaseUrl() {
  const localhost = 'http://localhost:3000'
  const baseUrl =
    process.env.VERCEL_URL === 'localhost:3000'
      ? localhost
      : `https://${process.env.VERCEL_URL}`
  if (process.env.VERCEL_URL) return baseUrl
  return localhost
}

export async function getRelatedWorksGraph(doi: string) {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/doi/related-graph/${doi}`)
  const data = await response.json()
  return data
}
