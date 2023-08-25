import { VisualizationSpec } from 'vega-embed'
import { resourceTypeDomain, resourceTypeRange } from '../../data/color_palettes'
import { BaseData, Mark } from 'vega'



const STACK_WIDTH = 8


export interface SankeyGraphData {
  data: string[]
  count: number
}


// const BUTTON_MARK: Mark = {
//   // Create a "show all" button shown only when a group is selected.
//   type: "group",
//   data: [
//     // Show only when groupSelector signal is true
//     {
//       name: "dataForShowAll",
//       values: [{}],
//       transform: [{ type: "filter", expr: "groupSelector" }]
//     }
//   ],
//   encode: {
//     enter: {
//       xc: { signal: "width/2" },
//       y: { value: 30 },
//       width: { value: 80 },
//       height: { value: 30 }
//     }
//   },
//   marks: [
//     {
//       // This group is shown as a button with rounded corners.
//       type: "group",
//       name: "groupReset",
//       from: { data: "dataForShowAll" },
//       encode: {
//         enter: {
//           cornerRadius: { value: 6 },
//           fill: { value: "#f5f5f5" },
//           stroke: { value: "#c1c1c1" },
//           strokeWidth: { value: 2 },
//           height: { field: { group: "height" } },
//           width: { field: { group: "width" } }
//         },
//         update: { opacity: {value: 1} },
//         hover: { opacity: {value: 0.7} }
//       },
//       marks: [
//         {
//           type: "text",
//           interactive: false,
//           encode: {
//             enter: {
//               xc: { field: {group: "width"}, mult: 0.5 },
//               yc: { field: {group: "height"}, mult: 0.5, groupOffset: 2 },
//               align: { value: "center" },
//               baseline: { value: "middle" },
//               fontWeight: { value: "bold" },
//               text: { value: "Show All" }
//             }
//           }
//         }
//       ]
//     }
//   ]
// }





/**** Raw Nodes Transform ***********************
[
	{ data: ['Name 1', 'Dataset'],  count: 1 }
	{ data: ['Name 1', 'Software'], count: 2 }
	{ data: ['Name 2', 'Dataset'],  count: 2 }
]
			V V V Flatten and stackV V V
[
	{ data: 'Name 1',   count: 1, stack: 0,  y0: x, y1: x }
	{ data: 'Dataset',  count: 1, stack: 1,  y0: x, y1: x }
	{ data: 'Name 1',   count: 2, stack: 0,  y0: x, y1: x }
	{ data: 'Software', count: 2, stack: 1,  y0: x, y1: x }
	{ data: 'Name 2',   count: 2, stack: 0,  y0: x, y1: x }
	{ data: 'Dataset',  count: 2, stack: 1,  y0: x, y1: x }
]
*/
const unscaledNodeTransform: BaseData['transform'] = [
	{ type: "formula", expr: "join(datum.data, '->')", as: "id" },
	{ type: "flatten", fields: ["data"], index: "stack" },
	{ type: "formula", expr: "datum.data + ' : ' + datum.id", as: "id"},
	{
		type: "stack",
		groupby: ["data"],
		field: "count",
		sort: { field: "count", order: "descending" }
	},
]


const nodeTransform: BaseData['transform'] = [
	{ type: "formula", expr: "datum.y0", as: "y0" },
	{ type: "formula", expr: "datum.y1", as: "y1" },
	{ type: "formula", expr: "(datum.y0+datum.y1)/2", as: "yc" },
	{ type: "formula", expr: "datum.count/domain('y')[1]", as: "percentage" },
]




/**** Groups Transform **************************
[
	{ data: 'Name 1',   count: 1, stack: 0, y0: y0, y1: y1, yc: yc, percentage: x }
	{ data: 'Dataset',  count: 1, stack: 1, y0: y0, y1: y1, yc: yc, percentage: x }
	{ data: 'Name 1',   count: 2, stack: 0, y0: y0, y1: y1, yc: yc, percentage: x }
	{ data: 'Software', count: 2, stack: 1, y0: y0, y1: y1, yc: yc, percentage: x }
	{ data: 'Name 2',   count: 2, stack: 0, y0: y0, y1: y1, yc: yc, percentage: x }
	{ data: 'Dataset',  count: 2, stack: 1, y0: y0, y1: y1, yc: yc, percentage: x }
]
      V V V Aggregate V V V
[
	{ data: 'Name 1',   count: 3, stack: 0,  y0: y0, y1: y1, yc: yc, percentage: x }
	{ data: 'Dataset',  count: 3, stack: 1,  y0: y0, y1: y1, yc: yc, percentage: x }
	{ data: 'Software', count: 2, stack: 1,  y0: y0, y1: y1, yc: yc, percentage: x }
	{ data: 'Name 2',   count: 2, stack: 0,  y0: y0, y1: y1, yc: yc, percentage: x }
]
*/
const unscaledGroupTransform: BaseData['transform'] = [
	{
		type: "aggregate",
		groupby: ["data", "stack"],
		fields: ["count"],
		ops: ["sum"],
		as: ["count"]
	},
	{
		type: "stack",
		groupby: ["stack"],
		field: "count",
		sort: { field: "count", order: "ascending" }
	},
]


