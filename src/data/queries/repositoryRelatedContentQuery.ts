import { useSearchDoiFacetsQuery } from './searchDoiFacetsQuery'

export function useRepositoryRelatedContent(id: string) {
  const vars = { clientId: id }
  return useSearchDoiFacetsQuery(vars)
}
