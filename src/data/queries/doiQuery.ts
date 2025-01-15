import { gql } from '@apollo/client'
import apolloClient from 'src/utils/apolloClient/apolloClient'
import { WorkMetadata, Work } from 'src/data/types'
import { workFragment } from 'src/data/queries/queryFragments'
import { mapJsonToWork } from 'src/utils/helpers'

function buildDoiSearchParams(id: string): URLSearchParams {
  return new URLSearchParams({
    query: 'uid:' + id,
    include: 'client',
    affiliation: 'false',
    publisher: 'true',
    'disable-facets': 'true',
    include_other_registration_agencies: 'true',
    detail: 'true'
  })
}

function convertToQueryData(work: any, included: any[]): QueryData {
  return {
    work: mapJsonToWork(work, included)
  }
}

export async function fetchDoi(id: string) {
  try {
    const options = {
      method: 'GET',
      headers: { accept: 'application/vnd.api+json' }
    }
    const searchParams = buildDoiSearchParams(id)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dois?${searchParams.toString()}`,
      options
    )
    const json = await res.json()

    if (json.meta.total === 0) throw new Error('No works found')
    // Don't throw this error until https://github.com/datacite/datacite/issues/1836 gets resolved
    // if (json.meta.total > 1) throw new Error('Multiple works found')

    const data = convertToQueryData(json.data[0], json.included)
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
