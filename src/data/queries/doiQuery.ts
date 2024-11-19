import { gql } from '@apollo/client'
import apolloClient from 'src/utils/apolloClient/apolloClient'
import { WorkMetadata, Work } from 'src/data/types'
import { workFragment } from 'src/data/queries/queryFragments'
import ISO6391 from 'iso-639-1'


export async function fetchDoi(id: string) {
  try {
    const options = { method: 'GET', headers: { accept: 'application/vnd.api+json' } };
    const searchParams = new URLSearchParams({
      query: 'uid:' + id,
      include: 'client',
      affiliation: 'false',
      publisher: 'true',
      'disable-facets': 'true',
      include_other_registration_agencies: 'true'
    })

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dois?${searchParams.toString()}`, options)
    const json = await res.json()
    const work = json.data[0]
    const attrs = work.attributes
    const repo = json.included[0]

    const data: QueryData = {
      work: {
        ...attrs,
        id: normalizeDoi(work.id),
        language: { id: attrs.language, name: ISO6391.getName(attrs.language) },
        rights: attrs.rightsList,
        creators: mapPeople(attrs.creators),
        contributors: mapPeople(attrs.contributors),
        fieldsOfScience: extractFOS(attrs.subjects),
        registrationAgency: { id: attrs.agency, name: REGISTRATION_AGENCIES[attrs.agency] },
        repository: { id: repo.id, name: repo.attributes.name },
        schemaOrg: '',
      }
    }

    return { data }

  } catch (error) {
    return { error }
  }
}



export async function fetchDoiGQL(id: string) {
  const { data, error } = await apolloClient.query<QueryData, QueryVar>({
    query: DOI_QUERY,
    variables: { id },
    errorPolicy: 'all'
  })

  return { data, error }
}

export const DOI_METADATA_QUERY = gql`
  query getMetadataQuery($id: ID!) {
    work(id: $id) {
      id
      doi
      types {
        resourceTypeGeneral
        resourceType
      }
      titles {
        title
      }
      descriptions {
        description
      }
      registrationAgency {
        id
        name
      }
      schemaOrg
    }
  }
`

export const DOI_QUERY = gql`
  query getDoiQuery($id: ID!) {
    work(id: $id) {
      ...WorkFragment
      contentUrl
      contributors {
        id
        givenName
        familyName
        name
        contributorType
        affiliation {
          id
          name
        }
      }
      fundingReferences {
        funderIdentifier
        funderIdentifierType
        funderName
        awardTitle
        awardUri
        awardNumber
      }
      claims {
        id
        sourceId
        state
        claimAction
        claimed
        errorMessages {
          status
          title
        }
      }
      formattedCitation
      schemaOrg
      viewsOverTime {
        yearMonth
        total
      }
      downloadsOverTime {
        yearMonth
        total
      }
    }
  }
  ${workFragment}
`

export interface MetadataQueryData {
  work: WorkMetadata
}

export interface QueryData {
  work: Work
}

export interface QueryVar {
  id: string
}



const ID_BASE = process.env.ENV === 'PROD' ? 'https://doi.org/' : 'https://handle.stage.datacite.org/'

const REGISTRATION_AGENCIES = {
  "airiti": "Airiti",
  "cnki": "CNKI",
  "crossref": "Crossref",
  "datacite": "DataCite",
  "istic": "ISTIC",
  "jalc": "JaLC",
  "kisti": "KISTI",
  "medra": "mEDRA",
  "op": "OP"
}


function normalizeDoi(doi: string) {
  if (!doi) return null;

  const match = doi.match(
    /^(?:(http|https):\/\/?(dx\.)?(doi.org|handle.test.datacite.org)\/)?(doi:)?(10\.\d{4,5}\/.+)$/i
  );

  const normalizedDoi = match ? match[match.length - 1] : null;

  if (normalizedDoi) {
    // Remove non-printing whitespace and downcase
    const cleanedDoi = normalizedDoi.replace(/\u200B/g, '').toLowerCase();
    return `${ID_BASE}${cleanedDoi}`;
  }

  return null;
}


function extractFOS(subjects: any) {
  const fos = subjects
    .filter(s => s.subject.startsWith('FOS: '))
    .map(({ subject: s }) => ({ id: kebabify(s.slice(5)), name: s.slice(5) }))

  const uniqueFOS = Array.from(new Set(fos.map(f => f.id))).map(id => fos.find(f => f.id === id))
  return uniqueFOS
}


function mapPeople(people: any[]) {
  return people.map(p => {
    return {
      ...p,
      affiliation: p.affiliation.map(a => ({ ...a, id: a.affiliationIdentifier })),
      id: p.nameIdentifiers[0].nameIdentifier,
    }
  })
}


function kebabify(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Insert a dash between lowercase and uppercase letters
    .toLowerCase();
}
