import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Alert } from 'react-bootstrap'
import { useQueryState } from 'next-usequerystate'

import Pager from '../Pager/Pager'
import {Facet, FacetList} from '../FacetList/FacetList'
import Error from '../Error/Error'
import Loading from '../Loading/Loading'
import { RepositoriesNode, RepositoryMetadata } from '../RepositoryMetadata/RepositoryMetadata'


type Props = {
  searchQuery: string
}

interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}


interface RepositoriesQueryVar {
  query: string
  cursor: string
  certificate: string
  software: string
}

interface RepositoriesQueryData{
  repositories: {
    totalCount: number
    pageInfo: PageInfo
    nodes: RepositoriesNode[]
    certificates: [Facet]
    software: [Facet]
  }
}

export const REPOSITORIES_GQL = gql`
  query getRepositoryQuery(
  $query: String
  $cursor: String
  $certificate: String
  $software: String
  ) {
    repositories(
    query: $query
    after: $cursor
    certificate: $certificate
    software: $software
    ) {
      totalCount

      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        ...repoFields
      }
      certificates{...facetFields}
      software{...facetFields}
    }
  }

  fragment repoFields on Repository{
        id
        re3dataId
        name
        language
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
const SearchRepositories: React.FunctionComponent<Props> = ({
  searchQuery
}) => {
  const [cursor] = useQueryState('cursor', { history: 'push' })
  const [certificate] = useQueryState<string>('certificate')
  const [software] = useQueryState<string>('software')
  const { loading, error, data } = useQuery<
    RepositoriesQueryData, RepositoriesQueryVar
  >(REPOSITORIES_GQL, {
    errorPolicy: 'all',
    variables: {
      query: searchQuery,
      cursor: cursor,
      certificate: certificate,
      software: software,
    }
})

const renderFacets = () => {
  if (loading) return ""

  if (!loading && data && data.repositories.totalCount == 0) return ""

  return (
    <div className="panel-group">
      <FacetList
        title="Certificates"
        name="certificate"
        facets={data.repositories.certificates}
      />
      <FacetList
        title="Software"
        name="software"
        facets={data.repositories.software}
      />
    </div>
  )
}

const renderResults = () => {
  //if (loading) return <Loading />

  if (error)
  return (
    <Error title="An error occured." message={error.message} />
    )

  if (data.repositories.nodes.length == 0)
    return (
      <div className="alert-works">
        <Alert bsStyle="warning">No repositories found.</Alert>
      </div>
    )

  const hasNextPage = data.repositories.pageInfo
    ? data.repositories.pageInfo.hasNextPage
    : false
  const endCursor = data.repositories.pageInfo
    ? data.repositories.pageInfo.endCursor
    : ''

  return (
    <>
      <h3 className="member-results">
        {data.repositories.totalCount} Repositories
      </h3>
    {data.repositories.nodes.map((repo) => (
      <React.Fragment key={repo.id}>
        <RepositoryMetadata repo={repo}></RepositoryMetadata>
      </React.Fragment>
  ))}
    {data.repositories.totalCount > 20 && (
      <Pager
        url={'/repositories?'}
        hasNextPage={hasNextPage}
        endCursor={endCursor}
      ></Pager>
    )}
  </>
)
  }

  return (
    <Row>
      {loading? <Loading/>:(
        <>
          <div className="col-md-3 hidden-xs hidden-sm" id="sidebar">
            {renderFacets()}
          </div>
          <div className="col-md-6" id="content">
            {renderResults()}
          </div>
        </>
    )}
  </Row>
  )
}

export default SearchRepositories
