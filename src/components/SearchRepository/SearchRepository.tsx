import React from 'react'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import { Row, Alert } from 'react-bootstrap'
import { useQueryState } from 'next-usequerystate'

import Pager from '../Pager/Pager'
import {FACET_FIELDS, Facet, FacetList} from '../FacetList/FacetList'
import Error from '../Error/Error'
import Loading from '../Loading/Loading'
import { RepositoriesNode, RepositoryMetadata,
  REPOSITORY_FIELDS } from '../RepositoryMetadata/RepositoryMetadata'


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
  ${FACET_FIELDS}
  ${REPOSITORY_FIELDS}

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
      nodes {...repoFields}
      certificates{...facetFields}
      software{...facetFields}
    }
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

const renderNoneFound = () => {
  return (
    <Alert bsStyle="warning">

      <p>No repositories found. If a domain repository is not available for your
        kind of data, you may be able to use a general repository such as:</p>

      <ul>
        <li><Link href="/repositories/cdl.dryad">Dryad</Link></li>
        <li><Link href="/repositories/figshare.ars">Figshare</Link></li>
        <li><Link href="/repositories/datacite.harvard">Harvard Dataverse</Link></li>
        <li><Link href="/repositories/bl.mendeley">Mendeley Data</Link></li>
        <li><Link href="/repositories/cdl.cos">Open Science Framework</Link></li>
        <li><Link href="/repositories/cern.zenodo">Zenodo</Link></li>
      </ul>

      <p>You may also have an institutional repository or other local resources
        at your organization available to you.  Contact your data librarian or
        computing facility for local data services.</p>

    </Alert>
  )
}
const renderPager = () => {
  if (data.repositories.totalCount < 20) return ""

  const hasNextPage = data.repositories.pageInfo
    ? data.repositories.pageInfo.hasNextPage
    : false
  const endCursor = data.repositories.pageInfo
    ? data.repositories.pageInfo.endCursor
    : ''

  return(
      <Pager
        url={'/repositories?'}
        hasNextPage={hasNextPage}
        endCursor={endCursor}
      ></Pager>
  )
}
const renderResults = () => {
  if (error)
    return (
      <Error title="An error occured." message={error.message} />
    )

  if (data.repositories.nodes.length == 0)
    return (
      <div className="alert-works">
        {renderNoneFound()}
      </div>
    )
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
            {renderPager()}
          </div>
        </>
    )}
  </Row>
  )
}

export default SearchRepositories