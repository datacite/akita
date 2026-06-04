import { QueryData } from "src/data/queries/doiQuery";
import { QueryVar } from "src/data/queries/searchDoiQuery";
import { useSearchDoiFacetsQuery } from "./searchDoiFacetsQuery";
import { useSearchDoiQuery } from "./searchDoiQuery";
import { FACETS } from "../constants";

export function useDoiRelatedContentQuery(variables: QueryVar) {
  const content = useSearchDoiQuery( variables )
  const facets = useSearchDoiFacetsQuery(variables, [...FACETS.DEFAULT, ...FACETS.SANKEY])

  const loading = content.loading;
  const error = content.error || facets.error;

  if (loading || error) return { loading, data: undefined, error, facetsLoading: facets.loading }

  const work = {
    types: {
      resourceTypeGeneral: undefined,

    },
    [variables.connectionType || "allRelated"]: {
      ...content.data?.works || {},
      ...facets.data?.works
    }
  }
  return {
    ...content,
    data: { work } as QueryData,
    facetsLoading: facets.loading
  }
}

export function buildFilterQuery(variables: QueryVar) {
  const queryParts = [
    variables.filterQuery,
    variables.contributor ? `creators_and_contributors.nameIdentifiers.nameIdentifier:"https://orcid.org/${variables.contributor}"` : '',
  ].filter(Boolean);
  const query = queryParts.join(' AND ')

  return query
}

export type { QueryVar, QueryData }
