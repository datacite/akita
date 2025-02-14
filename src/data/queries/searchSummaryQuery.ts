import { useQuery } from '@tanstack/react-query'
import { fetchDoisFacets } from 'src/data/queries/searchDoiFacetsQuery'
import { type QueryVar } from './searchDoiQuery'

const SUMMARY_FACETS = [
  'citation_count',
  'view_count',
  'download_count',

]

function convertSummaryToCounts(summaryData: any) {
  const { works } = summaryData
  return {
    citations: works?.citationCount || 0,
    views: works?.viewCount || 0,
    downloads: works?.downloadCount || 0,
    works: works?.totalCount|| 0
  }
}

export default function searchSummaryCounts( variables: QueryVar ) {
  return useQuery({
    queryKey: ['searchMetrics', variables ],
    queryFn: async () => {
      const summaryFacets = await fetchDoisFacets(variables, SUMMARY_FACETS)
      return convertSummaryToCounts(summaryFacets.data)
    }
  })
}
