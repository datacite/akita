'use client'

import React, { PropsWithChildren } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import clone from 'lodash/clone'
import { Works } from 'src/data/types'
import ProductionChart from '../ProductionChart/ProductionChart'
import HorizontalStackedBarChart from '../HorizontalStackedBarChart/HorizontalStackedBarChart'
import { resourceTypeDomain, resourceTypeRange, licenseRange, otherDomain, otherRange } from '../../data/color_palettes'
import styles from './WorksDashboard.module.scss'
import { getTopFive, toBarRecord } from 'src/utils/helpers'
import VerticalBarChart from '../VerticalBarChart/VerticalBarChart'

export type ShowCharts = {
  publicationYear?: boolean
  resourceTypes?: boolean
  licenses?: boolean
  creatorsAndContributors?: boolean
  fieldsOfScience?: boolean
  languages?: boolean
  all?: boolean
}

type Props = PropsWithChildren<{
  works: Works
  show?: ShowCharts
}>

const tooltipText = (sourceField: string) => `The field "${sourceField}" from DOI metadata was used to generate this chart.`

function WorksDashboard({ works, show = {}, children }: Props) {
  if (works.totalCount == 0) return null

  const published = works.published?.map((x) => ({
    title: x.title,
    count: x.count
  })) || []

  const resourceTypes = getTopFive(works.resourceTypes?.map(toBarRecord) || [])
  const licensesData = clone(works.licenses || [])
  const licenses = getTopFive(licensesData.map(toBarRecord))

  return (
    <div className={styles.graphsContainer}>
      {children &&
        <Row>
          {children}
        </Row>
      }
      <Row>
        {(show.publicationYear || show.all) && <Col xs={12} sm={4}>
          <ProductionChart
            title='Publication Year'
            data={published} />
        </Col>}
        {(show.resourceTypes || show.all) && <Col xs={12} sm={4}>
          <HorizontalStackedBarChart
            chartTitle={'Work Types'}
            topCategory={{ title: resourceTypes.topCategory, percent: resourceTypes.topPercent }}
            data={resourceTypes.data}
            domain={resourceTypeDomain}
            range={resourceTypeRange}
            tooltipText={tooltipText('resourceType')} />
        </Col>}
        {(show.licenses || show.all) && <Col xs={12} sm={4}>
          <HorizontalStackedBarChart
            chartTitle='Licenses'
            topCategory={{ title: licenses.topCategory, percent: licenses.topPercent }}
            data={licenses.data}
            domain={[...otherDomain, ...licenses.data.map(l => l.title)]}
            range={[...otherRange, ...licenseRange]}
            tooltipText={'The field "rights" from DOI metadata was used to generate this chart, showing the % of licenses used across works.'} />
        </Col>}
        {(show.creatorsAndContributors || show.all) && <Col xs={12} sm={4}>
          <VerticalBarChart title="Top Creators and Contributors" data={works.creatorsAndContributors || []} />
        </Col>}
        {(show.fieldsOfScience || show.all) && <Col xs={12} sm={4}>
          <VerticalBarChart title="Fields of Science" data={works.fieldsOfScience || []} />
        </Col>}
        {(show.languages || show.all) && <Col xs={12} sm={4}>
          <VerticalBarChart title="Work Languages" data={works.languages || []} />
        </Col>}
      </Row>
    </div>
  )
}

export default WorksDashboard
