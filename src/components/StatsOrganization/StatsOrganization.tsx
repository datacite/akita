import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Col, Alert } from 'react-bootstrap'

import Error from '../Error/Error'
import Loading from '../Loading/Loading'
import ProductionChart from '../ProductionChart/ProductionChart'
import { ContentFacet } from '../WorksListing/WorksListing'

export interface Source {
  totalCount: number
}

export interface Works {
  totalCount: number
  published: ContentFacet[]
}

interface WorkQueryData {
  organizations: Source
  total: Works
  associated: Works
  cited: Works
  viewed: Works
  downloaded: Works
  funded: Works
  contributed: Works
  affiliated: Works
}

export const STATS_GQL = gql`
  query getStatsQuery {
    organizations {
      totalCount
    }
    total: works {
      totalCount
      published {
        title
        count
      }
    }
    associated: works(
      hasOrganization: true
      hasAffiliation: true
      hasFunder: true
    ) {
      totalCount
      published {
        title
        count
      }
    }
    funded: works(hasFunder: true) {
      totalCount
      published {
        title
        count
      }
    }
    affiliated: works(hasAffiliation: true) {
      totalCount
      published {
        title
        count
      }
    }
    contributed: works(hasOrganization: true) {
      totalCount
      published {
        title
        count
      }
    }
    cited: works(
      hasOrganization: true
      hasAffiliation: true
      hasFunder: true
      hasCitations: 1
    ) {
      totalCount
      published {
        title
        count
      }
    }
    viewed: works(
      hasOrganization: true
      hasAffiliation: true
      hasFunder: true
      hasViews: 1
    ) {
      totalCount
      published {
        title
        count
      }
    }
    downloaded: works(
      hasOrganization: true
      hasAffiliation: true
      hasFunder: true
      hasDownloads: 1
    ) {
      totalCount
      published {
        title
        count
      }
    }
  }
`

const StatsOrganization: React.FunctionComponent = () => {
  const { loading, error, data } = useQuery<WorkQueryData>(STATS_GQL, {
    errorPolicy: 'all'
  })

  if (loading) return <Loading />

  if (error)
    return (
      <Col md={9} mdOffset={3}>
        <Error title="An error occured." message={error.message} />
      </Col>
    )

  const total = data.total.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const associated = data.associated.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const funded = data.funded.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const affiliated = data.affiliated.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const contributed = data.contributed.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const cited = data.cited.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const viewed = data.viewed.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const downloaded = data.downloaded.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  return (
    <>
      <Row>
        <Col md={9} mdOffset={3} id="intro">
          <div className="panel panel-transparent">
            <div className="panel-body">
              <h3 className="member">Organizations</h3>
              <div>
                <p>
                  DataCite Commons includes all{' '}
                  {data.organizations.totalCount.toLocaleString('en-US')}{' '}
                  Research Organization Registry (
                  <a target="_blank" rel="noreferrer" href="https://ror.org">
                    ROR
                  </a>
                  ) identifiers and metadata. This information is retrieved live
                  from the ROR REST API.
                </p>
                <p>
                  {data.associated.totalCount.toLocaleString('en-US')} out of
                  all {data.total.totalCount.toLocaleString('en-US')} (
                  {(
                    (data.associated.totalCount * 100) /
                    data.total.totalCount
                  ).toFixed(2) + '%'}
                  ) works are associated with at least one organization via ROR
                  or Crossref Funder ID identifier. We have three kinds of
                  association:
                </p>
                <ul>
                  <li>
                    <strong>Contributed</strong>: Organization is creator or
                    contributor, associated via nameIdentifier.
                  </li>
                  <li>
                    <strong>Affiliated</strong>: Organization is creator or
                    contributor affiliation, associated via
                    affiliationIdentifier.
                  </li>
                  <li>
                    <strong>Funder</strong>: Organization is funder, associated
                    via funderIdentifier.
                  </li>
                </ul>
                <p>
                  The citations and usage for these associated works are shown
                  below.
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={9} mdOffset={3} id="overview">
          <div className="panel panel-transparent">
            <div className="panel-body">
              <Row>
                {data.organizations.totalCount == 0 && (
                  <Col md={12}>
                    <Alert bsStyle="warning">
                      <p>No Organizations found.</p>
                    </Alert>
                  </Col>
                )}
                {data.total.totalCount > 0 && (
                  <>
                    <Col md={4}>
                      <ProductionChart
                        title={
                          data.total.totalCount.toLocaleString('en-US') +
                          ' Works Total'
                        }
                        data={total}
                      ></ProductionChart>
                    </Col>
                  </>
                )}
                {data.associated.totalCount > 0 && (
                  <>
                    <Col md={4}>
                      <ProductionChart
                        title={
                          data.associated.totalCount.toLocaleString('en-US') +
                          ' Works with Organizations'
                        }
                        data={associated}
                      ></ProductionChart>
                    </Col>
                  </>
                )}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={9} mdOffset={3} id="associations">
          <h3 className="member-results">Associations</h3>
          <div className="panel panel-transparent">
            <div className="panel-body">
              <Row>
                {data.contributed.totalCount +
                  data.affiliated.totalCount +
                  data.funded.totalCount ==
                  0 && (
                  <Col md={12}>
                    <Alert bsStyle="warning">
                      <p>No associations found.</p>
                    </Alert>
                  </Col>
                )}
                {data.contributed.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={
                        data.contributed.totalCount.toLocaleString('en-US') +
                        ' Contributed'
                      }
                      data={contributed}
                    ></ProductionChart>
                  </Col>
                )}
                {data.affiliated.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={
                        data.affiliated.totalCount.toLocaleString('en-US') +
                        ' Affiliated'
                      }
                      data={affiliated}
                    ></ProductionChart>
                  </Col>
                )}
                {data.funded.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={
                        data.funded.totalCount.toLocaleString('en-US') +
                        ' Funded'
                      }
                      data={funded}
                    ></ProductionChart>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={9} mdOffset={3} id="citations">
          <h3 className="member-results">Citations and Usage</h3>
          <div className="panel panel-transparent">
            <div className="panel-body">
              <Row>
                {data.cited.totalCount +
                  data.viewed.totalCount +
                  data.downloaded.totalCount ==
                  0 && (
                  <Col md={12}>
                    <Alert bsStyle="warning">
                      <p>No citations and usage found.</p>
                    </Alert>
                  </Col>
                )}
                {data.cited.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={
                        data.cited.totalCount.toLocaleString('en-US') + ' Cited'
                      }
                      data={cited}
                    ></ProductionChart>
                  </Col>
                )}
                {data.viewed.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={
                        data.viewed.totalCount.toLocaleString('en-US') +
                        ' Viewed'
                      }
                      data={viewed}
                    ></ProductionChart>
                  </Col>
                )}
                {data.downloaded.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={
                        data.downloaded.totalCount.toLocaleString('en-US') +
                        ' Downloaded'
                      }
                      data={downloaded}
                    ></ProductionChart>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default StatsOrganization
