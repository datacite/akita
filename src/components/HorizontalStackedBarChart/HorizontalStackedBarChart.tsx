import React from 'react'
import { VegaLite } from 'react-vega'
import { VisualizationSpec } from 'vega-embed'
import { Facet } from '../FacetList/FacetList'
import EmptyChart from '../EmptyChart/EmptyChart'
import HelpIcon from '../HelpIcon/HelpIcon'


type Props = {
  titlePercent: number
  titleText: string | string[]
  data: HorizontalBarRecord[]
  range: string[]
  domain: string[]
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
  titlePercent,
  titleText,
  data,
  range,
  domain
}) => {
  if (data.length==0) {
    return <EmptyChart title={Array.isArray(titleText) ? titleText.join(' ') : titleText}/>
  }

  if (domain) {
    const indices = data.map(d => domain.findIndex(dom => dom === d.title))
    domain = domain.filter((_, i) => indices.includes(i))
    range = range.filter((_, i) => indices.includes(i))
  }

  const stackedBarChartSpec: VisualizationSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    data: { name: 'rawData' },
    title: {
      text: titlePercent + '%',
      subtitle: titleText,
      align: 'left',
      anchor: 'start',
      font: 'Source Sans Pro',
      fontSize: 34,
      fontWeight: 'normal',
      color: '#1abc9c',
      subtitleFont: 'Source Sans Pro',
      subtitleFontSize: 21,
      subtitleColor: '#1abc9c'
    },
    width: 300,
    height: 5,
    mark: {
      type: "bar",
      tooltip: true,
      height: 50,
      baseline: 'bottom'
    },
    transform: [{
      calculate: "datum.count * 100",
      as: "percentage"
    }],
    encoding: {
      x: {
        aggregate: "sum",
        field: "count",
        stack: "normalize",
        type: "quantitative",
        axis: { format: ".0%", domainColor: 'lightgray', tickColor: 'lightgray' },
        title: ''
      },
      color: {
        field: 'title',
        type: 'nominal',
        title: 'Type',
        // legend: false,
        scale: { range: range, domain: domain }
      },
      order: {
        "aggregate": "sum",
        "sort": "descending",
        "field": "count"
      },
    },
    config: { legend: { orient: 'bottom' } }
  }

  return (
    <div className="panel panel-transparent">
      <div className="panel-body production-chart">
        <VegaLite
          renderer="svg"
          spec={stackedBarChartSpec}
          data={{ rawData: data }}
          actions={false}
        />
      </div>
      <HelpIcon text='The field {"{field}"} from DOI metadata was used to generate this chart.' />
    </div>
  )
}

export default HorizontalBarChart