const groupTransform: BaseData['transform'] = [
	{ type: "formula", expr: "scale('groupY', datum.y0)", as: "y0" },
	{ type: "formula", expr: "scale('groupY', datum.y1)", as: "y1" },
	{ type: "formula", expr: "(datum.y0 + datum.y1) / 2", as: "yc" }
]


const groupMark: Mark = {
	type: "rect",
	name: "groupMark",
	from: { data: "groups" },

	encode: {
		enter: {
			width: { value: STACK_WIDTH },

			fill: { value: 'gray' },
			fillOpacity: { value: 0.6 },

			// stroke: { value: 'black' },
			// strokeWidth: { value: 1 },
			
			// cornerRadius: { value: 15 }
		},

		update: {
			x: { scale: "x", field: "stack" },
			y: { signal: "datum.y0" },
			y2: { signal: "datum.y1" },
			fillOpacity: { value: 0.6 },
			tooltip: { signal: "datum.data + '   ' + round(datum.count) + '   (' + format(datum.count / data('meta')[0].total, '.0%') + ')'" }
		},

		hover: { fillOpacity: { value: 1 } }
	}
}


const groupLabels: Mark = {
	type: "text",
	name: "labelMark",
	from: { data: "groups" },

	encode: {
		update: {
			text: { signal: "abs(datum.y0-datum.y1) > 13 ? datum.data : ''" },
			font: { value: "Source Sans Pro" },
			fontSize: { value: 14 },
			fontWeight: { value: "normal" },
			fill: { value: "black" },
			baseline: { value: "middle" },
			
			align: { signal: "datum.stack == 0 ? 'left' : 'right'" },
			x: { signal: "scale('x', datum.stack) + (datum.stack == 0 ? bandwidth('x') + 10 : -5)" },
			yc: { signal: "(datum.y0 + datum.y1) / 2" },
		}
	},

	interactive: false,
	zindex: 10
}





/**** Links Transform ***************************/
const linkTransform: BaseData['transform'] = [
	{ type: "formula", expr: "join(datum.data, '->')", as: "id" },
	{ type: "flatten", fields: ["data"], as: ["target"], index: "targetStack" },
	{ type: "filter", expr: "datum.targetStack != 0" },

	{ type: "formula", expr: "datum.data[datum.targetStack - 1]", as: "source" },
	{ type: "formula", expr: "datum.source + ' : ' + datum.id", as: "sourceId" },
	{ type: "formula", expr: "datum.target + ' : ' + datum.id", as: "targetId" },

	{ type: "lookup", from: "nodes", key: "id", fields: ["sourceId"], values: ["y0", "y1", "yc"], as: ["y0Source", "y1Source", "ycSource"] },
	{ type: "lookup", from: "nodes", key: "id", fields: ["targetId"], values: ["y0", "y1", "yc"], as: ["y0Target", "y1Target", "ycTarget"] },
	{ type: "lookup", from: "groups", key: "data", fields: ["source"], values: ["y0", "y1", "count"], as: ["y0GroupSource", "y1GroupSource", "countGroupSource"] },
	{ type: "lookup", from: "groups", key: "data", fields: ["target"], values: ["y0", "y1", "count"], as: ["y0GroupTarget", "y1GroupTarget", "countGroupTarget"] },

	// { type: "formula", expr: "height - scale('groupY', datum.count)", as: "strokeWidth" },
	{ type: "formula", expr: "(datum.y0GroupSource - datum.y1GroupSource) * (datum.count / datum.countGroupSource)", as: "strokeWidth" },

	{
		type: "linkpath",
		orient: "horizontal",
		shape: "diagonal",
		sourceX: { expr: `scale('x', datum.targetStack - 1) + ${STACK_WIDTH}` },
		targetX: { expr: "scale('x', datum.targetStack)" },

		// sourceY: { expr: "height - (scale('groupY', datum.ycSource) - datum.y1GroupSource)" },
		sourceY: { expr: "(datum.strokeWidth / 2) + (datum.y0GroupSource - datum.y1GroupSource) * (datum.y0Source / datum.countGroupSource) + datum.y1GroupSource" },
		// targetY: { expr: "height - (scale('groupY', datum.ycTarget) - datum.groupOffsetTarget)" }
		targetY: { expr: "(datum.strokeWidth / 2) + (datum.y0GroupTarget - datum.y1GroupTarget) * (datum.y0Target / datum.countGroupTarget) + datum.y1GroupTarget" },
	}
]


