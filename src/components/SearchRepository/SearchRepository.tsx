'use client'

import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Link from 'next/link'

import Pager from 'src/components/Pager/Pager'
import FairFilter from 'src/components/FairFilter/FairFilter'
import FacetList from 'src/components/FacetList/FacetList'
import Error from 'src/components/Error/Error'
import Loading from 'src/components/Loading/Loading'
import RepositoryMetadata from 'src/components/RepositoryMetadata/RepositoryMetadata'

import { QueryVar, useSearchRepositoryQuery } from 'src/data/queries/searchRepositoryQuery'
import { pluralize } from 'src/utils/helpers'


type Props = {
  variables: QueryVar
}


export default function SearchRepositories({ variables }: Props) {
  const { loading, error, data } = useSearchRepositoryQuery(variables)

  if (loading) return <Row><Loading /></Row>

  if (error) return (
    <Row>
      <Col md={{ span: 9, offset: 3 }}>
        <Error title="An error occured." message={error.message} />
      </Col>
    </Row>
  )


  const repositories = data?.repositories

  if (!repositories || repositories.nodes.length == 0) return (
    <Col md={{ span: 9, offset: 3 }}>
      <div className="alert-works">
        <Alert variant="warning">
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

    return (<>
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
    </>)
  }



  const renderResults = () => {
    const hasNextPage = repositories.pageInfo
      ? repositories.pageInfo.hasNextPage
      : false

    const endCursor = repositories.pageInfo
      ? repositories.pageInfo.endCursor
      : ''


    return (<>
      <Row><Col>
        {(repositories.nodes.length || 0) > 0 && (
          <h3 className="member-results">
            {pluralize(repositories.totalCount || 0, 'Repository', false, 'Repositories')}
          </h3>
        )}
      </Col></Row>
      {repositories.nodes.map((repo) => (
        <RepositoryMetadata repo={repo} key={repo.id} />
      ))}

      {(repositories.totalCount || 0) > 20 && (
        <Row><Col>
          <Pager
            url={'/repositories?'}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
          />
        </Col></Row>
      )}
    </>)
  }

  return (<Container fluid>
    <Row>
      <Col md={3}>{renderFacets()}</Col>
      <Col md={9}>{renderResults()}</Col>
    </Row>
  </Container>)
}
