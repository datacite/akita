import { gql } from "@apollo/client";
import { workConnection, workFragment } from "src/data/queries/queryFragments";
import { QueryVar } from "src/data/queries/searchDoiQuery";
import { useSearchDoiFacetsQuery } from "src/data/queries/searchDoiFacetsQuery";
import { useSearchDoiQuery } from "src/data/queries/searchDoiQuery";
import { FACETS } from "src/data/constants";
import { Works } from "src/data/types";

export function buildFilterQuery(variables: QueryVar) {
  const queryParts = [
    variables.filterQuery,
    variables.contributor ? `creators_and_contributors.nameIdentifiers.nameIdentifier:"https://orcid.org/${variables.contributor}"` : '',
  ].filter(Boolean);
  const query = queryParts.join(' AND ')

  return query
}

export function useDoiRelatedContentQuery(variables: QueryVar) {
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

export type { QueryVar }
