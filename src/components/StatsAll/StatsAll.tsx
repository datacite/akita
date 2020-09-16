import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Col } from 'react-bootstrap'
import Error from '../Error/Error'
import Loading from '../Loading/Loading'
import ProductionChart from '../ProductionChart/ProductionChart'
import DataSources from '../DataSources/DataSources'
import { ContentFacet } from '../WorksListing/WorksListing'

export interface Source {
  totalCount: number
}

export interface Crossref {
  totalCount: number
  totalCountFromCrossref: number
}

export interface Works {
  totalCount: number
  published: ContentFacet[]
}

interface WorkQueryData {
  datacite: Source
  crossref: Crossref
  people: Source
  organizations: Source
  publications: Works
  datasets: Works
  softwares: Works
}

export const STATS_GQL = gql`
  query getStatsQuery {
    datacite: works(registrationAgency: "datacite") {
      totalCount
    }
    crossref: works(registrationAgency: "crossref") {
      totalCount
      totalCountFromCrossref
    }
    people {
      totalCount
    }
    organizations {
      totalCount
    }
    publications: works(resourceTypeId: "Text") {
      totalCount
      published {
        title
        count
      }
    }
    datasets: works(resourceTypeId: "Dataset") {
      totalCount
      published {
        title
        count
      }
    }
    softwares: works(resourceTypeId: "Software") {
      totalCount
      published {
        title
        count
      }
    }
  }
`

const StatsAll: React.FunctionComponent = () => {
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
            data.softwares.totalCount.toLocaleString('en-US') + '  Software'
          }
          data={publishedSoftware}
          color={'#bebada'}
        ></ProductionChart>
      </Col>
    )
  }

  return (
    <>
      <Row>
        <Col md={9} mdOffset={3} id="intro">
          <div className="panel panel-transparent">
            <div className="panel-body">
              <h3 className="member">General</h3>
              <div>
                <p>
                  This page gives an overview of the information about works,
                  people and organizations made available via DataCite Commons.
                  More detailed information about specific work types, people
                  and organizations can be found via the <strong>Pages</strong>{' '}
                  menu.
                </p>
                <p>
                  Please reach out to{' '}
                  <a href="mailto:support@datacite.org">DataCite Support</a> for
                  questions or comments regarding the data available in DataCite
                  Commons.
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <DataSources
          dataciteCount={data.datacite.totalCount}
          crossrefCount={data.crossref.totalCount}
          crossrefApiCount={data.crossref.totalCountFromCrossref}
          orcidCount={data.people.totalCount}
          rorCount={data.organizations.totalCount}
        />
      </Row>
      <Row>
        <Col md={9} mdOffset={3} id="works">
          <h3 className="member-results">Works</h3>
          <div className="panel panel-transparent">
            <div className="panel-body">
              <div className="intro">
                DataCite Commons currently includes{' '}
                {(
                  data.datacite.totalCount + data.crossref.totalCount
                ).toLocaleString('en-US')}{' '}
                works, with identifiers and metadata provided by DataCite and
                Crossref. For the three major work types publication, dataset
                and software, the respective numbers by publication year are
                shown below.
              </div>
              <Row>
                {renderPublications()}
                {renderDatasets()}
                {renderSoftwares()}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default StatsAll
