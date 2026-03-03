import { useQueries } from '@tanstack/react-query'
import { fetchDois, QueryVar, VALID_ORGANIZATION_RELATION_TYPES } from 'src/data/queries/searchDoiQuery'
import { OrganizationRelationTypeCounts } from 'src/data/types'

/**
 * Hook to fetch counts for all organization relation types using count-only queries.
 * Each query uses page[size]=0 to fetch only total counts without actual work data.
 * @param vars - Query variables (must include rorId) to use for all relation type queries
 * @returns Object with counts, loading state, and any errors
 */
export function useOrganizationConnectionCounts(vars: QueryVar): {
  counts: OrganizationRelationTypeCounts
  isLoading: boolean
  isError: boolean
  errors: unknown[]
} {
  const queries = VALID_ORGANIZATION_RELATION_TYPES.map((organizationRelationType) => ({
    queryKey: ['doiSearch', 'orgRelationCounts', { ...vars, organizationRelationType }, 'count'],
    queryFn: async () => {
      const result = await fetchDois({ ...vars, organizationRelationType }, 0)
      return result.data?.works?.totalCount ?? 0
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  }))

  const results = useQueries({ queries })

  const isLoading = results.some((result) => result.isPending)
  const isError = results.some((result) => result.isError)
  const errors = results.map((result) => result.error).filter(Boolean)

  const counts: OrganizationRelationTypeCounts = VALID_ORGANIZATION_RELATION_TYPES.reduce(
    (acc, type, index) => {
      acc[type] = results[index].data ?? 0
      return acc
    },
    {} as OrganizationRelationTypeCounts
  )

  return {
    counts,
    isLoading,
    isError,
    errors,
  }
}
