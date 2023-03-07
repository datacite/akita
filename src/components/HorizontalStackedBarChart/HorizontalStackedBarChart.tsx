import React from 'react'
import { VegaLite } from 'react-vega'
import { VisualizationSpec } from 'vega-embed'

import EmptyChart from '../EmptyChart/EmptyChart'

export interface HorizontalBarRecord {
  title: string
  count: number
  color?: string
}

type Props = {
  titlePercent: number
  titleText: string
  data: HorizontalBarRecord[]
  color?: string
}

const actions = {
  export: true,
  source: false,
  compiled: false,
  editor: false
}

const HorizontalBarChart: React.FunctionComponent<Props> = ({
  titlePercent,
  titleText,
  data,
  color
}) => {
  if (data.length==0){
    return <EmptyChart title={titleText}/>
  }

  if (typeof color == 'undefined') {
    color = '#1abc9c'
  }

  const stackedBarChartSpec: VisualizationSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    data: {
        name: 'table'
    },
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
    mark: {
      type: "bar",
      tooltip: true,
      height: 50,
      baseline: 'bottom'
      
    },
    transform: [
      {
        calculate: "datum.count * 100",
        as: "percentage"
      },
      // {calculate: "datum.Name == '__missing__'? '__missing__' : 'complete'",
      //  as: "completenes"
      //  }
      ],
    encoding: {
        x: {
            aggregate: "sum",
            field: "count",
            stack: "normalize",
            type: "quantitative",
            axis: {"format": ".0%"},
            title: ''
        },
        color: { field: "title" },
        order: {
            "aggregate": "sum",
            "sort": "descending",
            "field": "count"
        },
        
    },
    config: {
      legend: {
        orient: 'bottom'
      }
    }
  }

  return (
    <div className="panel panel-transparent">
      <div className="panel-body production-chart">
        <VegaLite
          renderer="svg"
          spec={stackedBarChartSpec}
          data={{ table: data }}
          actions={actions}
        />
      </div>
    </div>
  )
}

export default HorizontalBarChart
