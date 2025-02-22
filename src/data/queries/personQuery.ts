import { gql } from '@apollo/client'
import { Person, PersonMetadata } from 'src/data/types'
import type { QueryData as Facets } from 'src/data/queries/searchDoiFacetsQuery'
import apolloClient from 'src/utils/apolloClient/apolloClient'
import { buildPersonName, getCountryName, getDateFromParts } from 'src/utils/helpers'
import { fetchDoisFacets } from './searchDoiFacetsQuery'
import { ORCID_API_URL } from 'src/data/constants'

const FACETS = [
  'citation_count',
  'view_count',
  'download_count',
  'content_url_count',
  'open_licenses',
  'open_licenses_count'
]

function convertToQueryData(id: string, jsonPerson: any, jsonEmployments: any, facets: Facets): QueryData {
  const givenName = jsonPerson.name['given-names']?.value || ''
  const familyName = jsonPerson.name['family-name']?.value || ''
  const alternateName = jsonPerson['other-names']['other-name'].map(n => n.content)

  const name = buildPersonName({
    'orcid-id': id,
    'given-names': givenName,
    'family-names': familyName,
    'credit-name': jsonPerson.name['credit-name']?.value || undefined,
  })

  const identifiers = jsonPerson['external-identifiers']['external-identifier'].map(i => ({
    identifierType: i["external-id-type"],
    identifierUrl: i["external-id-url"].value,
    identifier: i["external-id-value"],
  }))

  const links = jsonPerson['researcher-urls']['researcher-url'].map(r => ({
    name: r["url-name"],
    url: r.url.value
  }))

  const countryCode = jsonPerson["addresses"]["address"].length > 0 ? jsonPerson["addresses"]["address"][0]["country"]["value"] : ''
  const countryName = getCountryName(countryCode) || countryCode
  const country = countryCode ? { id: countryCode, name: countryName } : undefined as any

  const employment = jsonEmployments['affiliation-group'].map(a => {
    const org = a.summaries[0]['employment-summary']['organization']['disambiguated-organization'] || {}
    const start = a['summaries'][0]['employment-summary']['start-date'] || {}
    const end = a['summaries'][0]['employment-summary']['end-date'] || {}

    return {
      organizationId: org['disambiguation-source'] === "GRID" ? 'https://grid.ac/institutes/' + org['disambiguated-organization-identifier'] : undefined,
      organizationName: a['summaries'][0]['employment-summary']['organization']['name'],
      roleTitle: a['summaries'][0]['employment-summary']['role-title'],
      startDate: getDateFromParts(start?.year?.value, start?.month?.value, start?.day?.value),
      endDate: getDateFromParts(end?.year?.value, end?.month?.value, end?.day?.value),
    }
  })

  return {
    person: {
      id: 'https://orcid.org/' + id,
      name,
      description: jsonPerson.biography?.content || '',
      links,
      identifiers,
      country,
      givenName,
      familyName,
      alternateName,
      citationCount: facets.works.citationCount || 0,
      viewCount: facets.works.viewCount || 0,
      downloadCount: facets.works.downloadCount || 0,
      employment,
      totalWorks: {
        totalCount: facets.works.totalCount,
        totalContentUrl: facets.works.totalContentUrl || 0,
        totalOpenLicenses: facets.works.totalOpenLicenses || 0,
        openLicenseResourceTypes: facets.works.openLicenseResourceTypes || []
      }
    } as any
  }
}

export async function fetchPerson(id: string) {
  try {
    const options = {
      method: 'GET',
      headers: { 'Content-type': 'application/json' }
    }

    const [person, employments, facets] = await Promise.all([
      fetch(`${ORCID_API_URL}/${id}/person`, options),
      fetch(`${ORCID_API_URL}/${id}/employments`, options),
      fetchDoisFacets({ userId: id }, FACETS)
    ])


    const jsonPerson = await person.json()
    const jsonEmployments = await employments.json()


    const data = convertToQueryData(id, jsonPerson, jsonEmployments, facets.data)

    return { data }
  } catch (error) {
    return { error }
  }
}

export async function fetchPersonMetadata(id: string) {
  const { data, error } = await apolloClient.query<MetadataQueryData, QueryVar>({
    query: PERSON_METADATA_QUERY,
    variables: { id },
    errorPolicy: 'all'
  })

  return { data, error }
}

export async function fetchPersonGQL(id: string) {
  const orcid = 'http://orcid.org/' + id

  const { data, error } = await apolloClient.query<QueryData, QueryVar>({
    query: PERSON_QUERY,
    variables: { id: orcid },
    errorPolicy: 'all'
  })

  return { data, error }
}


export const PERSON_METADATA_QUERY = gql`
  query getPersonQuery(
    $id: ID!
  ) {
    person(id: $id) {
      id
      description
      name
    }
  }
`

export const PERSON_QUERY = gql`
  query getPersonQuery(
    $id: ID!
  ) {
    person(id: $id) {
      id
      description
      links {
        url
        name
      }
      identifiers {
        identifier
        identifierType
        identifierUrl
      }
      country {
        name
        id
      }
      name
      alternateName
      givenName
      familyName
      employment {
        organizationId
        organizationName
        roleTitle
        startDate
        endDate
      }
      citationCount
      viewCount
      downloadCount
      totalWorks: works {
        totalCount
        totalContentUrl
        totalOpenLicenses
        openLicenseResourceTypes {
          id
          title
          count
        }
      }
    }
  }
`

export interface MetadataQueryData {
  person: PersonMetadata
}


export interface QueryData {
  person: Person
}

export interface QueryVar {
  id: string
}
