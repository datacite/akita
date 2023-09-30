import { VisualizationSpec } from 'vega-embed'
import { resourceTypeDomain, resourceTypeRange } from '../../data/color_palettes'


export interface ForceDirectedGraphNode {
  title: string
  group?: string
	count: number
}

export interface ForceDirectedGraphLink {
  source: number
  target: number
  value: number
}




const forceDirectedGraphSpec = (width = 500, domain = resourceTypeDomain, range = resourceTypeRange): VisualizationSpec => ({
	$schema: "https://vega.github.io/schema/vega/v5.json",
	width: width,
	height: 300,
	autosize: "none",
	signals: [
		{ name: "nodeRadius", value: 10, bind: { input: "range", min: 0, max: 50, step: 1 } },
		{ name: "nodeCharge", value: -30, bind: { input: "range", min: -100, max: 30, step: 1 } },
		{ name: "linkDistance", value: 20, bind: { input: "range", min: 5, max: 100, step: 1 } },

		{ name: "static", value: true, bind: { input: "checkbox" } },
		{ name: "cx", update: "width / 2" },
		{ name: "cy", update: "height / 2" },
		{ name: "gravityX", value: 0.05, bind: { input: "range", min: 0, max: 0.1 } },
		{ name: "gravityY", value: 0.12, bind: { input: "range", min: 0, max: 0.2 } },
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
			on: [
        { trigger: "fix", modify: "node", values: "fix === true ? { fx: node.x, fy: node.y } : {fx: fix[0], fy: fix[1]}" },
        { trigger: "!fix", modify: "node", values: "{ fx: null, fy: null }" }
      ],
			encode: {
				enter: {
					fill: { scale: "color", field: "group" },
					// xfocus: {signal: "cx"},
					// yfocus: {signal: "cy"}
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
})




export default forceDirectedGraphSpec