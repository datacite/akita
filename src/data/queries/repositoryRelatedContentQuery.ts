import { FACETS } from '../constants'
import { useSearchDoiQuery, QueryVar } from "./searchDoiQuery";
import { useSearchDoiFacetsQuery } from './searchDoiFacetsQuery'
import type { Works } from 'src/data/types';


export function useRepositoryRelatedContentQuery(variables: QueryVar) {
  const results = useSearchDoiQuery(variables)
  const facets = useSearchDoiFacetsQuery(variables, [...FACETS.DEFAULT, ...FACETS.METRICS])

  const loading = results.loading || facets.loading;
  const error = results.error || facets.error;

  if (loading || error) return { loading, data: undefined, error }


  const works = {
    ...results.data?.works || {},
    ...facets.data?.works
  }

  return {
    ...results,
    data: { works } as QueryData,
  }
}

export interface QueryData {
  works: Works
}
