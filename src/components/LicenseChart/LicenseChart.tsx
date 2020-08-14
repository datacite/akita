import React from 'react'
import { VegaLite } from 'react-vega'
import { VisualizationSpec } from 'vega-embed'
import { compactNumbers } from '../../utils/helpers'

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

const LicenseChart: React.FunctionComponent<Props> = ({
  data,
  count,
  legend
}) => {
  const spec: VisualizationSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    description: 'A simple donut chart with embedded data.',
    padding: { left: 5, top: 10, right: 5, bottom: 5 },
    data: {
      name: 'table',
    },
    layer: [
      {
        mark: {
          type: 'arc',
          innerRadius: 68,
          outerRadius: 90,
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
            title: 'license',
            type: 'nominal',
            legend: legend,
            scale: {
              scheme: 'set3'
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
        <h4>Works by license</h4>
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

export default LicenseChart
