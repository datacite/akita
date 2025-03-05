import { gql } from '@apollo/client'
import { Repository, RepositoryMetadata } from 'src/data/types'
import apolloClient from 'src/utils/apolloClient/apolloClient'
import fetchConditionalCache from 'src/utils/fetchConditionalCache'
import { DATACITE_API_URL } from 'src/data/constants'
import { mapJsonToRepository } from 'src/utils/helpers'

function convertToQueryData(repository: any): QueryData {
  return {
    repository: mapJsonToRepository(repository)
  }
}

export async function fetchRepository(id: string) {
  try {
    const options = {
      method: 'GET',
      headers: { accept: 'application/vnd.api+json' }
    }

    const res = await fetch(`${DATACITE_API_URL}/reference-repositories/${id}`, options)
    console.log(id)

    if (!res.ok)
      throw new Error(`API returned ${res.status}`)

    const json = await res.json()

    const data = convertToQueryData(json.data)
    return { data }
  } catch (error) {
    return { error }
  }
}

export async function fetchRepositoryMetadataGQL(id: string) {
  const { data, error } = await apolloClient.query<MetadataQueryData, QueryVar>({
    query: REPOSITORY_METADATA_QUERY,
    variables: { id },
    errorPolicy: 'all'
  })

  return { data, error }
}

export async function fetchRepositoryGQL(variables: QueryVar) {
  const { data, error } = await apolloClient.query<QueryData, QueryVar>({
    query: REPOSITORY_QUERY,
    variables,
    errorPolicy: 'all'
  })

  return { data, error }
}

export const REPOSITORY_METADATA_QUERY = gql`
  query repositoryDetailQuery(
    $id: ID!
  ) {
    repository(id: $id){
      id:uid
      name
      re3dataDoi
    }
  }
`

export const REPOSITORY_QUERY = gql`
  query repositoryDetailQuery(
    $id: ID!
  ) {
    repository(id: $id){
      ...repositoryDetailFields
    }
  }

  fragment repositoryDetailFields on Repository{
    ...repoFields
    citationCount
    downloadCount
    viewCount
    contact
    keyword
    pidSystem
    providerType
    dataUpload{
      type
    }
    dataAccess {
      type
    }
    certificate
    subject {
      name
    }
    works {
      totalCount
      languages{...facetFields}
      resourceTypes{...facetFields}
      fieldsOfScience{...facetFields}
      authors{...facetFields}
      licenses{...facetFields}
      published{...facetFields}
    }
  }

  fragment repoFields on Repository{
    id:uid
    re3dataDoi
    clientId
    name
    language
    keyword
    subject {
      name
    }
    description
    type
    repositoryType
    url
  }

  fragment facetFields on Facet{
    id
    title
    count
  }
`

export interface MetadataQueryData {
  repository: RepositoryMetadata
}


export interface QueryData {
  repository: Repository
}

export interface QueryVar {
  id: string
}
