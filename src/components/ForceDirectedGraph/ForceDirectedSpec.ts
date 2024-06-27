import { VisualizationSpec } from 'vega-embed'
import {
  resourceTypeDomain,
  resourceTypeRange
} from '../../data/color_palettes'
import { Mark, Scale, Signal } from 'vega'

// export const TEST_NODES: ForceDirectedGraphNode[] = [
//   { title: 'Preprint', count: 22357 },
//   { title: 'Software', count: 136204 },
//   { title: 'Dataset', count: 7524645 },
//   { title: 'Organization', count: 97795 },
//   { title: 'Journal Article', count: 14043135 },
//   { title: 'People', count: 8718993 }
// ]
export const TEST_NODES: ForceDirectedGraphNode[] = [
  { title: 'Preprint', count: 22 },
  { title: 'Software', count: 13 },
  { title: 'Dataset', count: 75 },
  { title: 'Organization', count: 9 },
  { title: 'Journal Article', count: 140 },
  { title: 'People', count: 871 }
]

export const TEST_LINKS: ForceDirectedGraphLink[] = [
  { source: 'Preprint', target: 'Software', count: 79 },
  { source: 'Preprint', target: 'Dataset', count: 682 },
  { source: 'Preprint', target: 'Journal Article', count: 252 },

  { source: 'Software', target: 'Dataset', count: 19 },
  { source: 'Software', target: 'People', count: 286 },
  { source: 'Software', target: 'Organization', count: 2 },

  { source: 'Dataset', target: 'Organization', count: 117 },
  { source: 'Dataset', target: 'People', count: 546 },
  { source: 'Dataset', target: 'Journal Article', count: 3876 },

  { source: 'Organization', target: 'Journal Article', count: 17 },
  { source: 'Organization', target: 'People', count: 39 },

  { source: 'Journal Article', target: 'People', count: 3847 },
  { source: 'Journal Article', target: 'Journal Article', count: 20 }
]
// export const TEST_LINKS: ForceDirectedGraphLink[] = [
//   { source: 'Preprint', target: 'Software', count: 7992 },
//   { source: 'Preprint', target: 'Dataset', count: 68292 },
//   { source: 'Preprint', target: 'Journal Article', count: 25263 },
//
//   { source: 'Software', target: 'Dataset', count: 1983 },
//   { source: 'Software', target: 'People', count: 28612 },
//   { source: 'Software', target: 'Organization', count: 24 },
//
//   { source: 'Dataset', target: 'Organization', count: 11657 },
//   { source: 'Dataset', target: 'People', count: 546454 },
//   { source: 'Dataset', target: 'Journal Article', count: 387906 },
//
//   { source: 'Organization', target: 'Journal Article', count: 1777 },
//   { source: 'Organization', target: 'People', count: 3009 },
//
//   { source: 'Journal Article', target: 'People', count: 3847926 },
//   { source: 'Journal Article', target: 'Journal Article', count: 2043502 }
// ]

export interface ForceDirectedGraphNode {
  title: string
  group?: string
  count: number
}

export interface ForceDirectedGraphLink {
  source: string
  target: string
  count: number
}

///// Signals ///////////////////////////////////
const signals: Signal[] = [
  {
    name: 'linkDistance',
    value: 200
    // bind: { input: 'range', min: 1, max: 500, step: 1 }
  },
  {
    name: 'selected',
    value: null,
    on: [
      { events: '@nodes:mouseover', update: 'datum.title' },
      {
        events: '@links:mouseover',
        update:
          "datum.source.datum && datum.target.datum ? datum.source.datum.title + ' ⇄ ' + datum.target.datum.title : null"
      },
      { events: 'mouseout', update: 'null' }
    ]
  },

  // Force specific signals
  { name: 'cx', update: 'width / 2' },
  { name: 'cy', update: 'height / 2' },
  {
    name: 'gravityX',
    value: 0
    // bind: { input: 'range', min: 0, max: 1 },
  },
  {
    name: 'gravityY',
    value: 0.2
    // bind: { input: 'range', min: 0, max: 1 },
  },

  {
    name: 'fix',
    description: 'State variable for active node fix status.',
    value: false,
    on: [
      {
        events: 'symbol:mouseout[!event.buttons], window:mouseup',
        update: 'false'
      },
      { events: 'symbol:mouseover', update: 'fix || true' },
      {
        events: '[symbol:mousedown, window:mouseup] > window:mousemove!',
        update: 'xy()',
        force: true
      }
    ]
  },
  {
    name: 'node',
    description: 'Graph node most recently interacted with.',
    value: null,
    on: [{ events: 'symbol:mouseover', update: 'fix === true ? item() : node' }]
  },
  {
    name: 'restart',
    description: 'Flag to restart Force simulation upon data changes.',
    value: false,
    on: [{ events: { signal: 'fix' }, update: 'fix && fix.length' }]
  }
]

