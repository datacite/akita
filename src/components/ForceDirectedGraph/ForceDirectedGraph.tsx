import React from 'react'
import { VegaLite } from 'react-vega'
import { VisualizationSpec } from 'vega-embed'

import EmptyChart from '../EmptyChart/EmptyChart'
import HelpIcon from '../HelpIcon/HelpIcon'

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
  range: string[]
  domain: string[]
}

const ForceDirectedGraph: React.FunctionComponent<Props> = ({ titleText, nodes, links, domain, range }) => {
  if (nodes.length==0){
    return <EmptyChart title={Array.isArray(titleText) ? titleText.join(' ') : titleText}/>
  }

  const forceDirectedGraphSpec: VisualizationSpec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 600,
    height: 250,
    autosize: "none",
    signals: [
      { name: "nodeRadius", value: 10}, // , bind: {input: "range", min: 0, max: 50, step: 1} },
      { name: "nodeCharge", value: -30}, // , bind: {input: "range", min: -100, max: 30, step: 1} },
      { name: "linkDistance", value: 20}, // , bind: {input: "range", min: 5, max: 100, step: 1} },
      { name: "static", value: true}, // , bind: {input: "checkbox"} },
      { name: "cx", update: "width / 2" },
      { name: "cy", update: "height / 2" },
      { name: "gravityX", value: 0.05}, // , bind: {input: "range", min: 0, max: 0.1} },
      { name: "gravityY", value: 0.12}, // , bind: {input: "range", min: 0, max: 0.2} },
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
    data: [ { name: "nodeData" }, { name: "linkData" } ],
    scales: [
      {
        name: "color",
        type: "ordinal",
        domain: domain,
        range: range,
      }
    ],
    marks: [
      {
        name: "nodes",
        type: "symbol",
        from: { data: "nodeData" },
        encode: {
          enter: {
            fill: { scale: "color", field: "group" },
            xfocus: {signal: "cx"},
            yfocus: {signal: "cy"}
          },
          update: {
            size: { signal: "2 * nodeRadius * nodeRadius" },
            tooltip: {
              signal: "{title: datum.name, Type: datum.group}"
            },
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
              { force: "x", x: "xfocus", strength: {signal: "gravityX"} },
              { force: "y", y: "yfocus", strength: {signal: "gravityY"} },
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
                links: "linkData",
                distance: { signal: "linkDistance" }
              }
            ]
          }
        ],
        zindex: 1
      },
      {
        type: "path",
        from: {data: "linkData"},
        interactive: false,
        encode: {
          update: {stroke: {value: "#ccc"}, strokeWidth: {value: 0.5}}
        },
        transform: [
          {
            type: "linkpath",
            require: {signal: "force"},
            shape: "line",
            sourceX: "datum.source.x",
            sourceY: "datum.source.y",
            targetX: "datum.target.x",
            targetY: "datum.target.y"
          }
        ],
      }
    ],
    config: {
      legend: {
        orient: 'bottom'
      }
    }
  }

  return (
    <div className="panel panel-transparent">
      <div className="panel-body" style={{ font: 'Source Sans Pro', fontSize: 21, color: '#1abc9c' }}>
        {titleText}
        <HelpIcon text='Not all nodes connected to this organisation are shown. Only 100 nodes are being shown' />
      </div>
      <div className="panel-body production-chart">
        <VegaLite
          renderer="svg"
          spec={forceDirectedGraphSpec}
          data={{ "nodeData": nodes, "linkData": links }}
          actions={false}
        />
      </div>
    </div>
  )
}

export default ForceDirectedGraph
