import React from 'react'
import { VegaLite } from 'react-vega'
import { VisualizationSpec } from 'vega-embed'
import { affiliationDomain, affiliationRange, contributorDomain, contributorRange, resourceTypeDomain, resourceTypeRange } from '../../data/color_palettes'
import { BaseData, Mark } from 'vega'

import EmptyChart from '../EmptyChart/EmptyChart'
import HelpIcon from '../HelpIcon/HelpIcon'


type Props = {
  titleText: string
  data: SankeyGraphData3[] | SankeyGraphData4[]
}

export interface SankeyGraphData3 {
  name: string
  contributorType: string
  workType: string
  count: number
}

export interface SankeyGraphData4 extends SankeyGraphData3 {
  affiliation: string
}

export const TEST_DATA: SankeyGraphData4[] = [
  { name: "Erin Robinson",     contributorType: "Project Leader", affiliation: "Affiliation 1", workType: "Audiovisual", count: 7 },
  { name: "Neil Davies",       contributorType: "Creator",        affiliation: "Affiliation 1", workType: "Audiovisual", count: 4 },
  { name: "Maria Praetzellis", contributorType: "Project Leader", affiliation: "Affiliation 2", workType: "Audiovisual", count: 8 },
  { name: "Maria Praetzellis", contributorType: "Creator",        affiliation: "Affiliation 3", workType: "Software", count: 6 },
  { name: "Brian Riley",       contributorType: "Data Curator",   affiliation: "Affiliation 3", workType: "Dataset", count: 3 },
  { name: "Brian Riley",       contributorType: "Creator",        affiliation: "Affiliation 1", workType: "Dataset", count: 9}
]

const NODE_TRANSFORM = (i: 1 | 2 | 3): BaseData['transform'] => {
  const expr =
    i === 1 ? "datum.stack == 'stk1' ? datum.stk1+' '+datum.stk2 : datum.stk2+' '+datum.stk1" :
    `datum.stack == 'stk${i}' ? datum.stk${i} +' '+datum.stk${i-1} : datum.stk${i+1}+' '+datum.stk${i}`

  return [
    {
      type: "filter",
      expr: "!groupSelector || groupSelector.stk1 == datum.stk1 || groupSelector.stk2 == datum.stk2 || groupSelector.stk3 == datum.stk3 || groupSelector.stk4 == datum.stk4",
    },
    { type: "formula", expr: "datum.stk1+datum.stk2+datum.stk3+datum.stk4", as: "key" },
    { type: "fold", fields: ["stk1", "stk2", "stk3", "stk4"], as: ["stack", "grpId"] },
    {
      type: "formula",
      expr: expr,
      as: "sortField"
    },
    {
      type: "stack",
      groupby: ["stack"],
      sort: { field: "sortField", order: "descending" },
      field: "size"
    },
    { type: "formula", expr: "(datum.y0+datum.y1)/2", as: "yc" },
  ]
}

const GROUP_TRANSFORM: BaseData['transform'] = [
  {
    type: "aggregate",
    groupby: ["stack", "grpId"],
    fields: ["size"],
    ops: ["sum"],
    as: ["total"]
  },
  {
    type: "stack",
    groupby: ["stack"],
    sort: { field: "grpId", order: "descending" },
    field: "total"
  },
  { type: "formula", expr: "scale('y', datum.y0 + 0.5)", as: "scaledY0" },
  { type: "formula", expr: "scale('y', datum.y1 - 0.5)", as: "scaledY1" },
  { type: "formula", expr: "datum.stack == 'stk1'", as: "rightLabel" },
  { type: "formula", expr: "datum.total/domain('y')[1]", as: "percentage" }
]

const EDGE_TRANSFORM = (i: 1 | 2 | 3): BaseData['transform'] => {
  const expr = `datum.stack == 'stk${i}'`
  const from = `destinationNodes${i}`
  const sourceX = `scale('x', 'stk${i}') + bandwidth('x')`
  const targetX = `scale('x', 'stk${i+1}')`

  return [
    // Only get nodes from the left stack
    { type: "filter", expr: expr },

    
    // Get corresponding node from the right stack, as "target"
    {
      type: "lookup",
      from: from,
      key: "key",
      fields: ["key"],
      as: ["target"]
    },

    // {
    //   type: "lookup",
    //   from: "groupCounts",
    //   key: "grpId",
    //   fields: ["grpId"],
    //   values: ["count"],
    //   as: ["groupCount"]
    // },
    
    // calculate SVG link path between stacks for the node pair
    {
      type: "linkpath",
      orient: "horizontal",
      shape: "diagonal",
      sourceY: { expr: "scale('y', datum.yc)" },
      sourceX: { expr: sourceX },
      targetY: { expr: "scale('y', datum.target.yc)" },
      targetX: { expr: targetX }
    },

    { type: "formula", expr: "datum.size/domain('y')[1]", as: "percentage" },
    { type: "formula", expr: "scale('y', datum.y0+0.5) - scale('y', datum.y1-0.5)", as: "strokeWidth" }
    // { type: "formula", expr: "scale('y', datum.y0+(0.5/datum.groupCount)) - scale('y', datum.y1-(0.5/datum.groupCount))", as: "strokeWidth" }
  ]
}