///// Scales ////////////////////////////////////
const sizeScale: Scale = {
  name: 'size',
  type: 'linear',
  domain: {
    fields: [
      { data: 'nodeData', field: 'count' },
      { data: 'linkData', field: 'count' }
    ]
  },
  range: [1, 10000]
}

///// Marks /////////////////////////////////////
const nodeMarks: Mark = {
  name: 'nodes',
  type: 'symbol',
  from: { data: 'nodeData' },

  encode: {
    enter: {
      fill: { scale: 'color', field: 'title' },
      stroke: { value: 'black' },
      strokeWidth: { value: 1 },

      xfocus: { signal: 'cx' },
      yfocus: { signal: 'cy' }
    },

    update: {
      size: { signal: 'datum.count', scale: 'size' },
      fillOpacity: {
        signal: 'selected ? indexof(selected, datum.title) > -1 ? 1 : 0.6 : 0.6'
      },
      tooltip: { signal: "datum.title + ': ' + format(datum.count, ',')" }
    }
  },

  transform: [
    {
      type: 'force',
      forces: [
        { force: 'center', x: { signal: 'cx' }, y: { signal: 'cy' } },
        { force: 'x', x: 'xfocus', strength: { signal: 'gravityX' } },
        { force: 'y', y: 'yfocus', strength: { signal: 'gravityY' } },

        {
          force: 'collide',
          iterations: 10,
          // radius: 10
          radius: { expr: 'sqrt(datum.size) / 2' }
        },
        { force: 'nbody', strength: -200 },
        {
          force: 'link',
          links: 'linkData',
          id: 'datum.title',
          distance: { signal: 'linkDistance' }
        }
      ],

      iterations: 100,
      static: false,
      restart: { signal: 'restart' },
      signal: 'force'
    }
  ],

  on: [
    {
      trigger: 'fix',
      modify: 'node',
      values:
        'fix === true ? { fx: node.x, fy: node.y } : {fx: fix[0], fy: fix[1]}'
    },
    { trigger: '!fix', modify: 'node', values: '{ fx: null, fy: null }' }
  ],

  zindex: 2
}

const linkMarks: Mark = {
  name: 'connections',
  type: 'path',
  from: { data: 'linkData' },

  encode: {
    enter: {
      stroke: { value: '#ccc' },
      strokeCap: { value: 'round' },
      tooltip: {
        signal:
          "datum.source.datum.title + ' ⇄ ' + datum.target.datum.title + ': ' + format(datum.count, ',')"
      }
    },

    update: {
      strokeWidth: { signal: "scale('size', datum.count) / 500" },
      strokeOpacity: {
        signal:
          "datum.source.datum && datum.target.datum ? indexof(datum.source.datum.title + ' ⇄ ' + datum.target.datum.title, selected) > -1 ? 1 : 0.6 : 0.6"
      }
    }
  },

  transform: [
    {
      type: 'linkpath',
      shape: 'diagonal',

      require: { signal: 'force' },

      sourceX: 'datum.source.x',
      sourceY: 'datum.source.y',
      targetX: 'datum.target.x',
      targetY: 'datum.target.y'
    }
  ],

  zindex: 1
}

const nodeLabels: Mark = {
  type: 'text',
  from: { data: 'nodes' },

  encode: {
    enter: {
      text: { signal: "datum.size > 1 ? datum.datum.title : ''" },

      align: { value: 'center' },
      baseline: { value: 'bottom' },
      fill: { value: 'black' },

      font: { value: 'Source Sans Pro' },
      fontSize: { value: 16 }
    },

    update: { x: { field: 'x' }, y: { field: 'y' } }
  },

  interactive: false,
  zindex: 3
}

const nodeCounts: Mark = {
  type: 'text',
  from: { data: 'nodes' },

  encode: {
    enter: {
      text: {
        signal: "datum.size > 5000 ? format(datum.datum.count, ',') : ''"
      },

      align: { value: 'center' },
      baseline: { value: 'top' },
      fill: { value: 'black' },

      font: { value: 'Source Sans Pro' },
      fontSize: { value: 16 }
    },

    update: { x: { field: 'x' }, y: { field: 'y' } }
  },

  interactive: false,
  zindex: 3
}

const forceDirectedGraphSpec = (
  width = 500,
  domain = resourceTypeDomain.concat(['People', 'Organizations']),
  range = resourceTypeRange.concat(['#A83', '#FAD'])
): VisualizationSpec => ({
  $schema: 'https://vega.github.io/schema/vega/v5.json',
  width: width,
  height: 300,
  autosize: 'none',

  data: [{ name: 'nodeData' }, { name: 'linkData' }],

  scales: [
    sizeScale,
    { name: 'color', type: 'ordinal', domain: domain, range: range }
  ],
  marks: [nodeMarks, nodeLabels, nodeCounts, linkMarks],
  signals: signals
})

export default forceDirectedGraphSpec
