'use client'

import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Loading from 'src/components/Loading/Loading'

import { useStatisticsQuery } from 'src/data/queries/statisticsQuery'

import Error from 'src/components/Error/Error'
import ProductionChart from 'src/components/ProductionChart/ProductionChart';
import DataSources from 'src/components/DataSources/DataSources';
import Link from 'next/link';

interface Props {
  isBot?: boolean
}

export default function RelatedContent(props: Props) {
  const { isBot = false } = props

  const { loading, data, error } = useStatisticsQuery()

  if (isBot) return null
  if (loading) return <Row><Loading /></Row>

  if (error)
    return <Row>
      <Col md={{ offset: 3 }} className="panel panel-transparent">
        <Error title="An error occured loading statistics." message={error.message} />
      </Col>
    </Row>

  if (!data) return

  const datacite = data.total.registrationAgencies.find(
    (element) => element.title === 'DataCite'
  )
  const crossref = data.total.registrationAgencies.find(
    (element) => element.title === 'Crossref'
  )

  const dataciteCited = data.cited.registrationAgencies.find(
    (element) => element.title === 'DataCite'
  )
  const crossrefCited = data.cited.registrationAgencies.find(
    (element) => element.title === 'Crossref'
  )

  const dataciteClaimed = data.claimed.registrationAgencies.find(
    (element) => element.title === 'DataCite'
  )

  const crossrefClaimed = data.claimed.registrationAgencies.find(
    (element) => element.title === 'Crossref'
  )

  const dataciteConnected = data.connected.registrationAgencies.find(
    (element) => element.title === 'DataCite'
  )
  const crossrefConnected = data.connected.registrationAgencies.find(
    (element) => element.title === 'Crossref'
  )

  const people = data.people.years.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const organizations = data.organizations.years.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const renderPublications = () => {
    const publishedPublication = data.publications.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={
            data.publications.totalCount.toLocaleString('en-US') +
            ' Publications'
          }
          data={publishedPublication}
          color={'#80b1d3'}
        ></ProductionChart>
      </Col>
    )
  }

  const renderDatasets = () => {
    const publishedDataset = data.datasets.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={data.datasets.totalCount.toLocaleString('en-US') + ' Datasets'}
          data={publishedDataset}
          color={'#fb8072'}
        ></ProductionChart>
      </Col>
    )
  }

  const renderSoftwares = () => {
    const publishedSoftware = data.softwares.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={
            data.softwares.totalCount.toLocaleString('en-US') + ' Software'
          }
          data={publishedSoftware}
          color={'#bebada'}
        ></ProductionChart>
      </Col>
    )
  }

  const renderCitedPublications = () => {
    const citedPublication = data.citedPublications.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={
            data.citedPublications.totalCount.toLocaleString('en-US') +
            ' (' +
            (
              (data.citedPublications.totalCount * 100) /
              data.publications.totalCount
            ).toFixed(2) +
            '%) Cited Publications'
          }
          data={citedPublication}
          color={'#80b1d3'}
        ></ProductionChart>
      </Col>
    )
  }

  const renderCitedDatasets = () => {
    const citedDataset = data.citedDatasets.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={
            data.citedDatasets.totalCount.toLocaleString('en-US') +
            ' (' +
            (
              (data.citedDatasets.totalCount * 100) /
              data.datasets.totalCount
            ).toFixed(2) +
            '%) Cited Datasets'
          }
          data={citedDataset}
          color={'#fb8072'}
        ></ProductionChart>
      </Col>
    )
  }

  const renderCitedSoftwares = () => {
    const citedSoftware = data.citedSoftwares.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={
            data.citedSoftwares.totalCount.toLocaleString('en-US') +
            ' (' +
            (
              (data.citedSoftwares.totalCount * 100) /
              data.softwares.totalCount
            ).toFixed(2) +
            '%) Cited Software'
          }
          data={citedSoftware}
          color={'#bebada'}
        ></ProductionChart>
      </Col>
    )
  }

  const renderClaimedPublications = () => {
    const claimedPublication = data.claimedPublications.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={
            data.claimedPublications.totalCount.toLocaleString('en-US') +
            ' (' +
            (
              (data.claimedPublications.totalCount * 100) /
              data.publications.totalCount
            ).toFixed(2) +
            '%) Claimed Publications'
          }
          data={claimedPublication}
          color={'#80b1d3'}
        ></ProductionChart>
      </Col>
    )
  }

  const renderClaimedDatasets = () => {
    const claimedDataset = data.claimedDatasets.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={
            data.claimedDatasets.totalCount.toLocaleString('en-US') +
            ' (' +
            (
              (data.claimedDatasets.totalCount * 100) /
              data.datasets.totalCount
            ).toFixed(2) +
            '%) Claimed Datasets'
          }
          data={claimedDataset}
          color={'#fb8072'}
        ></ProductionChart>
      </Col>
    )
  }

  const renderClaimedSoftwares = () => {
    const claimedSoftware = data.claimedSoftwares.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={
            data.claimedSoftwares.totalCount.toLocaleString('en-US') +
            ' (' +
            (
              (data.claimedSoftwares.totalCount * 100) /
              data.softwares.totalCount
            ).toFixed(2) +
            '%) Claimed Software'
          }
          data={claimedSoftware}
          color={'#bebada'}
        ></ProductionChart>
      </Col>
    )
  }

  const renderConnectedPublications = () => {
    const connectedPublication = data.connectedPublications.published.map(
      (x) => ({
        title: x.title,
        count: x.count
      })
    )

    return (
      <Col md={4}>
        <ProductionChart
          title={
            data.connectedPublications.totalCount.toLocaleString('en-US') +
            ' (' +
            (
              (data.connectedPublications.totalCount * 100) /
              data.publications.totalCount
            ).toFixed(2) +
            '%) Connected Publications'
          }
          data={connectedPublication}
          color={'#80b1d3'}
        ></ProductionChart>
      </Col>
    )
  }

  const renderConnectedDatasets = () => {
    const connectedDataset = data.connectedDatasets.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={
            data.connectedDatasets.totalCount.toLocaleString('en-US') +
            ' (' +
            (
              (data.connectedDatasets.totalCount * 100) /
              data.datasets.totalCount
            ).toFixed(2) +
            '%) Connected Datasets'
          }
          data={connectedDataset}
          color={'#fb8072'}
        ></ProductionChart>
      </Col>
    )
  }

  const renderConnectedSoftwares = () => {
    const connectedSoftware = data.connectedSoftwares.published.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <Col md={4}>
        <ProductionChart
          title={
            data.connectedSoftwares.totalCount.toLocaleString('en-US') +
            ' (' +
            (
              (data.connectedSoftwares.totalCount * 100) /
              data.softwares.totalCount
            ).toFixed(2) +
            '%) Connected Software'
          }
          data={connectedSoftware}
          color={'#bebada'}
        ></ProductionChart>
      </Col>
    )
  }

  //const lastUpdatedDate = new Date().toString()
  const lastUpdatedDate = () => {
    return new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Container fluid>
      <Row>
        <Col md={{ span: 9, offset: 3 }}> <h3 className="member">Statistics</h3>
          <div>
            <p>
              This page gives an overview of the information about works,
              people and organizations made available via DataCite Commons.

              <br />
              The is not a live dashboard, but updated on a regular basis.

              Please reach out to{' '}
              <a href="mailto:support@datacite.org">DataCite Support</a> for
              questions or comments.
            </p>
          </div>
        </Col>
      </Row>
      <Row>
        <DataSources
          dataciteCount={datacite.count}
          crossrefCount={crossref.count}
          crossrefApiCount={data.total.totalCountFromCrossref}
          orcidCount={data.people.totalCount}
          rorCount={data.organizations.totalCount}
          lastUpdatedDate={lastUpdatedDate()}
        />
      </Row>
      <Row>
        <Col md={{ span: 9, offset: 3 }}>
          <h3 className="member-results">Works</h3>
          <div className="panel panel-transparent">
            <div className="panel-body">
              <div className="intro">
                DataCite Commons currently includes{' '}
                {(datacite.count + crossref.count).toLocaleString('en-US')}{' '}
                works, with identifiers and metadata provided by DataCite and
                Crossref. For the three major work types{' '}
                <Link href="/publications">
                  publication
                </Link>
                ,{' '}
                <Link href="/datasets">
                  dataset
                </Link>{' '}
                and{' '}
                <Link href="/software">
                  software
                </Link>
                , the respective numbers by publication year are shown below.
              </div>
              <Row>
                {renderPublications()}
                {renderDatasets()}
                {renderSoftwares()}
              </Row>
              <Row>
                <Col md={12}>
                  <div className="panel panel-transparent">
                    <div className="panel-body">
                      <p>
                        {data.cited.totalCount.toLocaleString('en-US')} out of
                        all {data.total.totalCount.toLocaleString('en-US')} (
                        {(
                          (data.cited.totalCount * 100) /
                          data.total.totalCount
                        ).toFixed(2) + '%'}
                        ) works have been cited at least once, including{' '}
                        {((dataciteCited.count * 100) / datacite.count).toFixed(
                          2
                        ) + '%'}{' '}
                        of works registered with DataCite, and{' '}
                        {((crossrefCited.count * 100) / crossref.count).toFixed(
                          2
                        ) + '%'}{' '}
                        of works registered with Crossref.
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                {renderCitedPublications()}
                {renderCitedDatasets()}
                {renderCitedSoftwares()}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 9, offset: 3 }}>
          <h3 className="member-results">People</h3>
          <div className="panel panel-transparent">
            <div className="panel-body">
              <div className="intro">
                <p>
                  DataCite Commons includes all{' '}
                  {data.people.totalCount.toLocaleString('en-US')}{' '}
                  <a target="_blank" rel="noreferrer" href="https://orcid.org">
                    ORCID
                  </a>{' '}
                  identifiers, and personal and employment metadata. This
                  information is retrieved live from the ORCID REST API, the
                  respective numbers by registration year are shown below.
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 9, offset: 3 }}>
          <div className="panel panel-transparent">
            <div className="panel-body">
              <Row>
                {data.people.totalCount == 0 && (
                  <Col md={12}>
                    <Alert variant="warning">
                      <p>No People found.</p>
                    </Alert>
                  </Col>
                )}
                {data.people.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={
                        data.people.totalCount.toLocaleString('en-US') +
                        ' People'
                      }
                      data={people}
                      lowerBoundYear={2012}
                      color={'#8dd3c7'}
                    ></ProductionChart>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 9, offset: 3 }}>
          <div className="panel panel-transparent">
            <div className="panel-body">
              <div className="intro">
                <p>
                  {data.claimed.totalCount.toLocaleString('en-US')} out of all{' '}
                  {data.total.totalCount.toLocaleString('en-US')} (
                  {(
                    (data.claimed.totalCount * 100) /
                    data.total.totalCount
                  ).toFixed(2) + '%'}
                  ) works have been claimed (connected) to at least one ORCID
                  record, including{' '}
                  {((dataciteClaimed.count * 100) / datacite.count).toFixed(2) +
                    '%'}{' '}
                  of works registered with DataCite, and{' '}
                  {((crossrefClaimed.count * 100) / crossref.count).toFixed(2) +
                    '%'}{' '}
                  of works registered with Crossref.
                </p>
              </div>
              <Row>
                {renderClaimedPublications()}
                {renderClaimedDatasets()}
                {renderClaimedSoftwares()}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 9, offset: 3 }}>
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
                  from the ROR REST API, the respective numbers by registration
                  year are shown below.
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 9, offset: 3 }}>
          <div className="panel panel-transparent">
            <div className="panel-body">
              <Row>
                {data.organizations.totalCount == 0 && (
                  <Col md={12}>
                    <Alert variant="warning">
                      <p>No Organizations found.</p>
                    </Alert>
                  </Col>
                )}
                {data.organizations.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={
                        data.organizations.totalCount.toLocaleString('en-US') +
                        ' Organizations'
                      }
                      data={organizations}
                      lowerBoundYear={2017}
                      color={'#c2e9ba'}
                    ></ProductionChart>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 9, offset: 3 }}>
          <div className="panel panel-transparent">
            <div className="panel-body">
              <div className="intro">
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
              </div>
              <Row>
                {renderConnectedPublications()}
                {renderConnectedDatasets()}
                {renderConnectedSoftwares()}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
