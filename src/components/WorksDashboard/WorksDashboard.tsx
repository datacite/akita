import React from 'react'
import { Row, Col } from 'react-bootstrap'
import clone from 'lodash/clone'
import { Works } from '../SearchWork/SearchWork'
import { typesDomain, typesRange, licenseDomain, licenseRange } from '../DonutChart/DonutChart'
import ProductionChart from '../ProductionChart/ProductionChart'
import HorizontalStackedBarChart, { getTopFive, toBarRecord } from '../HorizontalStackedBarChart/HorizontalStackedBarChart'

type Props = {
  works: Works
}

const WorksDashboard: React.FunctionComponent<Props> = ({ works, children }) => {
  if (works.totalCount == 0) return null
  // const hasNoWorks = works.totalCount == 0

  const published = works.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const resourceTypes = getTopFive(works.resourceTypes.map(toBarRecord))
  const licensesData = clone(works.licenses)
  const licenses = getTopFive(licensesData.map(toBarRecord))

  return (
    <>
      <Row>
        <Col xs={12} sm={8}>
          {children}
        </Col>
        <Col xs={12} sm={4}>
          <ProductionChart
            title='Publication Year'
            data={published} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={4}>
          <HorizontalStackedBarChart
            titlePercent={-1}
            titleText={[`of scholarly outputs use`, `a persistent identifier (i.e. DOI)`]}
            data={[{title: 'PLACEHOLDER', count: 0}]}
            domain={[]}
            range={[]} />
        </Col>
        <Col xs={12} sm={4}>
          <HorizontalStackedBarChart
            titlePercent={resourceTypes.topPercent}
            titleText={`of scholarly outputs are ${resourceTypes.topCategory}`}
            data={resourceTypes.data}
            domain={typesDomain}
            range={typesRange} />
        </Col>
        <Col xs={12} sm={4}>
          <HorizontalStackedBarChart 
            titlePercent={licenses.topPercent}
            titleText={`of scholarly outputs use ${licenses.topCategory}`}
            data={licenses.data}
            domain={licenseDomain}
            range={licenseRange} />
        </Col>
      </Row>
    </>
  )
}

export default WorksDashboard
