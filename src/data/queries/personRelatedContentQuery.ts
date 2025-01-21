import { gql, useQuery } from "@apollo/client";
import { workConnection, workFragment } from "src/data/queries/queryFragments";
import { QueryData, QueryVar as QueryVarGQL } from "src/data/queries/personQuery";
import { useSearchDoiQuery, QueryVar } from "./searchDoiQuery";
import { useSearchDoiFacetsQuery } from "./searchDoiFacetsQuery";


export function usePersonRelatedContentQuery(variables: QueryVar) {
  const results = useSearchDoiQuery(variables)
  const facets = useSearchDoiFacetsQuery(variables)

  const loading = results.loading || facets.loading;
  const error = results.error || facets.error;

  if (loading || error) return { loading, data: undefined, error }


  const person = {
    works: {
      ...results.data?.works || {},
      ...facets.data?.works
    }
  }

  return {
    ...results,
    data: { person } as QueryData,
  }
}


export function usePersonRelatedContentQueryGQL(variables: QueryVarGQL) {
  const { loading, data, error } = useQuery<QueryData, QueryVarGQL>(
    RELATED_CONTENT_QUERY,
    {
      variables,
      errorPolicy: 'all'
    }
  )

  return { loading, data, error }
}


export const RELATED_CONTENT_QUERY = gql`
  query getRelatedContentQuery(
    $id: ID!
    $filterQuery: String
    $cursor: String
    $published: String
    $resourceTypeId: String
    $fieldOfScience: String
    $language: String
    $license: String
    $registrationAgency: String
  ) {
    person(id: $id) {
      works(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
      ) {
        ...WorkConnectionFragment
        nodes {
          ...WorkFragment
        }
      }
    }
  }
  ${workConnection}
  ${workFragment}
`;


export type { QueryData, QueryVar }
