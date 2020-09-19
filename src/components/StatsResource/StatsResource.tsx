import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Col, Alert } from 'react-bootstrap'

import { pluralize } from '../../utils/helpers'
import Error from '../Error/Error'
import Loading from '../Loading/Loading'
import ProductionChart from '../ProductionChart/ProductionChart'
import { ContentFacet } from '../WorksListing/WorksListing'

type Props = {
  resource: string
  color?: string
}

export interface Works {
  totalCount: number
  published: ContentFacet[]
  registrationAgencies: ContentFacet[]
}

interface WorkQueryData {
  total: Works
  cited: Works
  viewed: Works
  downloaded: Works
  claimed: Works
  associated: Works
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
      registrationAgencies {
        title
        count
      }
    }
    cited: works(
      resourceTypeId: $resourceTypeId
      resourceType: $resourceType
      hasCitations: 1
    ) {
      totalCount
      published {
        title
        count
      }
    }
    viewed: works(
      resourceTypeId: $resourceTypeId
      resourceType: $resourceType
      hasViews: 1
    ) {
      totalCount
      published {
        title
        count
      }
    }
    downloaded: works(
      resourceTypeId: $resourceTypeId
      resourceType: $resourceType
      hasDownloads: 1
    ) {
      totalCount
      published {
        title
        count
      }
    }
    claimed: works(
      resourceTypeId: $resourceTypeId
      resourceType: $resourceType
      hasPerson: true
    ) {
      totalCount
      published {
        title
        count
      }
    }
    associated: works(
      resourceTypeId: $resourceTypeId
      resourceType: $resourceType
      hasFunder: true
      hasAffiliation: true
      hasOrganization: true
      hasMember: true
    ) {
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

  const associated = data.associated.published.map((x) => ({
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
                <p>
                  DataCite Commons includes{' '}
                  {pluralize(data.total.totalCount, resource)}, registered with
                  DataCite (
                  {((datacite.count * 100) / data.total.totalCount).toFixed(2) +
                    '%'}
                  )
                  {crossref && (
                    <span>
                      {' '}
                      or Crossref (
                      {((crossref.count * 100) / data.total.totalCount).toFixed(
                        2
                      ) + '%'}
                      )
                    </span>
                  )}
                  .
                </p>
                <ul>
                  <li>
                    {(
                      (data.claimed.totalCount * 100) /
                      data.total.totalCount
                    ).toFixed(2) + '%'}{' '}
                    of all {pluralize(null, resource).toLowerCase()} are connected
                    with at least one person via an ORCID ID.
                  </li>
                  <li>
                    {(
                      (data.associated.totalCount * 100) /
                      data.total.totalCount
                    ).toFixed(2) + '%'}{' '}
                    of all {pluralize(null, resource).toLowerCase()} are connected
                    with at least one organization via a ROR ID or Crossref
                    Funder ID.
                  </li>
                  <li>
                    {(
                      (data.cited.totalCount * 100) /
                      data.total.totalCount
                    ).toFixed(2) + '%'}{' '}
                    of all {pluralize(null, resource).toLowerCase()} have been
                    cited.
                  </li>
                  <li>
                    {(
                      (data.viewed.totalCount * 100) /
                      data.total.totalCount
                    ).toFixed(2) + '%'}{' '}
                    of all {pluralize(null, resource).toLowerCase()} have been
                    viewed.
                  </li>
                  <li>
                    {(
                      (data.downloaded.totalCount * 100) /
                      data.total.totalCount
                    ).toFixed(2) + '%'}{' '}
                    of all {pluralize(null, resource).toLowerCase()} have been
                    downloaded.
                  </li>
                </ul>
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
                        title={
                          data.total.totalCount.toLocaleString('en-US') +
                          ' Total'
                        }
                        data={published}
                        color={color}
                      ></ProductionChart>
                    </Col>
                    {data.claimed.totalCount > 0 && (
                      <Col md={4}>
                        <ProductionChart
                          title={
                            data.claimed.totalCount.toLocaleString('en-US') +
                            ' with People'
                          }
                          data={claimed}
                          color={color}
                        ></ProductionChart>
                      </Col>
                    )}
                    {data.associated.totalCount > 0 && (
                      <Col md={4}>
                        <ProductionChart
                          title={
                            data.associated.totalCount.toLocaleString('en-US') +
                            ' with Organizations'
                          }
                          data={associated}
                          color={color}
                        ></ProductionChart>
                      </Col>
                    )}
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
                      color={color}
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
                      color={color}
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
