import { useQueries } from '@tanstack/react-query'
import { useSearchDoiQuery, QueryVar } from 'src/data/queries/searchDoiQuery'
import { ConnectionTypeCounts, CONNECTION_TYPES } from './ConnectionTypeManager'

/**
 * Hook to fetch counts for all connection types using count-only queries.
 * Each query uses page[size]=0 to fetch only total counts without actual work data.
 * @param vars - Query variables to use for all connection type queries
 * @returns Object with counts, loading state, and any errors
 */
export function useConnectionCounts(vars: QueryVar): {
  counts: ConnectionTypeCounts
  isLoading: boolean
  isError: boolean
  errors: unknown[]
} {
  // Create queries for each connection type with count=0
  const queries = CONNECTION_TYPES.map((connectionType) => {
    return {
      queryKey: ['doiSearch', { ...vars, connectionType }, 'count'],
      queryFn: async () => {
        const result = await fetchDoisCount({ ...vars, connectionType }, 0)
        return result.data?.works?.totalCount ?? 0
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  })

  const results = useQueries({ queries })

  const isLoading = results.some(result => result.isPending)
  const isError = results.some(result => result.isError)
  const errors = results.map(result => result.error).filter(Boolean)

  // Combine results into ConnectionTypeCounts shape
  const counts: ConnectionTypeCounts = CONNECTION_TYPES.reduce((acc, connectionType, index) => {
    acc[connectionType] = results[index].data ?? 0
    return acc
  }, {} as ConnectionTypeCounts)

  return {
    counts,
    isLoading,
    isError,
    errors,
  }
}

/**
 * Helper function to fetch count-only data
 * This is a wrapper around the existing fetchDois function with count parameter
 */
async function fetchDoisCount(variables: QueryVar, count?: number) {
  // Import fetchDois dynamically to avoid circular imports
  const { fetchDois } = await import('src/data/queries/searchDoiQuery')
  return fetchDois(variables, count)
}

/**
 * Alternative implementation using individual useSearchDoiQuery calls
 * This can be used if useQueries causes issues
 */
export function useConnectionCountsIndividual(vars: QueryVar): {
  counts: ConnectionTypeCounts
  isLoading: boolean
  isError: boolean
  errors: unknown[]
} {
  const allRelatedQuery = useSearchDoiQuery({ ...vars, connectionType: 'allRelated' }, 0)
  const referencesQuery = useSearchDoiQuery({ ...vars, connectionType: 'references' }, 0)
  const citationsQuery = useSearchDoiQuery({ ...vars, connectionType: 'citations' }, 0)
  const partsQuery = useSearchDoiQuery({ ...vars, connectionType: 'parts' }, 0)
  const partOfQuery = useSearchDoiQuery({ ...vars, connectionType: 'partOf' }, 0)
  const otherRelatedQuery = useSearchDoiQuery({ ...vars, connectionType: 'otherRelated' }, 0)

  const isLoading = [
    allRelatedQuery.loading,
    referencesQuery.loading,
    citationsQuery.loading,
    partsQuery.loading,
    partOfQuery.loading,
    otherRelatedQuery.loading
  ].some(Boolean)

  const isError = [
    allRelatedQuery.error,
    referencesQuery.error,
    citationsQuery.error,
    partsQuery.error,
    partOfQuery.error,
    otherRelatedQuery.error
  ].some(Boolean)

  const errors = [
    allRelatedQuery.error,
    referencesQuery.error,
    citationsQuery.error,
    partsQuery.error,
    partOfQuery.error,
    otherRelatedQuery.error
  ].filter(Boolean)

  const counts: ConnectionTypeCounts = {
    allRelated: allRelatedQuery.data?.works?.totalCount ?? 0,
    references: referencesQuery.data?.works?.totalCount ?? 0,
    citations: citationsQuery.data?.works?.totalCount ?? 0,
    parts: partsQuery.data?.works?.totalCount ?? 0,
    partOf: partOfQuery.data?.works?.totalCount ?? 0,
    otherRelated: otherRelatedQuery.data?.works?.totalCount ?? 0,
  }

  return {
    counts,
    isLoading,
    isError,
    errors,
  }
}