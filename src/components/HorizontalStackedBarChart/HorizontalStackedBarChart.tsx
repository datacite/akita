import React from 'react'
import { VegaLite } from 'react-vega'
import { VisualizationSpec } from 'vega-embed'
import { Facet } from '../FacetList/FacetList'
import EmptyChart from '../EmptyChart/EmptyChart'
import HelpIcon from '../HelpIcon/HelpIcon'
import styles from './HorizontalStackedBarChart.module.scss'


type Props = {
  chartTitle: string
  topCategory: { title: string, percent: number }
  // topPercent: number
  // titlePercent: number | string
  // titleText: string | string[]
  data: HorizontalBarRecord[]
  range: string[]
  domain: string[]
  tooltipText?: string
}

export interface HorizontalBarRecord {
  title: string
  count: number
}

export function toBarRecord(data: Facet) {
  return { title: data.title, count: data.count }
}

function getTotalCount(sum: number, data: HorizontalBarRecord) { return sum + data.count }

export function getTopFive(data: HorizontalBarRecord[]) {
  if (data.length === 0) {
    return {
      data: [],
      topCategory: "",
      topPercent: -1
    }
  }

  const otherData = data.filter(d => d.title === "Other")
  let otherCount = otherData.reduce(getTotalCount, 0)

  const missingData = data.filter(d => d.title === "Missing")
  const missingCount = missingData.reduce(getTotalCount, 0)

  data = data.filter(d => d.title !== "Other" && d.title !== "Missing")
  const sorted = data.sort((a, b) => b.count - a.count)

  const topFive = sorted.slice(0, 5)
  const others = sorted.slice(5)
  otherCount += others.reduce(getTotalCount, 0)

  if (otherCount > 0)
    topFive.push({ title: 'Other', count: otherCount })

  if (missingCount > 0)
    topFive.push({ title: 'Missing', count: missingCount })
  

  topFive.sort((a, b) => b.count - a.count)[0]
  
  return {
    data: topFive,
    topCategory: topFive[0].title,
    topPercent: Math.round(topFive[0].count / topFive.reduce(getTotalCount, 0) * 100)
  }
}


const HorizontalBarChart: React.FunctionComponent<Props> = ({
  chartTitle,
  topCategory,
  data,
  range,
  domain,
  tooltipText
}) => {
  if (data.length==0) {
    return <EmptyChart title={`Percent ${Array.isArray(chartTitle) ? chartTitle.join(' ') : chartTitle}`}/>
  }

  if (domain) {
    const indices = data.map(d => domain.findIndex(dom => dom === d.title))
    domain = domain.filter((_, i) => indices.includes(i))
    range = range.filter((_, i) => indices.includes(i))
  }

  const stackedBarChartSpec: VisualizationSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    data: { name: 'rawData' },
    width: 300,
    height: 50,
    mark: {
      type: 'bar',
      tooltip: true,
      height: 50,
      baseline: 'middle'
    },
    transform: [{
      calculate: 'datum.count * 100',
      as: 'percentage'
    }],
    encoding: {
      x: {
        aggregate: 'sum',
        field: 'count',
        stack: 'normalize',
        type: 'quantitative',
        axis: { format: '.0%', domainColor: 'lightgray', tickColor: 'lightgray' },
        title: '',
      },
      color: {
        field: 'title',
        type: 'nominal',
        title: 'Type',
        // legend: false,
        scale: { domain: domain, range: range },
        sort: { field: 'title', order: 'ascending', op: 'count'}
      },
      order: {
        field: 'count',
        aggregate: 'sum',
        sort: 'descending'
      },
    },
    config: {
      legend: {
        orient: 'bottom',
        direction: 'horizontal',
        columns: 4,
      }
    }
  }

  return (
    <div className="panel panel-transparent">
      <div className="panel-body production-chart">
        <div className={styles.chartText}>
          {chartTitle}
          {tooltipText && <HelpIcon text={tooltipText} padding={25} position='inline' color='#34495E' />}
        </div>
        <div className={styles.chartDetail}>
          <span className={styles.chartDetailText}>{topCategory.title}</span>
          <span className={styles.chartDetailText}>{topCategory.percent}%</span>
        </div>
        <VegaLite
          renderer="svg"
          spec={stackedBarChartSpec}
          data={{ rawData: data }}
          actions={false}
          padding={0}
        />
      </div>
    </div>
  )
}

export default HorizontalBarChart