const EDGE_MARK = (i: 1 | 2 | 3): Mark => {
  const data = `edges${i}`
  const tooltip = `datum.stk${i} + ' → ' + datum.stk${i+1} + '    ' + format(datum.size, ',.0f') + '   (' + datum.percentage`// format(datum.percentage, '.1%') + ')'`

  return {
    type: "path",
    from: { data: data },
    clip: true,
    encode: {
      update: {
        stroke: { scale: "color", field: "stk4" },
        strokeWidth: { field: "strokeWidth" },
        path: { field: "path" },
        strokeOpacity: { signal: "!groupSelector && (groupHover.stk1 == datum.stk1 || groupHover.stk2 == datum.stk2 || groupHover.stk3 == datum.stk3 || groupHover.stk4 == datum.stk4) ? 0.9 : 0.6" },
        zindex: { signal: "!groupSelector && (groupHover.stk1 == datum.stk1 || groupHover.stk2 == datum.stk2 || groupHover.stk3 == datum.stk3 || groupHover.stk4 == datum.stk4) ? 1 : 0" },
        tooltip: { signal: tooltip }
      },
      hover: {
        strokeOpacity: { value: 0.9 },
        zindex: { value: 9 }
      }
    }
  }
}

const BUTTON_MARK: Mark = {
  // Create a "show all" button shown only when a group is selected.
  type: "group",
  data: [
    // Show only when groupSelector signal is true
    {
      name: "dataForShowAll",
      values: [{}],
      transform: [{ type: "filter", expr: "groupSelector" }]
    }
  ],
  encode: {
    enter: {
      xc: { signal: "width/2" },
      y: { value: 30 },
      width: { value: 80 },
      height: { value: 30 }
    }
  },
  marks: [
    {
      // This group is shown as a button with rounded corners.
      type: "group",
      name: "groupReset",
      from: { data: "dataForShowAll" },
      encode: {
        enter: {
          cornerRadius: { value: 6 },
          fill: { value: "#f5f5f5" },
          stroke: { value: "#c1c1c1" },
          strokeWidth: { value: 2 },
          height: { field: { group: "height" } },
          width: { field: { group: "width" } }
        },
        update: { opacity: {value: 1} },
        hover: { opacity: {value: 0.7} }
      },
      marks: [
        {
          type: "text",
          interactive: false,
          encode: {
            enter: {
              xc: { field: {group: "width"}, mult: 0.5 },
              yc: { field: {group: "height"}, mult: 0.5, offset: 2 },
              align: { value: "center" },
              baseline: { value: "middle" },
              fontWeight: { value: "bold" },
              text: { value: "Show All" }
            }
          }
        }
      ]
    }
  ]
}

