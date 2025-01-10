import { gql, useQuery } from "@apollo/client";
import { workConnection, workFragment } from "src/data/queries/queryFragments";
import { Works } from "src/data/types";
import { useSearchDoiQuery, QueryVar } from "./searchDoiQuery";
import { useSearchDoiFacetsQuery } from "./searchDoiFacetsQuery";


export function useOrganizationRelatedContentQuery(variables: QueryVar) {
  const results = useSearchDoiQuery(variables)
  const facets = useSearchDoiFacetsQuery(variables)

  const loading = results.loading || facets.loading;
  const error = results.error || facets.error;

  if (loading || error) return { loading, data: undefined, error }


  const organization = {
    works: {
      ...results.data?.works || {},
      ...facets.data?.works
    }
  }

  return {
    ...results,
    data: { organization } as QueryData,
  }
}



export function useOrganizationRelatedContentQueryGQL(variables: QueryVar) {
  const { loading, data, error } = useQuery<QueryData, QueryVar>(
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
    $id: ID
    $gridId: ID
    $crossrefFunderId: ID
    $cursor: String
    $filterQuery: String
    $published: String
    $resourceTypeId: String
    $fieldOfScience: String
    $language: String
    $license: String
    $registrationAgency: String
  ) {
    organization(
      id: $id
      gridId: $gridId
      crossrefFunderId: $crossrefFunderId
    ) {
      works(
        first: 25
        after: $cursor
        query: $filterQuery
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


export interface QueryData {
  organization: {
    works: Works
  }
}
