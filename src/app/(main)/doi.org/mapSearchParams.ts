import { QueryVar, SortOption } from 'src/data/queries/searchDoiQuery'

export interface SearchParams {
  query?: string
  filterQuery?: string
  cursor?: string
  contributor?: string
  published?: string
  'resource-type'?: string
  language?: string
  license?: string
  'field-of-science'?: string
  'registration-agency'?: string
  'repository-type'?: string
  'client-id'?: string
  sort?: SortOption
}

export default function mapSearchParams(searchParams: SearchParams): QueryVar {
  return {
    query: searchParams.query,
    filterQuery: searchParams.filterQuery,
    cursor: searchParams.cursor,
    contributor: searchParams.contributor,
    published: searchParams.published,
    resourceTypeId: searchParams['resource-type'],
    language: searchParams.language,
    license: searchParams.license,
    fieldOfScience: searchParams['field-of-science'],
    registrationAgency: searchParams['registration-agency'],
    clientType: searchParams['repository-type'],
    clientId: searchParams['client-id'],
    sort: searchParams.sort,
  }
}
