import React from 'react'
import { VegaLite } from 'react-vega'
import { VisualizationSpec } from 'vega-embed'
import EmptyChart from '../EmptyChart/EmptyChart'

import { compactNumbers } from '../../utils/helpers'
import useWindowDimensions from '../../utils/useWindowDimensions'

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

export const otherRange = [ 'gray', 'black' ]
export const otherDomain = [ 'Other', 'Missing' ]

// Source:  https://r-charts.com/color-palettes/#discrete
// paletteer_d("ggsci::category20_d3") + some from original set
export const typesRange = [
  '#1F77B4FF',
  '#FF7F0EFF',
  '#2CA02CFF',
  '#D62728FF',
  '#9467BDFF',
  '#8C564BFF',
  '#E377C2FF',
  '#7F7F7FFF',
  '#BCBD22FF',
  '#17BECFFF',
  '#AEC7E8FF',
  '#FFBB78FF',
  '#98DF8AFF',
  '#FF9896FF',
  '#C5B0D5FF',
  '#C49C94FF',
  '#F7B6D2FF',
  '#C7C7C7FF',
  '#DBDB8DFF',
  '#9EDAE5FF',
  '#fccde5',
  '#fdb462',
  '#fb8072',
  '#b3de69',
  '#bc80bd',
  '#fccde5',
  '#8dd3c7',
  ...otherRange
]
// Source: https://schema.datacite.org/meta/kernel-4/include/datacite-resourceType-v4.xsd
export const typesDomain = [
  'Audiovisual',
  'Book',
  'Book Chapter',
  'Collection',
  'Computational Notebook',
  'Conference Paper',
  'Conference Proceeding',
  'Data Paper',
  'Dataset',
  'Dissertation',
  'Event',
  'Image',
  'Interactive Resource',
  'Journal',
  'Journal Article',
  'Model',
  'Output Management Plan',
  'Peer Review',
  'Physical Object',
  'Preprint',
  'Report',
  'Service',
  'Software',
  'Sound',
  'Standard',
  'Text',
  'Workflow',
  ...otherDomain
]

export const contributorRange = [
  'red',
  'green',
  'blue'
]

export const contributorDomain = [
  'Creator',
  'Data Curator',
  'Project Leader'
]

export const affiliationRange = [
  'red',
  'green',
  'blue'
]

export const affiliationDomain = [
  'Affiliation 1',
  'Affiliation 2',
  'Affiliation 3'
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
  ...otherRange
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
  'OGL-Canada-2.0',
  ...otherDomain
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
  if (data.length==0){
    return <EmptyChart title={title}/>
  }
  // get current screen size
  const windowDimensions: any = useWindowDimensions()
  const windowWidth = windowDimensions.width
  let width = windowWidth >= 1200 ? 200 : 175
  let height = windowWidth >= 1200 ? 200 : 175
  let paddingLeft = windowWidth >= 1200 ? 70 : 60

  let innerRadius = windowWidth >= 1400 ? 68 : 52
  let outerRadius = windowWidth >= 1400 ? 90 : 70

  if (windowWidth < 768) {
    innerRadius = 44
    outerRadius = 60
    paddingLeft = 0
    width = 125
    height = 125
  }

  const spec: VisualizationSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    description: 'A simple donut chart with embedded data.',
    padding: { left: paddingLeft, top: 10, right: 10, bottom: 10 },
    width: width,
    height: height,
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
          text: { value: compactNumbers(count, true) }
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
