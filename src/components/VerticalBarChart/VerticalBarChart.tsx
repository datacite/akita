'use client'

import React from 'react'
import { VegaLite } from 'react-vega'
import { VisualizationSpec } from 'vega-embed'

import useWindowDimensions from 'src/utils/useWindowDimensions'
import EmptyChart from 'src/components/EmptyChart/EmptyChart'

interface ChartRecord {
  title: string
  count: number
  color?: string
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

export default function VerticalBarChart({ title, data, color }: Props) {
  if (data.length == 0) {
    return <EmptyChart title={title} />
  }
  // get current screen size
  const windowDimensions: any = useWindowDimensions()
  const width = windowDimensions.width

  if (typeof color == 'undefined') {
    color = '#1abc9c'
  }

  /* istanbul ignore next */
  const chartWidth = width >= 1400 ? 11 * 22 : 11 * 18

  /* istanbul ignore next */
  const spec: VisualizationSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
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
    params: [
      {
        name: "highlight",
        select: { type: "point", on: "pointerover" }
      },
      { name: "select", select: "point" }
    ],
    // params: {
    //   name: "highlight",
    //
    //   highlight: {
    //     type: "single",
    //     empty: "none",
    //     on: "mouseover"
    //   }
    // },
    width: chartWidth,
    height: 200,
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
        scale: { type: "sqrt" }
      },
      color: {
        field: "count",
        scale: { range: [color] },
        type: "nominal",
        legend: null,
        condition: [{ param: "highlight", value: "#34495e" }]
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


  const mydata = data.map(item => {
    if (item.title === "missing") {
      return { ...item, color: "#e74c3c" }
    } else {
      return { ...item, color: "#1abc9c" }
    }
  })

  return (
    <div className="panel panel-transparent">
      <div className="panel-body production-chart">
        <div className="title text-center">
          <h4>{title}</h4>
        </div>
        <VegaLite
          renderer="svg"
          spec={spec}
          data={{ table: mydata.slice(0, 10) }}
          actions={actions}
        />
      </div>
    </div>
  )
}
