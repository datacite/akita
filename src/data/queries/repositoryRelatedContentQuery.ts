import { DEFAULT_FACETS, useSearchDoiFacetsQuery } from './searchDoiFacetsQuery'

const FACETS = [
  ...DEFAULT_FACETS,
  'citation_count',
  'view_count',
  'download_count',
  'content_url_count',
  'open_licenses',
  'open_licenses_count'
]

export function useRepositoryRelatedContent(id: string) {
  if (!id) return { data: undefined, loading: false, error: null }
  const vars = { clientId: id }
  return useSearchDoiFacetsQuery(vars, FACETS)
}
