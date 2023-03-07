import React from 'react'
import { Row, Col } from 'react-bootstrap'
import clone from 'lodash/clone'

import HorizontalStackedBarChart, { HorizontalBarRecord } from '../HorizontalStackedBarChart/HorizontalStackedBarChart'
import { Facet } from '../FacetList/FacetList'
import { Works } from '../SearchWork/SearchWork'
import ProductionChart from '../ProductionChart/ProductionChart'

type Props = {
  works: Works
}

export interface ContentFacet {
  id: string
  title: string
  count: number
}

function toBarRecord(data: Facet) {
  return { title: data.title, count: data.count }
}

function getTotalCount(sum: number, data: HorizontalBarRecord) { return sum + data.count }

function getTopFive(data: HorizontalBarRecord[]) {
  console.log(data)
  const sorted = data.sort((a, b) => b.count - a.count)

  const topFive = sorted.slice(0, 5)
  const other = sorted.slice(5)

  if (other.length > 0) {
    const otherCount = other.reduce(getTotalCount, 0)
    topFive.push({ title: 'Other', count: otherCount})
  }

  return {
    data: topFive,
    topCategory: topFive[0].title,
    topPercent: Math.round(topFive[0].count / topFive.reduce(getTotalCount, 0) * 100)
  }
}

const OrganizationDashboard: React.FunctionComponent<Props> = ({ works }) => {
  if (works.totalCount == 0) return null

  const published = works.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const resourceTypes = getTopFive(works.resourceTypes.map(toBarRecord))
  

  const noLicenseValue: ContentFacet = {
    id: 'no-license',
    title: 'no license',
    count:
      works.totalCount -
      works.licenses.reduce((a, b) => a + (b['count'] || 0), 0)
  }
  const licensesData = clone(works.licenses)
  licensesData.unshift(noLicenseValue)
  const licenses = getTopFive(licensesData.map(toBarRecord))

  return (
    <>
      <Row>
        <Col xs={12} sm={4}>
          <ProductionChart
            title='Publication Year'
            data={published} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={4}>
          <HorizontalStackedBarChart
            titlePercent={resourceTypes.topPercent}
            titleText={`of scholarly outputs are ${resourceTypes.topCategory}`}
            data={resourceTypes.data} />
        </Col>
        <Col xs={12} sm={4}>
          <HorizontalStackedBarChart 
            titlePercent={licenses.topPercent}
            titleText={`of scholarly outputs use ${licenses.topCategory}`}
            data={licenses.data} />
        </Col>
      </Row>
    </>
  )
}

export default OrganizationDashboard
