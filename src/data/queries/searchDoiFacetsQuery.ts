import { useQuery } from '@tanstack/react-query'
import type { Works } from 'src/data/types'
import type { QueryVar } from './searchDoiQuery'


const FACETS = [
  'published',
  'resourceTypes',
  'languages',
  'licenses',
  'fieldsOfScience',
  'affiliations',
  'repositories',
  'registrationAgencies',
  'authors',
  'creatorsAndContributors',
  // personToWorkTypesMultilevel: []
]


function buildDoiSearchParams(variables: QueryVar): URLSearchParams {
  const searchParams = new URLSearchParams({
    query: variables.query,
    facets: FACETS.join(','),
    affiliation: 'false',
    publisher: 'false',
    'disable-facets': 'false',
    include_other_registration_agencies: 'true',
    'page[size]': '0'
  })


  if (variables.license) searchParams.append('license', variables.license)
  if (variables.published) searchParams.append('published', variables.published)
  if (variables.resourceTypeId) searchParams.append('resource-type-id', variables.resourceTypeId)
  if (variables.fieldOfScience) searchParams.append('field-of-science', variables.fieldOfScience)
  // if (variables.registrationAgency) searchParams.append('registration-agency', variables.registrationAgency)
  // if (variables.language) searchParams.append('language', variables.language)

  return searchParams
}


function convertToQueryData(json: any): QueryData {
  const { meta } = json

  // Missing authors, repositories, and multilevel
  return {
    works: {
      published: meta.published,
      resourceTypes: meta.resourceTypes.slice(0, 10),
      languages: meta.languages.slice(0, 10),
      licenses: meta.licenses.slice(0, 10),
      fieldsOfScience: meta.fieldsOfScience.slice(0, 10),
      affiliations: meta.affiliations,
      repositories: [],
      registrationAgencies: meta.registrationAgencies,
      authors: [].slice(0, 10),
      creatorsAndContributors: meta.creatorsAndContributors.slice(0, 10),

      personToWorkTypesMultilevel: []
    }
  }
}

export async function fetchDoisFacets(variables: QueryVar) {
  try {
    const options = {
      method: 'GET',
      headers: { accept: 'application/vnd.api+json' }
    }
    const searchParams = buildDoiSearchParams(variables)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dois?${searchParams.toString()}`,
      options
    )
    const json = await res.json()
    console.log(json)

    const data = convertToQueryData(json)
    return { data }
  } catch (error) {
    return { error }
  }
}

export function useSearchDoiFacetsQuery(variables: QueryVar) {
  const { cursor, ...vars } = variables
  const { isPending, data, error } = useQuery({ queryKey: ['doiFacetsSearch', vars], queryFn: async () => fetchDoisFacets(variables) })

  return { loading: isPending, data: data?.data, error }
}


export interface QueryData {
  works: Omit<Works, 'nodes' | 'totalCount' | 'pageInfo'>
}
