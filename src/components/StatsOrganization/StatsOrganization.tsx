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
  registrationAgencies?: ContentFacet[]
}

interface WorkQueryData {
  organizations: Source
  total: Works
  connected: Works
  cited: Works
  viewed: Works
  downloaded: Works
  funded: Works
  contributed: Works
  affiliated: Works
  hosted: Works
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
      registrationAgencies {
        title
        count
      }
    }
    connected: works(
      hasOrganization: true
      hasAffiliation: true
      hasFunder: true
      hasMember: true
    ) {
      totalCount
      published {
        title
        count
      }
      registrationAgencies {
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
      registrationAgencies {
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
      registrationAgencies {
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
      registrationAgencies {
        title
        count
      }
    }
    hosted: works(hasMember: true) {
      totalCount
      published {
        title
        count
      }
      registrationAgencies {
        title
        count
      }
    }
    cited: works(
      hasOrganization: true
      hasAffiliation: true
      hasFunder: true
      hasMember: true
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
      hasMember: true
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
      hasMember: true
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

  const connected = data.connected.published.map((x) => ({
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

  const hosted = data.hosted.published.map((x) => ({
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

  const datacite = data.total.registrationAgencies.find(
    (element) => element.title === 'DataCite'
  )
  const crossref = data.total.registrationAgencies.find(
    (element) => element.title === 'Crossref'
  )

  const dataciteConnected = data.connected.registrationAgencies.find(
    (element) => element.title === 'DataCite'
  )
  const crossrefConnected = data.connected.registrationAgencies.find(
    (element) => element.title === 'Crossref'
  )

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
                  {data.connected.totalCount.toLocaleString('en-US')} out of all{' '}
                  {data.total.totalCount.toLocaleString('en-US')} (
                  {(
                    (data.connected.totalCount * 100) /
                    data.total.totalCount
                  ).toFixed(2) + '%'}
                  ) works are connected with at least one organization via ROR
                  ID or Crossref Funder ID, including{' '}
                  {((dataciteConnected.count * 100) / datacite.count).toFixed(
                    2
                  ) + '%'}{' '}
                  of works registered with DataCite, and{' '}
                  {((crossrefConnected.count * 100) / crossref.count).toFixed(
                    2
                  ) + '%'}{' '}
                  of works registered with Crossref.
                </p>
                <p>
                  We have four kinds of connections:
                </p>
                <ul>
                  <li>
                    <strong>Hosted</strong>: Organization is hosting
                    institution, connected via repository identifier.
                  </li>
                  <li>
                    <strong>Contributed</strong>: Organization is creator or
                    contributor, connected via nameIdentifier.
                  </li>
                  <li>
                    <strong>Affiliated</strong>: Organization is creator or
                    contributor affiliation, connected via
                    affiliationIdentifier.
                  </li>
                  <li>
                    <strong>Funded</strong>: Organization is funder, connected
                    via funderIdentifier.
                  </li>
                </ul>
                <p>
                  The citations and usage for the connected works are shown
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
                          ' Total'
                        }
                        data={total}
                      ></ProductionChart>
                    </Col>
                  </>
                )}
                {data.connected.totalCount > 0 && (
                  <>
                    <Col md={4}>
                      <ProductionChart
                        title={
                          data.connected.totalCount.toLocaleString('en-US') +
                          ' with Organizations'
                        }
                        data={connected}
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
        <Col md={9} mdOffset={3} id="connections">
          <h3 className="member-results">Connections</h3>
          <div className="panel panel-transparent">
            <div className="panel-body">
              <Row>
                {data.hosted.totalCount +
                  data.contributed.totalCount +
                  data.affiliated.totalCount ==
                  0 && (
                  <Col md={12}>
                    <Alert bsStyle="warning">
                      <p>No connections found.</p>
                    </Alert>
                  </Col>
                )}
                {data.hosted.totalCount > 0 && (
                  <>
                    <Col md={4}>
                      <ProductionChart
                        title={
                          data.hosted.totalCount.toLocaleString('en-US') +
                          ' Hosted'
                        }
                        data={hosted}
                      ></ProductionChart>
                    </Col>
                  </>
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
              </Row>
              <Row>
                {data.funded.totalCount == 0 && (
                  <Col md={12}>
                    <Alert bsStyle="warning">
                      <p>No connections found.</p>
                    </Alert>
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
