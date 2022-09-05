import React from 'react'
import { Row, Col, Alert } from 'react-bootstrap'
import clone from 'lodash/clone'

import WorkFacets from '../WorkFacets/WorkFacets'
import WorkMetadata from '../WorkMetadata/WorkMetadata'
import { Works } from '../SearchWork/SearchWork'
import DonutChart, { typesRange, typesDomain, licenseRange, licenseDomain } from '../DonutChart/DonutChart'
// import ChordChart from '../ChordChart/ChordChart'
import ProductionChart from '../ProductionChart/ProductionChart'
import dynamic from 'next/dynamic';

import Pager from '../Pager/Pager'

type Props = {
  works: Works
  showAnalytics: boolean
  showFacets: boolean
  showClaimStatus: boolean
  loading: boolean
  model: string
  url: string
  hasPagination: boolean
  hasNextPage: boolean
  endCursor: string
}

export interface ContentFacet {
  id: string
  title: string
  count: number
}

const ChordChart = dynamic(()=>{return import('../ChordChart/ChordChart')}, {ssr: false});


const WorksListing: React.FunctionComponent<Props> = ({
  works,
  showAnalytics,
  showFacets,
  showClaimStatus,
  loading,
  model,
  url,
  hasPagination,
  hasNextPage,
  endCursor
}) => {

  const hasNoWorks = works.totalCount == 0

  const analyticsBar = () => {
    if (hasNoWorks) return ''

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
      <Row>
        <Col xs={12} sm={4}>
          <ProductionChart
            title='Publication Year'
            data={published}
          ></ProductionChart>
        </Col>
        <Col xs={6} sm={4}>
          <DonutChart
            data={resourceTypes}
            legend={false}
            count={works.totalCount}
            title='Work Type'
            range={typesRange}
            domain={typesDomain}
          ></DonutChart>
          <ChordChart></ChordChart>
        </Col>
        <Col xs={6} sm={4}>
          <DonutChart
            data={licenses}
            legend={false}
            count={works.totalCount}
            title='License'
            range={licenseRange}
            domain={licenseDomain}
          ></DonutChart>
        </Col>
      </Row>
    )
  }

  const renderFacets = () => {
    return (
      <div className="col-md-3 hidden-xs hidden-sm">
        <WorkFacets
          model={model}
          url={url}
          data={works}
          loading={loading}
        ></WorkFacets>
      </div>
    )
  }

  const renderNoWorks = () => {
    return (
      <Col md={9}>
        <div className="alert-works">
          <Alert bsStyle="warning">No works found.</Alert>
        </div>
      </Col>
    )
  }

  const renderWorks = () => {
    return (
      <Col md={9} id="content">
        {showAnalytics && analyticsBar()}

        {works.nodes.map((doi) => (
          <React.Fragment key={doi.doi}>
            <WorkMetadata metadata={doi} linkToExternal={false} showClaimStatus={showClaimStatus}></WorkMetadata>
          </React.Fragment>
        ))}

        {hasPagination && (
          <Pager
            url={url}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
          ></Pager>
        )}
      </Col>
    )
  }

  return (
    <>
      {showFacets && renderFacets()}

      {hasNoWorks ? renderNoWorks() : renderWorks()}
    </>
  )
}

export default WorksListing