const linkMark: Mark = {
	type: "path",
	name: "linkMark",
	from: { data: 'links' },
	clip: true,
	encode: {
		enter: {
			strokeWidth: { field: "strokeWidth" },
		},

		update: {
			path: { field: "path" },

			stroke: { scale: "color", signal: "datum.data[data('meta')[0].columns - 1]" },
			strokeOpacity: { signal: "indexof(datum.id, onHover.data) > -1 ? 1 : 0.6" },

			zindex: { signal: "indexof(datum.id, onHover.data) > -1 ? 100 : 1" },
			tooltip: { signal: "join(datum.data, ' → ') + ': ' + datum.count + ' (' + format(datum.count / data('meta')[0].total, '.0%') + ')'"} // { signal: "datum.data[datum.targetStack - 1] + ' → ' + datum.data[datum.targetStack] + ': ' + datum.count" }
		}
	}
}



const sankeySpec: VisualizationSpec = {
	$schema: "https://vega.github.io/schema/vega/v5.0.json",
	width: 500,
	height: 300,
	data: [
		{ name: "rawData" },
		{ name: "meta", source: "rawData", transform: [
			{ type: "formula", expr: "length(datum.data)", as: "columns" },
			{ type: "aggregate", fields: ["count", "columns"], ops: ["sum", "max"], as: ["total", "columns"]}
		] },

		{ name: "unscaledNodes", source: "rawData", transform: unscaledNodeTransform },
		{ name: "nodes", source: "unscaledNodes", transform: nodeTransform},

		{ name: "unscaledGroups", source: "nodes", transform: unscaledGroupTransform },
		{ name: "groups", source: "unscaledGroups", transform: groupTransform },

		{ name: "links", source: "rawData", transform: linkTransform }
	],    
	scales: [
		{
			name: "color",
			type: "ordinal",
			range: resourceTypeRange,
			domain: resourceTypeDomain
		},
		{
			// Calculate horizontal stack positioning
			name: "x",
			type: "point",
			domain: { data: "nodes", field: "stack" },
			range: "width",
		},
		{
			// This scale goes up as high as the highest y1 value of all nodes
			name: "y",
			type: "linear",
			range: "height",
			// domain: { data: "unscaledNodes", field: "y1" }
			domain: { data: "meta", field: "total" }
			// domain: { signal: "[0, data('meta').total]" }
		},
		{
			name: "nodeY",
			type: "linear",
			range: "height",
			domain: { data: "unscaledNodes", field: "y1" }
		},
		{
			name: "groupY",
			type: "linear",
			range: "height",
			domain: { data: "unscaledGroups", field: "y1" },
		}
	],
	marks: [
		groupMark,
		groupLabels,
		linkMark
		// BUTTON_MARK
	],
	signals: [
		{
			name: "onHover",
			value: {  },
			on: [
				{
					events: "@groupMark:mouseover",
					update: "{ data: datum.data }"
				},
				{
					events: "@linkMark:mouseover",
					update: "{ data: datum.id }"
				},
				{events: "mouseout", update: "{}"}
			]
		},
		// {
		// 	name: "groupSelector",
		// 	value: false,
		// 	on: [
		// 		{
		// 			events: "@nodeMark:click!",
		// 			update: "{stack:datum.stack, stk1:datum.stack=='stk1' && datum.grpId, stk2:datum.stack=='stk2' && datum.grpId, stk3:datum.stack=='stk3' && datum.grpId, stk4:datum.stack=='stk4' && datum.grpId}"
		// 		},
		// 		{
		// 			events: [
		// 				{type: "click", markname: "groupReset"},
		// 				{type: "dblclick"}
		// 			],
		// 			update: "false"
		// 		}
		// 	]
		// }
	]
}


export default sankeySpec