const SankeyGraph: React.FunctionComponent<Props> = ({ titleText, data }) => {
  if (data.length==0){
    return <EmptyChart title={Array.isArray(titleText) ? titleText.join(' ') : titleText}/>
  }


  const names = Array.from(new Set(TEST_DATA.map(d => d.name)))
  const range = resourceTypeRange.concat(contributorRange).concat(affiliationRange)
  const domain = resourceTypeDomain.concat(contributorDomain).concat(affiliationDomain).concat(names)


  const sankeyGraphSpec: VisualizationSpec = {
    $schema: "https://vega.github.io/schema/vega/v5.0.json",
    height: 300,
    width: 600,
    data: [
      {
        name: "rawData",
        transform: [
          {type: "formula", expr: "datum.name", as: "stk1"},
          {type: "formula", expr: "datum.contributorType", as: "stk2"},
          {type: "formula", expr: "datum.affiliation", as: "stk3"},
          {type: "formula", expr: "datum.workType", as: "stk4"},
          {type: "formula", expr: "datum.count", as: "size"}
        ]
      },

      { name: "nodes1", source: "rawData", transform: NODE_TRANSFORM(1) },
      { name: "nodes2", source: "rawData", transform: NODE_TRANSFORM(2) },
      { name: "nodes3", source: "rawData", transform: NODE_TRANSFORM(3) },

      { name: "groups", source: "nodes1", transform: GROUP_TRANSFORM },
      { name: "groupCounts", source: "nodes1", transform: [ { type: "aggregate", groupby: ["grpId"] } ]},
      
      // Lookup tables for stk2/stk3/stk4 nodes
      { name: "destinationNodes1", source: "nodes1", transform: [ {type: "filter", expr: "datum.stack == 'stk2'"} ] },
      { name: "destinationNodes2", source: "nodes2", transform: [ {type: "filter", expr: "datum.stack == 'stk3'"} ] },
      { name: "destinationNodes3", source: "nodes3", transform: [ {type: "filter", expr: "datum.stack == 'stk4'"} ] },

      { name: "edges1", source: "nodes1", transform: EDGE_TRANSFORM(1) },
      { name: "edges2", source: "nodes2", transform: EDGE_TRANSFORM(2) },
      { name: "edges3", source: "nodes3", transform: EDGE_TRANSFORM(3) }

    ],    
    scales: [
      {
        name: "color",
        type: "ordinal",
        range: range,
        domain: domain
      },
      {
        // Calculate horizontal stack positioning
        name: "x",
        type: "band",
        range: "width",
        domain: ["stk1", "stk2", "stk3", "stk4"],
        paddingOuter: 0.00,
        paddingInner: 0.98
      },
      {
        // This scale goes up as high as the highest y1 value of all nodes
        name: "y",
        type: "linear",
        range: "height",
        domain: { data: "nodes1", field: "y1" }
      },
      {
        // Map internal ids to stack names
        name: "stackNames",
        type: "ordinal",
        range: ["Name", "Contributor Type", "Affiliation", "Work Type"],
        domain: ["stk1", "stk2", "stk3", "stk4"]
      }
    ],
    marks: [
      {
        // Group rectangles
        type: "rect",
        name: "groupMark",
        from: { data: "groups" },
        encode: {
          enter: {
            fill: { value: 'black' },
            width: { scale: "x", band: 1 },
          },
          update: {
            x: { scale: "x", field: "stack" },
            y: { field: "scaledY0" },
            y2: { field: "scaledY1" },
            fillOpacity: { value: 0.6 },
            tooltip: { signal: "datum.grpId + '   ' + format(datum.total, ',.0f') + '   (' + format(datum.percentage, '.1%') + ')'" }
          },
          hover: { fillOpacity: { value: 1 } }
        }
      },
      {
        // Group labels
        type: "text",
        from: { data: "groups" },
        encode: {
          update: {
            text: { signal: "abs(datum.scaledY0-datum.scaledY1) > 13 ? datum.grpId : ''" },
            font: { value: "Source Sans Pro" },
            fontSize: { value: 14 },
            fontWeight: { value: "normal" },
            fill: { value: "black" },
            baseline: { value: "middle" },
            
            align: { signal: "datum.rightLabel ? 'left' : 'right'" },
            x: { signal: "scale('x', datum.stack) + (datum.rightLabel ? bandwidth('x') + 2 : -2)" },
            yc: { signal: "(datum.scaledY0 + datum.scaledY1)/2" },
          }
        },
        interactive: false,
        zindex: 10
      },
      EDGE_MARK(1),
      EDGE_MARK(2),
      EDGE_MARK(3),
      BUTTON_MARK
    ],
    signals: [
      {
        name: "groupHover",
        value: {},
        on: [
          {
            events: "@groupMark:mouseover",
            update: "{stk1:datum.stack=='stk1' && datum.grpId, stk2:datum.stack=='stk2' && datum.grpId, stk3:datum.stack=='stk3' && datum.grpId, stk4:datum.stack=='stk4' && datum.grpId}"
          },
          {events: "mouseout", update: "{}"}
        ]
      },
      {
        name: "groupSelector",
        value: false,
        on: [
          {
            events: "@groupMark:click!",
            update: "{stack:datum.stack, stk1:datum.stack=='stk1' && datum.grpId, stk2:datum.stack=='stk2' && datum.grpId, stk3:datum.stack=='stk3' && datum.grpId, stk4:datum.stack=='stk4' && datum.grpId}"
          },
          {
            events: [
              {type: "click", markname: "groupReset"},
              {type: "dblclick"}
            ],
            update: "false"
          }
        ]
      }
    ]
  }
  
  return (
    <div className="panel panel-transparent">
      <div className="panel-body" style={{ font: 'Source Sans Pro', fontSize: 21, color: '#1abc9c' }}>
        {titleText}
        <HelpIcon text='Connections data comes from Event Data service' />
      </div>
      <div className="panel-body production-chart">
        <VegaLite
          renderer="svg"
          spec={sankeyGraphSpec}
          data={{ "rawData": data }}
          actions={false}
        />
      </div>
    </div>
  )
}

export default SankeyGraph
