import { gql, useQuery } from "@apollo/client";
import { workConnection, workFragment } from "src/data/queries/queryFragments";
import { Works } from "src/data/types";
import { useSearchDoiQuery } from "./searchDoiQuery";
import { useSearchDoiFacetsQuery } from "./searchDoiFacetsQuery";


export function useOrganizationRelatedContentQuery(variables: QueryVar) {
  const id = 'ror.org/' + variables.id
  const rorId = `"https://${id}"`
  const query = `(organization_id:${id} OR affiliation_id:${id} OR related_dmp_organization_id:${id} OR provider.ror_id:${rorId})` + (variables.filterQuery ? ' AND ' + variables.filterQuery : '')

  const vars = { ...variables, query }
  const results = useSearchDoiQuery(vars)
  const facets = useSearchDoiFacetsQuery(vars)

  const loading = results.loading || facets.loading;
  const error = results.error || facets.error;

  if (loading || error) return { loading, data: undefined, error }


  const organization = {
    works: {
      ...results.data?.works || {} as any,
      ...facets.data?.works
    }
  }

  return {
    ...results,
    data: { organization },
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


export interface QueryVar {
  id: string
  filterQuery?: string
  cursor?: string
  published?: string
  resourceTypeId?: string
  language?: string
  fieldOfScience?: string
  license?: string
  registrationAgency?: string
}

export interface QueryData {
  organization: {
    works: Pick<Works, 'nodes' | 'totalCount' | 'pageInfo'>
  }
}
