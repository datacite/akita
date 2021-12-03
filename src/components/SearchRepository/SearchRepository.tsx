import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Col, Alert } from 'react-bootstrap'
import { useQueryState } from 'next-usequerystate'
import { pluralize } from '../../utils/helpers'

import Pager from '../Pager/Pager'
import FilterItem from '../FilterItem/FilterItem'
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


interface RepositoryFacet {
  id: string
  title: string
  count: number
}

interface RepositoriesQueryVar {
  query: string
  cursor: string
}

interface RepositoriesQueryData{
  repositories: {
    totalCount: number
    pageInfo: PageInfo
    nodes: RepositoriesNode[]
  }
}

export const REPOSITORIES_GQL = gql`
  query getRepositoryQuery(
  $query: String
  $cursor: String
  ) {
    repositories(
    query:$query
    after: $cursor
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        id
        re3dataId
        name
        language
        description
        type
        repositoryType
        url
      }
    }
  }
`
const SearchRepositories: React.FunctionComponent<Props> = ({
  searchQuery
}) => {
  const [cursor] = useQueryState('cursor', { history: 'push' })
  const { loading, error, data } = useQuery<
    RepositoriesQueryData,
    RepositoriesQueryVar
  >(REPOSITORIES_GQL, {
    errorPolicy: 'all',
    variables: {
      query: searchQuery,
      cursor: cursor
    }
  })

  const renderResults = () => {
    if (loading) return <Loading />

    if (error)
      return (
        <Col md={9} mdOffset={3}>
          <Error title="An error occured." message={error.message} />
        </Col>
      )

    if (data.repositories.nodes.length == 0)
      return (
        <Col md={9} mdOffset={3}>
          <div className="alert-works">
            <Alert bsStyle="warning">No repositories found.</Alert>
          </div>
        </Col>
      )

    const hasNextPage = data.repositories.pageInfo
      ? data.repositories.pageInfo.hasNextPage
      : false
    const endCursor = data.repositories.pageInfo
      ? data.repositories.pageInfo.endCursor
      : ''

    return (
      <Col md={9} mdOffset={3} id="content">
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
      </Col>
    )
  }

  return (
  <Row>
    {renderResults()}
  </Row>
  )
}

export default SearchRepositories
