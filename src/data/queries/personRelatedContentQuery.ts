import { gql, useQuery } from "@apollo/client";
import { workConnection, workFragment } from "src/data/queries/queryFragments";
import { QueryData, QueryVar } from "src/data/queries/personQuery";


export function usePersonRelatedContentQuery(variables: QueryVar) {
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
