import { useQuery } from '@tanstack/react-query'
import type { Works } from 'src/data/types'
import { appendFacets, buildQuery, type QueryVar } from './searchDoiQuery'
import { DATACITE_API_URL, FACETS } from 'src/data/constants'


function buildDoiSearchParams(variables: QueryVar, facets: string[]): URLSearchParams {
  const searchParams = new URLSearchParams({
    query: buildQuery(variables),
    facets: facets.join(','),
    affiliation: 'false',
    publisher: 'false',
    'disable-facets': 'false',
    include_other_registration_agencies: 'true',
    'page[size]': '0'
  })

  appendFacets(variables, searchParams)

  return searchParams
}


function convertToQueryData(json: any): QueryData {
  const { meta } = json

  // Missing repositories,
  return {
    works: {
      totalCount: meta.total,
      published: meta.published,
      resourceTypes: meta.resourceTypes?.slice(0, 10),
      languages: meta.languages?.slice(0, 10),
      licenses: meta.licensesWithMissing?.slice(0, 10),
      fieldsOfScience: meta.fieldsOfScience?.slice(0, 10),
      affiliations: meta.affiliations,
      repositories: [],
      registrationAgencies: meta.registrationAgencies,
      funders: meta.funders,
      authors: meta.authors?.slice(0, 10),
      creatorsAndContributors: meta.creatorsAndContributors?.slice(0, 10),
      clientTypes: meta.clientTypes?.slice(0, 10),
      clients: meta.clients?.slice(0, 10),
      personToWorkTypesMultilevel: meta.personToWorkTypesMultilevel ?? [],
      citations: meta.citations,
      views: meta.views,
      downloads: meta.downloads,
      citationCount: meta.citationCount,
      viewCount: meta.viewCount,
      downloadCount: meta.downloadCount,
      totalContentUrl: meta.contentUrlCount,
      totalOpenLicenses: meta.openLicensesCount,
      openLicenseResourceTypes: meta.openLicenses,
    }
  }
}

export async function fetchDoisFacets(variables: QueryVar, facets = FACETS.DEFAULT) {
  const options = {
    method: 'GET',
    headers: { accept: 'application/vnd.api+json' }
  }
  const searchParams = buildDoiSearchParams(variables, facets)

  const res = await fetch(
    `${DATACITE_API_URL}/dois?${searchParams.toString()}`,
    options
  )
  const json = await res.json()
  if (!res.ok) {
    const errorMessage = json?.errors?.title || `Request for facets failed with status: ${res.status}`;
    throw new Error(errorMessage);
  }

  const data = convertToQueryData(json)
  return { data }
}

export function useSearchDoiFacetsQuery(variables: QueryVar, facets = FACETS.DEFAULT) {
  // eslint-disable-next-line no-unused-vars
  const { cursor, ...vars } = variables
  const { isPending, data, error } = useQuery({
    queryKey: ['doiSearch', vars, 'facets', facets],
    queryFn: async () => fetchDoisFacets(variables, facets),
  })

  return { loading: isPending, data: data?.data, error }
}


export interface QueryData {
  works: Omit<Works, 'nodes' | 'pageInfo'>
}
