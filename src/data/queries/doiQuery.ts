import { gql } from '@apollo/client'
import apolloClient from 'src/utils/apolloClient/apolloClient'
import { WorkMetadata, Work } from 'src/data/types'
import { workFragment } from 'src/data/queries/queryFragments'
import ISO6391 from 'iso-639-1'


export async function fetchDoi(id: string) {
  try {
    const options = { method: 'GET', headers: { accept: 'application/vnd.api+json' } };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dois/${id}?affiliation=false&publisher=true`, options)
    const json = await res.json()
    const attrs = json.data.attributes

    const repRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${json.data.relationships.client.data.id}`, options)
    const repJson = await repRes.json()

    const data: QueryData = {
      work: {
        ...attrs,
        id: 'https://doi.org/' + json.data.id,
        language: { id: attrs.language, name: ISO6391.getName(attrs.language) },
        rights: attrs.rightsList,
        creators: mapPeople(attrs.creators),
        contributors: mapPeople(attrs.contributors),
        fieldsOfScience: extractFOS(attrs.subjects),
        registrationAgency: { id: 'datacite', name: 'DataCite' },
        repository: { id: repJson.data.id, name: repJson.data.attributes.name },
        schemaOrg: ''
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







function extractFOS(subjects: any) {
  const fos = subjects
    .filter(s => s.subject.startsWith('FOS: '))
    .map(({ subject: s }) => ({ id: s.slice(5).toLowerCase(), name: s.slice(5) }))

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
