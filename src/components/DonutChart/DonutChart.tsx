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
  '#ffed6f'
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

export const fieldOfScienceRange = [
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
  '#ffed6f'
]

export const fieldOfScienceDomain = [
  'No Field of Science',
  'Natural sciences',
  'Mathematics',
  'Computer and information sciences',
  'Physical sciences',
  'Chemical sciences',
  'Earth and related environmental sciences',
  'Biological sciences',
  'Other natural sciences',
  'Engineering and technology',
  'Civil engineering',
  'Electrical engineering, electronic engineering, information engineering',
  'Mechanical engineering',
  'Chemical engineering',
  'Materials engineering',
  'Medical engineering',
  'Environmental engineering',
  'Environmental biotechnology',
  'Industrial biotechnology',
  'Nano-technology',
  'Other engineering and technologies',
  'Medical and health sciences',
  'Basic medicine',
  'Clinical medicine',
  'Health sciences',
  'Medical biotechnology',
  'Other medical sciences',
  'Agricultural sciences',
  'Agriculture, forestry, and fisheries',
  'Animal and dairy science',
  'Veterinary science',
  'Agricultural biotechnology',
  'Other agricultural sciences',
  'Social sciences',
  'Psychology',
  'Economics and business',
  'Educational sciences',
  'Sociology',
  'Law',
  'Political science',
  'Social and economic geography',
  'Media and communications',
  'Other social sciences',
  'Humanities',
  'History and archaeology',
  'Languages and literature',
  'Philosophy, ethics and religion',
  'Arts (arts, history of arts, performing arts, music)',
  'Other humanities'
]

export const registrationAgencyRange = [
  '#d9d9d9',
  '#ffffb3',
  '#ccebc5',
  '#E81A31',
  '#159DEA',
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
  '#ffed6f'
]

export const registrationAgencyDomain = [
  'No Registration Agency',
  'Airiti',
  'CNKI',
  'Crossref',
  'DataCite',
  'ISTIC',
  'JaLC',
  'KISTI',
  'mEDRA',
  'OP'
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
  const innerRadius = width >= 1400 ? 68 : 52
  const outerRadius = width >= 1400 ? 90 : 70
  const paddingLeft = width >= 1400 ? 55 : 10

  const spec: VisualizationSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    description: 'A simple donut chart with embedded data.',
    padding: { left: paddingLeft, top: 10, right: 10, bottom: 10 },
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
        <div className="title text-center">
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
