import React from 'react'
import { VegaLite } from 'react-vega'
import { VisualizationSpec } from 'vega-embed'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import EmptyChart from '../EmptyChart/EmptyChart'

export const barColors = ['#32A251FF',
'#FF7F0FFF',
'#3CB7CCFF',
'#FFD94AFF',
'#39737CFF',
'#B85A0DFF',
]
export interface HorizontalBarRecord {
  title: string
  count: number
  color?: string
}

type Props = {
  titlePercent: number
  titleText: string | string[]
  data: HorizontalBarRecord[]
  color?: string
}

const HorizontalBarChart: React.FunctionComponent<Props> = ({
  titlePercent,
  titleText,
  data,
  color
}) => {
  if (data.length==0){
    return <EmptyChart title={Array.isArray(titleText) ? titleText.join(' ') : titleText}/>
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
      color: {
        field: "title",
        scale: { range: barColors }
      },
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

  const helpIcon = () => { 
    return (
      <OverlayTrigger 
          placement="top"
          overlay={
              <Tooltip id="tooltipAuthors">
                  The field {"{field}"} from DOI metadata was used to generate this chart.
              </Tooltip>
          }>
          <FontAwesomeIcon icon={faQuestionCircle} fontSize={24} style={{ position: 'absolute', top: 0, right: 0 }} />
      </OverlayTrigger>
    )
  }

  return (
    <div className="panel panel-transparent">
      <div className="panel-body production-chart">
        <VegaLite
          renderer="svg"
          spec={stackedBarChartSpec}
          data={{ table: data }}
          actions={false}
        />
      </div>
      {helpIcon()}
    </div>
  )
}

export default HorizontalBarChart
