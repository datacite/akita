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
      connectionTypes: searchParams['connection-types']
    },

    isBot: false
  }
}


