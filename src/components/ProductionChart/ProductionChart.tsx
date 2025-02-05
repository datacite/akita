'use client'

import React from 'react'
import { VegaLite } from 'react-vega'
import { VisualizationSpec } from 'vega-embed'

import useWindowDimensions from 'src/utils/useWindowDimensions'
import EmptyChart from 'src/components/EmptyChart/EmptyChart'

interface ChartRecord {
  title: string
  count: number
}

type Props = {
  title: string
  data: ChartRecord[]
  lowerBoundYear?: number
  color?: string
}

const actions = {
  export: true,
  source: false,
  compiled: false,
  editor: false
}

export default function ProductionChart({ title, data, lowerBoundYear, color }: Props) {
  if (data.length == 0) {
    return <EmptyChart title={title} />
  }
  // get current screen size
  const windowDimensions: any = useWindowDimensions()
  const width = windowDimensions.width

  /* istanbul ignore next */
  const thisYear = new Date().getFullYear() + 1

  /* istanbul ignore next */
  // lower bound year should be multiple of 5
  if (typeof lowerBoundYear == 'undefined') {
    lowerBoundYear = Math.floor((thisYear - 10) / 5) * 5
  }

  if (typeof color == 'undefined') {
    color = '#1abc9c'
  }

  /* istanbul ignore next */
  const yearsDomain = thisYear - lowerBoundYear
  const chartWidth = width >= 1400 ? yearsDomain * 22 : yearsDomain * 18

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
    transform: [
      {
        calculate: 'toNumber(datum.title)',
        as: 'year'
      },
      {
        calculate: 'toNumber(datum.title)+1',
        as: 'bin_end'
      },
      {
        filter: 'toNumber(datum.title) >= ' + lowerBoundYear
      }
    ],
    width: chartWidth,
    mark: {
      type: 'bar',
      cursor: 'pointer',
      tooltip: true
    },
    selection: {
      highlight: {
        type: 'single',
        empty: 'none',
        on: 'mouseover'
      }
    },
    encoding: {
      x: {
        field: 'year',
        bin: {
          binned: true,
          step: 1,
          maxbins: thisYear - lowerBoundYear
        },
        type: 'quantitative',
        axis: {
          format: '1',
          labelExpr: 'datum.label % 5 === 0 ? datum.label : ""'
        },
        scale: {
          domain: [lowerBoundYear, thisYear]
        }
      },
      y: {
        field: 'count',
        type: 'quantitative',
        axis: {
          format: ',d',
          tickMinStep: 1
        }
      },
      color: {
        field: 'count',
        scale: { range: [color] },
        type: 'nominal',
        legend: null,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        condition: [{ selection: 'highlight', value: '#34495e' }]
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

  const mydata = data

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
