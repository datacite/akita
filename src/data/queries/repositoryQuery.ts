import { gql } from '@apollo/client'
import { Repository, RepositoryMetadata } from 'src/data/types'
import apolloClient from 'src/utils/apolloClient/apolloClient'


export async function fetchRepositoryMetadata(id: string) {
  const { data, error } = await apolloClient.query<QueryData, QueryVar>({
    query: REPOSITORY_METADATA_QUERY,
    variables: { id },
    errorPolicy: 'all'
  })

  return { data, error }
}

export async function fetchRepository(variables: QueryVar) {
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

export interface MetadataQueryVar {
  id: string
}

export interface MetadataQueryData {
  repository: RepositoryMetadata
}


export interface QueryData {
  repository: Repository
}

export interface QueryVar {
  id: string
}
