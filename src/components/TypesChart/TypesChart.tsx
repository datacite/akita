import React from 'react'
import { VegaLite } from 'react-vega'
import { VisualizationSpec } from 'vega-embed'

import { compactNumbers } from '../../utils/helpers'
import useWindowDimensions from '../../../hooks/useWindowDimensions'

interface ChartRecord {
  title: string
  count: number
}

type Props = {
  data?: ChartRecord[]
  count?: number
  legend?: any
}

const actions = {
  export: true,
  source: false,
  compiled: false,
  editor: false
}

const TypesChart: React.FunctionComponent<Props> = ({
  data,
  count,
  legend
}) => {
  // get current screen size
  const width = useWindowDimensions().width
  const innerRadius = width >= 1400 ? 68 : 50
  const outerRadius = width >= 1400 ? 90 : 70
  

  const spec: VisualizationSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    description: 'A simple donut chart with embedded data.',
    padding: { left: 5, top: 10, right: 5, bottom: 5 },
    data: {
      name: 'table'
    },
    layer: [
      {
        mark: {
          type: 'arc',
          innerRadius: innerRadius,
          outerRadius: outerRadius,
          cursor: 'pointer',
          tooltip: true
        },
        encoding: {
          theta: {
            field: 'count',
            type: 'quantitative',
            sort: 'descending'
          },
          color: {
            field: 'title',
            type: 'nominal',
            title: 'type',
            legend: legend,
            scale: {
              range: [
                '#fccde5',
                '#fdb462',
                '#fb8072',
                '#fb8072',
                '#b3de69',
                '#bc80bd',
                '#fccde5',
                '#8dd3c7',
                '#ffed6f',
                '#d9d9d9',
                '#ffffb3',
                '#bebada',
                '#80b1d3',
                '#ccebc5',
                '#d9d9d9'
              ],
              domain: [
                'Audiovisual',
                'Collection',
                'Dataset',
                'Data Paper',
                'Event',
                'Image',
                'Interactive Resource',
                'Model',
                'Physical Object',
                'Service',
                'Sound',
                'Software',
                'Text',
                'Workflow',
                'Other'
              ]
            }
          }
        }
      },
      {
        mark: {
          type: 'text',
          fill: '#767676',
          align: 'center',
          baseline: 'middle',
          fontSize: 27
        },
        encoding: {
          text: { value: compactNumbers(count) }
        }
      }
    ],
    view: {
      stroke: null
    }
  }

  const title = () => {
    return (
      <React.Fragment>
        <h4>Works by work type</h4>
      </React.Fragment>
    )
  }

  return (
    <div className="panel panel-transparent">
      <div className="types-chart panel-body">
        <div className="title">{title()}</div>
        <VegaLite
          renderer="svg"
          spec={spec}
          data={{ table: data }}
          actions={actions}
        />
      </div>
    </div>
  )
}

export default TypesChart
