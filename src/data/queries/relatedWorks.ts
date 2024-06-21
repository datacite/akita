export async function getRelatedWorksGraph(doi: string) {
  const response = await fetch(
    `http://localhost:3000/api/doi/related-graph/${doi}`
  )
  const data = await response.json()
  return data
}
