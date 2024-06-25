export async function getRelatedWorksGraph(doi: string) {
  const baseUrl =
    process.env.VERCEL_URL === 'localhost:3000'
      ? 'http://localhost:3000'
      : `https://${process.env.VERCEL_URL}`
  const response = await fetch(`${baseUrl}/api/doi/related-graph/${doi}`)
  const data = await response.json()
  return data
}
