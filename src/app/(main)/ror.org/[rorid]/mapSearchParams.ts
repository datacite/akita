import { SortOption } from "src/data/queries/searchDoiQuery"
export interface SearchParams {
  id: string
  filterQuery?: string
  cursor?: string
  contributor?: string
  published?: string
  "resource-type"?: string
  language?: string
  license?: string
  "field-of-science"?: string
  "registration-agency"?: string
  "connection-type"?: string
  "organization-relation-type"?: string
  "repository-type"?: string
  sort?: SortOption
  isBot: string
}

export default function mapSearchparams(searchParams: SearchParams) {
  return {
    variables: {
      filterQuery: searchParams.filterQuery,
      cursor: searchParams.cursor,
      contributor: searchParams['contributor'],
      published: searchParams.published,
      resourceTypeId: searchParams['resource-type'],
      language: searchParams.language,
      fieldOfScience: searchParams['field-of-science'],
      license: searchParams.license,
      registrationAgency: searchParams['registration-agency'],
      clientType: searchParams['repository-type'],
      organizationRelationType: searchParams['organization-relation-type'] || 'allRelated',
      sort: searchParams.sort
    },

    isBot: false
  }
}


