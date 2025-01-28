import { gql } from '@apollo/client'
import { Person, PersonMetadata } from 'src/data/types'
import apolloClient from 'src/utils/apolloClient/apolloClient'
import { buildPersonName, getDateFromParts } from 'src/utils/helpers'


function convertToQueryData(id: string, jsonPerson: any, jsonEmployments: any): QueryData {
  const givenName = jsonPerson.name['given-names'].value
  const familyName = jsonPerson.name['family-name'].value
  const alternateName = jsonPerson['other-names']['other-name'].map(n => n.content)

  const name = buildPersonName({
    'orcid-id': id,
    'given-names': givenName,
    'family-names': familyName,
    'credit-name': jsonPerson.name['credit-name'].value,
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

  const employment = jsonEmployments['affiliation-group'].map(a => {
    const org = a.summaries[0]['employment-summary']['organization']['disambiguated-organization'] || {}
    const start = a['summaries'][0]['employment-summary']['start-date'] || {}
    const end = a['summaries'][0]['employment-summary']['end-date'] || {}

    return {
      organization_id: org['disambiguation-source'] === "GRID" ? 'https://grid.ac/institutes/' + org['disambiguated-organization-identifier'] : undefined,
      organization_name: a['summaries'][0]['employment-summary']['organization']['name'],
      role_title: a['summaries'][0]['employment-summary']['role-title'],
      start_date: getDateFromParts(start?.year?.value, start?.month?.value, start?.day?.value),
      end_date: getDateFromParts(end?.year?.value, end?.month?.value, end?.day?.value),
    }
  })

  return {
    person: {
      id: 'http://orcid.org/' + id,
      name,
      description: jsonPerson.biography.content,
      links,
      identifiers,
      country: null,
      givenName,
      familyName,
      alternateName,
      citationCount: null,
      viewCount: null,
      downloadCount: null,
      employment,
    }
  }
}

export async function fetchPerson(id: string) {
  try {
    const options = {
      method: 'GET',
      headers: { 'Content-type': 'application/json' }
    }

    const [person, employments] = await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_ORCID_API_URL}/${id}/person`,
        options
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_ORCID_API_URL}/${id}/employments`,
        options
      )
    ])

    const jsonPerson = await person.json()
    const jsonEmployments = await employments.json()

    console.log(convertToQueryData(id, jsonPerson, jsonEmployments))
    const data = { jsonPerson, jsonEmployments } // convertToQueryData(id, jsonPerson, jsonEmployments)
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
