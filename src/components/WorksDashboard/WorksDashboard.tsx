import React from 'react'
import { Row, Col } from 'react-bootstrap'
import clone from 'lodash/clone'
import { Works } from '../SearchWork/SearchWork'
import ProductionChart from '../ProductionChart/ProductionChart'
import HorizontalStackedBarChart, { getTopFive, toBarRecord } from '../HorizontalStackedBarChart/HorizontalStackedBarChart'
import { resourceTypeDomain, resourceTypeRange, licenseRange, otherDomain, otherRange } from '../../data/color_palettes'
import styles from './WorksDashboard.module.scss'

type Props = {
  works: Works
}

const tooltipText = (sourceField: string) => `The field "${sourceField}" from DOI metadata was used to generate this chart.`

const WorksDashboard: React.FunctionComponent<Props> = ({ works, children }) => {
  if (works.totalCount == 0) return null

  const published = works.published.map((x) => ({
    title: x.title,
    count: x.count
  }))

  const resourceTypes = getTopFive(works.resourceTypes.map(toBarRecord))
  const licensesData = clone(works.licenses)
  const licenses = getTopFive(licensesData.map(toBarRecord))

  return (
    <div className={styles.graphsContainer}>
      <Row>
        {children && 
          <Col xs={12} sm={8}>
            {children}
          </Col>
        }
        <Col xs={12} sm={4}>
          <ProductionChart
            title='Publication Year'
            data={published} />
        </Col>
        <Col xs={12} sm={4}>
          <HorizontalStackedBarChart
            chartTitle={'Work Types'}
            topCategory={{ title: resourceTypes.topCategory, percent: resourceTypes.topPercent}}
            data={resourceTypes.data}
            domain={resourceTypeDomain}
            range={resourceTypeRange}
            tooltipText={tooltipText('resourceType')} />
        </Col>
        <Col xs={12} sm={4}>
          <HorizontalStackedBarChart 
            chartTitle='Licenses'
            topCategory={{ title: licenses.topCategory, percent: licenses.topPercent}}
            data={licenses.data}
            domain={[...otherDomain, ...licenses.data.map(l => l.title)]}
            range={[...otherRange, ...licenseRange]}
            tooltipText={'The field "rights" from DOI metadata was used to generate this chart, showing the % of licenses used across works.'} />
        </Col>
      </Row>
    </div>
  )
}

export default WorksDashboard
