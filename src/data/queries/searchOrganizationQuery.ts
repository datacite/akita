import { Organizations, Facet } from 'src/data/types'
import { RORV2Client, RORV2SearchParams, RORV2Organization, RORV2SearchResponse, RORFacet } from 'src/data/clients/ror-v2-client'
import { titleCase , getCountryName} from 'src/utils/helpers'
import { useQuery } from '@tanstack/react-query'


const rorClient = new RORV2Client()
const ROR_PER_PAGE = 20

// Query keys for cache management
export const rorKeys = {
  all: ['ror'] as const,
  organization: (id: string) => [...rorKeys.all, 'organization', id] as const,
  search: (params: RORV2SearchParams) => [...rorKeys.all, 'search', params] as const,
};

function cursorToPage(cursor :string) {
  if (!cursor) return 1
  const potentialPage = cursor ? parseInt(cursor) : 1
  return potentialPage <= 1 ? 1 : potentialPage
}

function pageToCursor(page: number) {
  return page.toString()
}

/**
 * Hook for searching organizations
 */
export function useRORSearch(params: QueryVar = {}) {
  const pageParam = params.cursor ? cursorToPage(params.cursor) : 1
  const { isPending, data, error} = useQuery<RORV2SearchResponse, Error>({
    queryKey: rorKeys.search(params),
    queryFn: () => rorClient.searchOrganizations({
      query: params.query,
      types: params.types,
      countries: params.country, // map 'country' to 'countries'
      page: pageParam
    }),
    enabled: Boolean(params.query || params.types || params.country), // Only run if there are search parameters
    staleTime: 1 * 60 * 1000, // Consider search results stale after 1 minute
  });

  const transformedData = data ? convertRORToQueryData(data, pageParam) : undefined;
  return { loading: isPending, data: transformedData, error }
}

function convertROROrganizationToOrganizatinoNode(org: RORV2Organization) {
  const country = org.locations?.[0]?.geonames_details ? {
    id: org.locations?.[0]?.geonames_details.country_code,
    name: getCountryName(
      org.locations?.[0]?.geonames_details.country_code,
    ) || org.locations?.[0]?.geonames_details.country_name,
  } : {id: "", name:""}



  const primary_name = org.names.find((name) => name.types.includes('ror_display'))
  const aliases = org.names
    .filter(name => name.types.includes('alias'))
    .map(name => name.value)

  const acronyms = org.names
    .filter(name => name.types.includes('acronym'))
    .map(name => name.value)

  const alternate_names = [...aliases, ...acronyms]

  const identifiers = org.external_ids.flatMap(external_id =>
    external_id.all.map(id => ({
      identifierType: external_id.type,
      identifier: external_id.type === 'fundref'
        ? `10.13039/${id.replace(/\s+/g, '')}`
        : id.replace(/\s+/g, '')
    }))
  )


  const url = org.links?.find((link) => link.type === 'website')
  const wikipediaUrl = org.links?.find((link) => link.type === 'wikipedia')
  return {
    id: org.id,
    name: primary_name?.value || "MISSING",
    memberId: "",
    memberRoleId: "",
    alternateName: alternate_names,
    inceptionYear: org.established,
    types: org.types,
    url: url?.value || '',
    wikipediaUrl: wikipediaUrl?.value || '',
    country: country,
    identifiers: identifiers
  }
}

function convertRORCountriesFacet(counties: RORFacet[]): Facet[] {
  return counties.map(country => ({
    id: country.id,
    title: getCountryName(country.id) || country.title,
    count: country.count
  }))
}

function convertRORTypeFacet(types: RORFacet[]): Facet[] {
  return types.map(type => ({
    id: type.id.toLowerCase(),
    title: titleCase(type.title),
    count: type.count
  }))
}

function convertRORToQueryData(rorResponse: RORV2SearchResponse, page: number = 1) {
  const countries = convertRORCountriesFacet(rorResponse?.meta?.countries || [])
  const types = convertRORTypeFacet(rorResponse?.meta?.types || [])
  const total = rorResponse.number_of_results
  const currentPageTotal = rorResponse.items?.length || 0
  const runningTotal = (page - 1) * ROR_PER_PAGE + currentPageTotal
  return {
    organizations: {
      totalCount: total,
      pageInfo: {
        endCursor: pageToCursor(page+1),
        hasNextPage: runningTotal < total
      },
      types: types,
      countries: countries,
      nodes: rorResponse?.items?.map(org => (
        convertROROrganizationToOrganizatinoNode(org)
      )) || []
    }
  }
}

export interface QueryData {
  organizations: Organizations
}

export interface QueryVar {
  query?: string
  cursor?: string
  types?: string
  country?: string
}
