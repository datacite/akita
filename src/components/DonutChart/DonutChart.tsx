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
  title: string
  range: string[]
  domain: string[]
}

const actions = {
  export: true,
  source: false,
  compiled: false,
  editor: false
}

export const typesRange = [
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
]
export const typesDomain = [
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

export const licenseRange = [
  '#d9d9d9',
  '#ffffb3',
  '#ccebc5',
  '#8dd3c7',
  '#8dd3c7',
  '#8dd3c7',
  '#8dd3c7',
  '#8dd3c7',
  '#80b1d3',
  '#80b1d3',
  '#80b1d3',
  '#80b1d3',
  '#80b1d3',
  '#80b1d3',
  '#80b1d3',
  '#80b1d3',
  '#8dd3c7',
  '#80b1d3',
  '#b3de69',
  '#fdb462',
  '#fccde5',
  '#ccebc5',
  '#ccebc5',
  '#ffed6f',
]

export const licenseDomain = [
  'No License',
  'AFL-1.1',
  'Apache-2.0',
  'CC-BY-1.0',
  'CC-BY-2.0',
  'CC-BY-2.5',
  'CC-BY-3.0',
  'CC-BY-4.0',
  'CC-BY-NC-2.0',
  'CC-BY-NC-2.5',
  'CC-BY-NC-3.0',
  'CC-BY-NC-4.0',
  'CC-BY-NC-ND-3.0',
  'CC-BY-NC-ND-4.0',
  'CC-BY-NC-SA-3.0',
  'CC-BY-NC-SA-4.0',
  'CC-BY-SA-4.0',
  'CC-PDDC',
  'CC0-1.0',
  'GPL-3.0',
  'ISC',
  'MIT',
  'MPL-2.0',
  'OGL-Canada-2.0'
]

const DonutChart: React.FunctionComponent<Props> = ({
  data,
  count,
  legend,
  title,
  range,
  domain
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
              range: range,
              domain: domain
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

  return (
    <div className="panel panel-transparent">
      <div className="donut-chart panel-body">
        <div className="title">
          <h4>{title}</h4>
        </div>
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

export default DonutChart
