import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Col, Alert } from 'react-bootstrap'
import clone from 'lodash/clone'

import { pluralize } from '../../utils/helpers'
import Error from '../Error/Error'
import Loading from '../Loading/Loading'
import ProductionChart from '../ProductionChart/ProductionChart'
import { ContentFacet } from '../WorksListing/WorksListing'
import DonutChart, {
  registrationAgencyRange,
  registrationAgencyDomain,
  licenseRange,
  licenseDomain
} from '../DonutChart/DonutChart'

type Props = {
  resource: string
  color?: string
}

export interface Works {
  totalCount: number
  published: ContentFacet[]
  fieldsOfScience?: ContentFacet[]
  licenses?: ContentFacet[]
  registrationAgencies?: ContentFacet[]
}

interface WorkQueryData {
  total: Works
  cited: Works
  viewed: Works
  downloaded: Works
  claimed: Works
  funded: Works
  affiliated: Works
}

interface QueryVar {
  resourceTypeId: string
  resourceType: string
}

export const STATS_GQL = gql`
  query getStatsQuery($resourceTypeId: String, $resourceType: String) {
    total: works(resourceTypeId: $resourceTypeId, resourceType: $resourceType) {
      totalCount
      published {
        title
        count
      }
      fieldsOfScience {
        title
        count
      }
      licenses {
        title
        count
      }
      registrationAgencies {
        title
        count
      }
    }
    cited: works(resourceTypeId: $resourceTypeId, resourceType: $resourceType, hasCitations: 1) {
      totalCount
      published {
        title
        count
      }
    }
    viewed: works(resourceTypeId: $resourceTypeId, resourceType: $resourceType, hasViews: 1) {
      totalCount
      published {
        title
        count
      }
    }
    downloaded: works(resourceTypeId: $resourceTypeId, resourceType: $resourceType, hasDownloads: 1) {
      totalCount
      published {
        title
        count
      }
    }
    claimed: works(resourceTypeId: $resourceTypeId, resourceType: $resourceType, hasPerson: true) {
      totalCount
      published {
        title
        count
      }
    }
    funded: works(resourceTypeId: $resourceTypeId, resourceType: $resourceType, hasFunder: true) {
      totalCount
      published {
        title
        count
      }
    }
    affiliated: works(resourceTypeId: $resourceTypeId, resourceType: $resourceType, hasOrganization: true, hasAffiliation: true) {
      totalCount
      published {
        title
        count
      }
    }
  }
`

