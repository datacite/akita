import * as React from 'react'
import { Row, Col, Alert } from 'react-bootstrap'
import clone from 'lodash/clone'

import WorkFacets from '../WorkFacets/WorkFacets'
import WorkMetadata from '../WorkMetadata/WorkMetadata'
import { Works } from '../SearchWork/SearchWork'
import DonutChart, { typesRange, typesDomain, licenseRange, licenseDomain } from '../DonutChart/DonutChart'
import ProductionChart from '../ProductionChart/ProductionChart'

import Pager from '../Pager/Pager'

type Props = {
  works: Works
  showAnalytics: boolean
  showFacets: boolean
  loading: boolean
  url: string
  hasPagination: boolean
  hasNextPage: boolean
  endCursor: string
}

//TODO: Remove duplication
interface ContentFacet {
  id: string
  title: string
  count: number
}

const WorksListing: React.FunctionComponent<Props> = ({
  works,
  showAnalytics,
  showFacets,
  loading,
  url,
  hasPagination,
  hasNextPage,
  endCursor
}) => {
  if (works.totalCount == 0)
    return (
      <div className="alert-works">
        <Alert bsStyle="warning">No works found.</Alert>
      </div>
    )

  const analyticsBar = () => {
    if (!works.totalCount) return null

    const published = works.published.map((x) => ({
      title: x.title,
      count: x.count
    }))
    const resourceTypes = works.resourceTypes.map((x) => ({
      title: x.title,
      count: x.count
    }))

    const noLicenseValue: ContentFacet = {
      id: 'no-license',
      title: 'No License',
      count:
        works.totalCount -
        works.licenses.reduce((a, b) => a + (b['count'] || 0), 0)
    }
    let licenses = clone(works.licenses)
    licenses.unshift(noLicenseValue)
    licenses = licenses.map((x) => ({
      id: x.id,
      title: x.title,
      count: x.count
    }))

    return (
      <React.Fragment>
        <Row>
          <Col sm={6}>
            <ProductionChart
              data={published}
              doiCount={works.totalCount}
            ></ProductionChart>
          </Col>
          <Col sm={3}>
            <DonutChart
              data={resourceTypes}
              legend={false}
              count={works.totalCount}
              title='Works by work type'
              range={typesRange}
              domain={typesDomain}
            ></DonutChart>
          </Col>
            <Col sm={3}>
              <DonutChart
              data={licenses}
              legend={false}
              count={works.totalCount}
              title='Works by license'
              range={licenseRange}
              domain={licenseDomain}
            ></DonutChart>
          </Col>
        </Row>
      </React.Fragment>
    )
  }

  const renderFacets = () => {
    return (
      <div className="col-md-3 hidden-xs hidden-sm">
        <WorkFacets
          model="organization"
          data={works}
          loading={loading}
        ></WorkFacets>
      </div>
    )
  }

  return (
    <div>
      {showFacets && renderFacets()}

      <div className="col-md-9" id="content">
        {showAnalytics && analyticsBar()}

        {works.nodes.map((doi) => (
          <React.Fragment key={doi.doi}>
            <WorkMetadata metadata={doi} linkToExternal={false}></WorkMetadata>
          </React.Fragment>
        ))}

        {hasPagination && (
          <Pager
            url={url}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
          ></Pager>
        )}
      </div>
    </div>
  )
}

export default WorksListing
