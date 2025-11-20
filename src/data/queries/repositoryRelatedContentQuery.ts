import { FACETS } from '../constants'
import { useSearchDoiQuery, QueryVar } from "./searchDoiQuery";
import { useSearchDoiFacetsQuery } from './searchDoiFacetsQuery'
import type { Works } from 'src/data/types';


export function useRepositoryRelatedContentQuery(variables: QueryVar) {
  const results = useSearchDoiQuery(variables)
  const facets = useSearchDoiFacetsQuery(variables, [...FACETS.DEFAULT, ...FACETS.METRICS])

  const loading = results.loading;
  const error = results.error || facets.error;

  // if (loading || error) return { loading, data: undefined, error }


  const works = {
    ...results.data?.works || {},
    ...facets.data?.works
  }

  return {
    ...results,
    loading,
    error,
    data: { works } as QueryData,
    facetsLoading: facets.loading
  }
}

export interface QueryData {
  works: Works
}
