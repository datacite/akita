'use client'

import React from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { Row, Col, Alert } from 'react-bootstrap'

import Pager from 'src/components/Pager/Server'
import FairFilter from 'src/components/FairFilter/FairFilter'
import FacetList from 'src/components/FacetList/Server'
import Error from 'src/components/Error/Error'
import Loading from 'src/components/Loading/Loading'
import RepositoryMetadata from 'src/components/RepositoryMetadata/RepositoryMetadata'

import { SEARCH_REPOSITORIES_GQL, QueryData, QueryVar } from 'src/data/queries/searchRepositoryQuery'
import { pluralize } from 'src/utils/helpers'


type Props = {
  variables: QueryVar
}


export default function SearchRepositories ({ variables }: Props) {
  const { loading, error, data } = useQuery<QueryData, QueryVar>(
    SEARCH_REPOSITORIES_GQL,
    {
      errorPolicy: 'all',
      variables: variables
    }
  )

  if (loading) return <Row><Loading /></Row>

  if (error) return (
    <Row>
      <Col md={9} mdOffset={3}>
        <Error title="An error occured." message={error.message} />
      </Col>
    </Row>
  )


  const repositories = data?.repositories

  if (!repositories || repositories.nodes.length == 0) return (
    <Col md={9} mdOffset={3}>
      <div className="alert-works">
      <Alert bsStyle="warning">
        <p>No repositories found. If a domain repository is not available for your
          kind of data, you may be able to use a general repository such as:</p>

        <ul>
          <li><Link href="/repositories/10.17616/R34S33">Dryad</Link></li>
          <li><Link href="/repositories/10.17616/R3PK5R">Figshare</Link></li>
          <li><Link href="/repositories/10.17616/R3C880">Harvard Dataverse</Link></li>
          <li><Link href="/repositories/10.17616/R3DD11">Mendeley Data</Link></li>
          <li><Link href="/repositories/10.17616/R3N03T">Open Science Framework</Link></li>
          <li><Link href="/repositories/10.17616/R3QP53">Zenodo</Link></li>
        </ul>

        <p>You may also have an institutional repository or other local resources
          at your organization available to you.  Contact your data librarian or
          computing facility for local data services.</p>

        </Alert>
      </div>
    </Col>
  )


const renderFacets = () => {
  if (repositories.totalCount == 0) return ""

  return (
    <div className="col-md-3 hidden-xs hidden-sm" id="sidebar">
      <div className="panel-group">
        <FairFilter url="repositories/?" />

        <FacetList
          data={repositories.certificates || []}
          title="Certificates"
          id="certificate"
          param="certificate"
          url="repositories/?"
        />
        <FacetList
          data={repositories.software || []}
          title="Software"
          id="software"
          param="software"
          url="repositories/?"
        />
      </div>
    </div>
  )
}



const renderResults = () => {
  const hasNextPage = repositories.pageInfo
    ? repositories.pageInfo.hasNextPage
    : false

  const endCursor = repositories.pageInfo
    ? repositories.pageInfo.endCursor
    : ''


  return (
    <Col md={9} id="content">
      {(repositories.nodes.length || 0) > 0 && (
        <h3 className="member-results">
          {pluralize(repositories.totalCount || 0, 'Repository', false, 'Repositories')}
        </h3>
      )}

      {repositories.nodes.map((repo) => (
        <RepositoryMetadata repo={repo} key={repo.id} />
      ))}
      
      {(repositories.totalCount || 0) > 20 && (
        <Pager
          url={'/repositories?'}
          hasNextPage={hasNextPage}
          endCursor={endCursor}
        />
      )}
    </Col>
  )
}

  return (
    <Row>
      {renderFacets()}
      {renderResults()}
    </Row>
  )
}
