import React from 'react'
import { VegaLite } from 'react-vega'
import { VisualizationSpec } from 'vega-embed'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import EmptyChart from '../EmptyChart/EmptyChart'
import { barColors } from '../HorizontalStackedBarChart/HorizontalStackedBarChart'

export interface HorizontalBarRecord {
  title: string
  count: number
  color?: string
}

export interface ForceDirectedGraphNode {
  name: string
  group: string
}

export interface ForceDirectedGraphLink {
  source: number
  target: number
  value: number
}

type Props = {
  titleText: string | string[]
  nodes: ForceDirectedGraphNode[]
  links: ForceDirectedGraphLink[]
  color?: string
}

const ForceDirectedGraph: React.FunctionComponent<Props> = ({
  titleText,
  nodes,
  links,
  color
}) => {
  if (nodes.length==0){
    return <EmptyChart title={Array.isArray(titleText) ? titleText.join(' ') : titleText}/>
  }

  if (typeof color == 'undefined') {
    color = '#1abc9c'
  }

  const forceDirectedGraphSpec: VisualizationSpec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 600,
    height: 400,
    autosize: "none",
    title: {
      text: "TEST"
      // text: titlePercent + '%',
    //   text: titleText,
    //   align: 'left',
    //   anchor: 'start',
    //   // font: 'Source Sans Pro',
    //   // fontSize: 34,
    //   // fontWeight: 'normal',
    //   // color: '#1abc9c',
    //   font: 'Source Sans Pro',
    //   fontSize: 21,
    //   color: '#1abc9c'
    },
    signals: [
      { name: "nodeRadius", value: 10 },
      { name: "nodeCharge", value: -2 },
      { name: "linkDistance", value: 30 },
      { name: "static", value: false },
      { name: "cx", update: "width / 2" },
      { name: "cy", update: "height / 2" },
      // { name: "gravityX", value: 1, bind: {input: "range", min: 0, max: 1} },
      // { name: "gravityY", value: 1, bind: {input: "range", min: 0, max: 1} },
      {
        description: "State variable for active node fix status.",
        name: "fix", value: false,
        on: [
          {
            events: "symbol:mouseout[!event.buttons], window:mouseup",
            update: "false"
          },
          {
            events: "symbol:mouseover",
            update: "fix || true"
          },
          {
            events: "[symbol:mousedown, window:mouseup] > window:mousemove!",
            update: "xy()",
            force: true
          }
        ]
      },
      {
        description: "Graph node most recently interacted with.",
        name: "node", value: null,
        on: [
          {
            events: "symbol:mouseover",
            update: "fix === true ? item() : node"
          }
        ]
      },
      {
        description: "Flag to restart Force simulation upon data changes.",
        name: "restart", value: false,
        on: [
          { events: { signal: "fix" }, update: "fix && fix.length" }
        ]
      }
    ],
    legends: [{
      fill: "color",
      encode: {
        title: {
          update: { fontSize: {value: 14} }
        },
        labels: {
          interactive: true,
          update: {
            fontSize: {value: 12},
            fill: {value: "black"}
          },
          hover: {
            fill: {value: "firebrick"}
          }
        },
        symbols: {
          update: {
            stroke: {value: "transparent"}
          }
        },
        legend: {
          update: {
            stroke: {value: "#ccc"},
            strokeWidth: {value: 1.5}
          }
        }
      }
    }],
    data: [ { name: "node-data" }, { name: "link-data" } ],
    scales: [
      {
        name: "color",
        type: "ordinal",
        domain: {
          data: "node-data",
          field: "group"
        },
        range: barColors
      }
    ],
    marks: [
      {
        name: "nodes",
        type: "symbol",
        from: { data: "node-data" },
        encode: {
          enter: {
            fill: { scale: "color", field: "group" },
          },
          update: {
            size: { signal: "2 * nodeRadius * nodeRadius" },
            tooltip: { field: "name" },            
            cursor: {
              value: "pointer"
            }
          }
        },
        transform: [
          {
            type: "force",
            iterations: 300,
            restart: { signal: "restart" },
            static: { signal: "static" },
            signal: "force",
            forces: [
              {
                force: "center",
                x: { signal: "cx" },
                y: { signal: "cy" }
              },
              // { force: "x", x: "xfocus", strength: {signal: "gravityX"} },
              // { force: "y", y: "yfocus", strength: {signal: "gravityY"} },
              {
                force: "collide",
                radius: { signal: "nodeRadius" }
              },
              {
                force: "nbody",
                strength: { signal: "nodeCharge" }
              },
              {
                force: "link",
                links: "link-data",
                distance: { signal: "linkDistance" }
              }
            ]
          }
        ],
        zindex: 1
      },
      {
        type: "path",
        from: { data: "link-data" },
        interactive: false,
        encode: {
          update: {
            stroke: { value: "#ccc" },
            strokeWidth: { value: 0.5 }
          }
        },
        transform: [
          {
            type: "linkpath",
            require: { signal: "force" },
            shape: "line",
            sourceX: "datum.source.x",
            sourceY: "datum.source.y",
            targetX: "datum.target.x",
            targetY: "datum.target.y"
          }
        ]
      }
    ],
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
                  Not all nodes connected to this organisation are shown. Only 100 nodes are being shown
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
          spec={forceDirectedGraphSpec}
          data={{ "node-data": nodes, "link-data": links }}
          actions={false}
        />
      </div>
      {helpIcon()}
    </div>
  )
}

export default ForceDirectedGraph