const StatsResource: React.FunctionComponent<Props> = ({ resource, color }) => {
  let resourceTypeId = resource
  let resourceType = null

  if (resource === 'Publication') {
    resourceTypeId = 'Text'
  } else if (resource === 'Preprint') {
    resourceTypeId = 'Text'
    resourceType = 'Preprint,PostedContent'
  } else if (resource === 'Dissertation') {
    resourceTypeId = 'Text'
    resourceType = 'Dissertation,Thesis'
  } else if (resource === 'Data Management Plan') {
    resourceTypeId = 'Text'
    resourceType = 'Data Management Plan'
  } else if (resource === 'Sample') {
    resourceTypeId = 'PhysicalObject'
  } else if (resource === 'Instrument') {
    resourceTypeId = 'Other'
    resourceType = 'Instrument'
  }

  const { loading, error, data } = useQuery<WorkQueryData, QueryVar>(
    STATS_GQL,
    {
      errorPolicy: 'all',
      variables: {
        resourceTypeId: resourceTypeId,
        resourceType: resourceType
      }
    }
  )

  if (loading) return <Loading />

  if (error)
    return (
      <Col md={9} mdOffset={3}>
        <Error title="An error occured." message={error.message} />
      </Col>
    )

  const published = data.total.published.map((x) => ({
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

  const claimed = data.claimed.published.map((x) => ({
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

  // const noFieldOfScienceValue: ContentFacet = {
  //   id: 'no-field-of-science',
  //   title: 'No Field of Science',
  //   count:
  //     data.total.totalCount -
  //     data.total.fieldsOfScience.reduce((a, b) => a + (b['count'] || 0), 0)
  // }
  // let fieldsOfScience = clone(data.total.fieldsOfScience)
  // fieldsOfScience.unshift(noFieldOfScienceValue)
  // fieldsOfScience = fieldsOfScience.map((x) => ({
  //   id: x.id,
  //   title: x.title,
  //   count: x.count
  // }))

  const noRegistrationAgencyValue: ContentFacet = {
    id: 'no-registration-agency',
    title: 'No Registration Agency',
    count:
      data.total.totalCount -
      data.total.registrationAgencies.reduce((a, b) => a + (b['count'] || 0), 0)
  }
  let registrationAgencies = clone(data.total.registrationAgencies)
  registrationAgencies.unshift(noRegistrationAgencyValue)
  registrationAgencies = registrationAgencies.map((x) => ({
    id: x.id,
    title: x.title,
    count: x.count
  }))

  const noLicenseValue: ContentFacet = {
    id: 'no-license',
    title: 'No License',
    count:
      data.total.totalCount -
      data.total.licenses.reduce((a, b) => a + (b['count'] || 0), 0)
  }
  let licenses = clone(data.total.licenses)
  licenses.unshift(noLicenseValue)
  licenses = licenses.map((x) => ({
    id: x.id,
    title: x.title,
    count: x.count
  }))

  const datacite = data.total.registrationAgencies.find(
    (element) => element.title === 'DataCite'
  )
  const crossref = data.total.registrationAgencies.find(
    (element) => element.title === 'Crossref'
  )

  return (
    <>
      <Row>
        <Col md={9} mdOffset={3} id="intro">
          <div className="panel panel-transparent">
            <div className="panel-body">
              <h3 className="member">{pluralize(null, resource)}</h3>
              <div>
                DataCite Commons includes{' '}
                {pluralize(data.total.totalCount, resource)}, registered with
                DataCite ({pluralize(datacite ? datacite.count : 0, resource)}),
                Crossref ({pluralize(crossref ? crossref.count : 0, resource)}),
                or with no DOI registration agency information available (
                {pluralize(noRegistrationAgencyValue ? noRegistrationAgencyValue.count : 0, resource)}).
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
                {data.total.totalCount == 0 && (
                  <Col md={12}>
                    <Alert bsStyle="warning">
                      <p>No {pluralize(null, resource).toLowerCase()} found.</p>
                    </Alert>
                  </Col>
                )}
                {data.total.totalCount > 0 && (
                  <>
                    <Col md={4}>
                      <ProductionChart
                        title={'Publication Year'}
                        data={published}
                        color={color}
                      ></ProductionChart>
                    </Col>
                    <Col sm={4}>
                      <DonutChart
                        data={licenses}
                        legend={false}
                        count={data.total.totalCount}
                        title="License"
                        range={licenseRange}
                        domain={licenseDomain}
                      ></DonutChart>
                    </Col>
                    <Col sm={4}>
                      <DonutChart
                        data={registrationAgencies}
                        legend={false}
                        count={data.total.totalCount}
                        title="Registration Agency"
                        range={registrationAgencyRange}
                        domain={registrationAgencyDomain}
                      ></DonutChart>
                    </Col>
                  </>
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
                {data.cited.totalCount + data.viewed.totalCount + data.downloaded.totalCount == 0 && (
                  <Col md={12}>
                    <Alert bsStyle="warning">
                      <p>No citations and usage found.</p>
                    </Alert>
                  </Col>
                )}
                {data.cited.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={data.cited.totalCount.toLocaleString('en-US') + ' Cited'}
                      data={cited}
                      color={color}
                    ></ProductionChart>
                  </Col>
                )}
                {data.viewed.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={data.viewed.totalCount.toLocaleString('en-US') + ' Viewed'}
                      data={viewed}
                      color={color}
                    ></ProductionChart>
                  </Col>
                )}
                {data.downloaded.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={data.downloaded.totalCount.toLocaleString('en-US') + ' Downloaded'}
                      data={downloaded}
                      color={color}
                    ></ProductionChart>
                  </Col>
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
                {data.claimed.totalCount + data.funded.totalCount + data.affiliated.totalCount == 0 && (
                  <Col md={12}>
                    <Alert bsStyle="warning">
                      <p>No connections found.</p>
                    </Alert>
                  </Col>
                )}
                {data.claimed.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={data.claimed.totalCount.toLocaleString('en-US') + ' with People'}
                      data={claimed}
                      color={color}
                    ></ProductionChart>
                  </Col>
                )}
                {data.affiliated.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={data.affiliated.totalCount.toLocaleString('en-US') + ' with Organizations'}
                      data={affiliated}
                      color={color}
                    ></ProductionChart>
                  </Col>
                )}
                {data.funded.totalCount > 0 && (
                  <Col md={4}>
                    <ProductionChart
                      title={data.funded.totalCount.toLocaleString('en-US') + ' With Funders'}
                      data={funded}
                      color={color}
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

export default StatsResource
