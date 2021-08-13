import React from 'react'
import { VegaLite } from 'react-vega'
import { VisualizationSpec } from 'vega-embed'

import useWindowDimensions from '../../utils/useWindowDimensions'

interface ChartRecord {
  title: string
  count: number
}

type Props = {
  title: string
  data: ChartRecord[]
  color?: string
}

const actions = {
  export: true,
  source: false,
  compiled: false,
  editor: false
}

const VerticalBarChart: React.FunctionComponent<Props> = ({
  title,
  data,
  color
}) => {
  // get current screen size
  const windowDimensions: any = useWindowDimensions()
  const width = windowDimensions.width

  if (typeof color == 'undefined') {
    color = '#1abc9c'
  }

  /* istanbul ignore next */
  // const chartHeight = data.length * 22
  const chartWidth = width >= 1400 ? 11 * 22 : 11 * 18

  // type Expand<VisualizationSpec> = VisualizationSpec extends Record<string, unknown>
  // interface ExtendedVisualizationSpec extends VisualizationSpec {
  //   UserId: string
  // }

  /* istanbul ignore next */
  const spec: VisualizationSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    data: {
      name: 'table'
    },
    padding: { left: 5, top: 5, right: 5, bottom: 5 },
    axes: [
      { orient: "bottom", scale: "xscale", tickCount: 5 },
      { orient: "left", scale: "yscale", tickCount: 5 }
    ],
    mark: {
      type: "bar",
      cursor: "pointer",
      tooltip: true
    },
    selection: {
      highlight: {
        type: "single",
        empty: "none",
        on: "mouseover"
      }
    },
    width: chartWidth,
    encoding: {
      y: {
        field: "title",
        type: "ordinal",
        sort: { encoding: "x" },
        axis: {
          title: "",
          labelLimit: 100,
          labelExpr: 'substring(datum.value, 0,9)'
        }
      },
      x: {
        field: "count",
        type: "quantitative",
        title: "",
        axis: {
          format: ",d",
          tickMinStep: 1
        },
        scale: { type: "linear" }
      },
      color: {
        field: "count",
        scale: { range: [color] },
        type: "nominal",
        legend: null,
        condition: [{ selection: "highlight", value: "#34495e" }]
      }
    },
    config: {
      view: {
        stroke: null
      },
      axis: {
        grid: false,
        title: null,
        labelFlush: false
      }
    }
  }

  // more than ten items would be too much
  const mydata = data.slice(0, 10)

  return (
    <div className="panel panel-transparent">
      <div className="panel-body production-chart">
        <div className="title text-center">
          <h4>{title}</h4>
        </div>
        <VegaLite
          renderer="svg"
          spec={spec}
          data={{ table: mydata }}
          actions={actions}
        />
      </div>
    </div>
  )
}

export default VerticalBarChart
