import { useSearchDoiFacetsQuery } from './searchDoiFacetsQuery'

export function useRepositoryRelatedContent(id: string) {
  if (!id) return { data: undefined }
  const vars = { clientId: id }
  return useSearchDoiFacetsQuery(vars)
}
