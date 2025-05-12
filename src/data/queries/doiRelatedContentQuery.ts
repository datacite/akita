import { gql, useQuery } from "@apollo/client";
import { workConnection, workFragment } from "src/data/queries/queryFragments";
import { QueryData } from "src/data/queries/doiQuery";
import { QueryVar } from "src/data/queries/searchDoiQuery";
import { useSearchDoiFacetsQuery } from "./searchDoiFacetsQuery";
import { useSearchDoiQuery } from "./searchDoiQuery";

export function useDoiRelatedContentQuery(variables: QueryVar) {
  const content = useSearchDoiQuery( variables )
  const facets = useSearchDoiFacetsQuery(variables )

  const loading = content.loading || facets.loading;
  const error = content.error || facets.error;

  if (loading || error) return { loading, data: undefined, error }

  const work = {
    types: {
      resourceTypeGeneral: "TEXT",

    },
    [variables.connectionType || "allRelated"]: {
      ...content.data?.works || {},
      ...facets.data?.works
    }
  }
  return {
    ...content,
    data: { work } as QueryData,
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

export function useDoiRelatedContentQueryGQL(variables: QueryVar) {
  const filterQuery = buildFilterQuery(variables)
  const { loading, data, error } = useQuery<QueryData, QueryVar>(
    RELATED_CONTENT_QUERY,
    {
      variables: { ...variables, filterQuery },
      errorPolicy: 'all'
    }
  )

  return { loading, data, error }
}


export const RELATED_CONTENT_QUERY = gql`
  query getRelatedContentDoiQuery(
    $id: ID!
    $filterQuery: String
    $cursor: String
    $published: String
    $resourceTypeId: String
    $fieldOfScience: String
    $language: String
    $license: String
    $registrationAgency: String
    $repositoryId: String
  ) {
    work(id: $id) {
      doi
      types {
        resourceTypeGeneral
        resourceType
      }
      allRelated(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
      ) {
        ...WorkConnectionFragment
        nodes {
          ...WorkFragment
        }
      }
      citations(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
      ) {
        ...WorkConnectionFragment
        nodes {
          ...WorkFragment
        }
      }
      references(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
      ) {
        ...WorkConnectionFragment
        nodes {
          ...WorkFragment
        }
      }
      parts(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
      ) {
        ...WorkConnectionFragment
        nodes {
          ...WorkFragment
        }
      }
      partOf(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
      ) {
        ...WorkConnectionFragment
        nodes {
          ...WorkFragment
        }
      }
      otherRelated(
        first: 25
        query: $filterQuery
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
        repositoryId: $repositoryId
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


export type { QueryVar, QueryData }
