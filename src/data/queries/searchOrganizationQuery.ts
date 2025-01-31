import { Organizations, Facet } from 'src/data/types'
import { RORV2Client, RORV2SearchParams, RORV2Organization, RORV2SearchResponse, RORFacet } from 'src/data/clients/ror-v2-client'
import { titleCase , getCountryName} from 'src/utils/helpers'
import fetchConditionalCache from 'src/utils/fetchConditionalCache'
import { useQuery } from '@tanstack/react-query'


const rorClient = new RORV2Client()
const ROR_PER_PAGE = 20

// Query keys for cache management
export const rorKeys = {
  all: ['ror'] as const,
  organization: (id: string) => [...rorKeys.all, 'organization', id] as const,
  search: (params: RORV2SearchParams) => [...rorKeys.all, 'search', params] as const,
  providers: () => [...rorKeys.all, 'providers'] as const,
};

function cursorToPage(cursor :string) {
  if (!cursor) return 1
  const potentialPage = cursor ? parseInt(cursor) : 1
  return potentialPage <= 1 ? 1 : potentialPage
}

function pageToCursor(page: number) {
  return page.toString()
}

export function useProvidersMap() {
  const KEEP_TIME = 1 * 60 * 60 * 1000
  return useQuery<Record<string, RelatedProviderResponse>, Error>({
    queryKey: rorKeys.providers(),
    queryFn: async () => fetchRelatedProvidersMap(),
    staleTime: KEEP_TIME,
    gcTime: KEEP_TIME,
  });
}
/**
 * Hook for searching organizations
 */
export function useRORSearch(params: QueryVar = {}) {
  const pageParam = params.cursor ? cursorToPage(params.cursor) : 1
  const providersQuery = useProvidersMap();
  const searchQuery = useQuery({
    queryKey: rorKeys.search(params),
    queryFn: async () => {
      const rorResponse = await rorClient.searchOrganizations({
        query: params.query,
        types: params.types,
        countries: params.country,
        page: pageParam
      })
      return convertRORToQueryData(rorResponse, pageParam, providersQuery.data || {})
    },
    enabled: Boolean(
      (params.query || params.types || params.country) &&
      !providersQuery.isLoading
    ),
    staleTime: 1 * 60 * 1000,
    gcTime: 1 * 60 * 1000,
  });
  return {
    loading: providersQuery.isLoading || searchQuery.isPending,
    data: searchQuery.data,
    error: providersQuery.error || searchQuery.error
  }
}

async function convertROROrganizationToOrganizatinoNode(
  org: RORV2Organization,
  relatedProvider: RelatedProviderResponse
) {
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

  const identifiers = org.external_ids?.flatMap(external_id =>
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
    memberId: relatedProvider.data?.symbol?.toLowerCase() || "",
    memberRoleId: relatedProvider.data?.memberType?.toLowerCase() || "",
    alternateName: alternate_names,
    inceptionYear: org.established,
    types: org.types,
    url: url?.value || '',
    wikipediaUrl: wikipediaUrl?.value || '',
    country: country,
    identifiers: identifiers || []
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

async function convertRORToQueryData(
  rorResponse: RORV2SearchResponse,
  page: number = 1,
  providersMap: Record<string, RelatedProviderResponse>
) {
  const countries = convertRORCountriesFacet(rorResponse?.meta?.countries || [])
  const types = convertRORTypeFacet(rorResponse?.meta?.types || [])
  const total = rorResponse.number_of_results
  const currentPageTotal = rorResponse.items?.length || 0
  const runningTotal = (page - 1) * ROR_PER_PAGE + currentPageTotal

  // Fetch the Providers map
  console.log(providersMap)
  const nodes = await Promise.all(
    (rorResponse?.items || []).map(org => {
      const relatedProvider = providersMap[org.id] || { data: { symbol: '', memberType: '' } }
      return convertROROrganizationToOrganizatinoNode(org, relatedProvider)
    })
  )

  return {
    organizations: {
      totalCount: total,
      pageInfo: {
        endCursor: pageToCursor(page+1),
        hasNextPage: runningTotal < total
      },
      types: types,
      countries: countries,
      nodes
    }
  }
}

function extractProviderData(provider: any) : RelatedProviderInfo {
 return provider?.attributes ?
   {
   symbol: provider.attributes.symbol,
   memberType: provider.attributes.memberType,
 }: {
   symbol: "",
   memberType: ""
 }
}

function buildProviderSearchParams(ror_id: string): URLSearchParams {
  return new URLSearchParams({
    query: `ror_id:"${ror_id}"`,
  })
}
interface RelatedProviderInfo {
  symbol: string
  memberType: string
}
interface RelatedProviderResponse {
  data: RelatedProviderInfo
  error?: any
}

async function fetchRelatedProvidersMap(): Promise<Record<string, RelatedProviderResponse>> {
  try {
    const options = {
      method: 'GET',
      headers: { accept: 'application/vnd.api+json' }
    }

    const searchParams = new URLSearchParams({
      'page[size]': '1000',
      query: "ror_id:*",
      'fields[provider]': 'symbol,memberType'
    })

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/providers?${searchParams.toString()}`,
      options
    )
    const json = await res.json()

    // Create a map of ROR ID to provider info
    const providersMap: Record<string, RelatedProviderResponse> = {}
    json.data.forEach((provider: any) => {
      const rorId = provider.attributes.rorId
      providersMap[rorId] = {
        data: extractProviderData(provider)
      }
    })
    return providersMap
  } catch (error) {
    return {}
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
