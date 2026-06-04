import { Works } from "src/data/types";
import { useSearchDoiQuery, QueryVar } from "./searchDoiQuery";
import { useSearchDoiFacetsQuery } from "./searchDoiFacetsQuery";


export function useOrganizationRelatedContentQuery(variables: QueryVar) {
  const results = useSearchDoiQuery(variables)
  const facets = useSearchDoiFacetsQuery(variables)

  const loading = results.loading || facets.loading;
  const error = results.error || facets.error;

  if (loading || error) return { loading, data: undefined, error, facetsLoading: facets.loading }


  const organization = {
    works: {
      ...results.data?.works || {},
      ...facets.data?.works
    }
  }

  return {
    ...results,
    data: { organization } as QueryData,
    facetsLoading: facets.loading
  }
}


export interface QueryData {
  organization: {
    works: Works
  }
}

export type { QueryVar }
