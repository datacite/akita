export interface SearchParams {
  filterQuery?: string
  cursor?: string
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
      published: searchParams.published,
      resourceTypeId: searchParams['resource-type'],
      language: searchParams.language,
      license: searchParams.license,
      fieldOfScience: searchParams['field-of-science'],
      registrationAgency: searchParams['registration-agency'],
    },

    isBot: false
  }
}

