import { VisualizationSpec } from 'vega-embed'
import { resourceTypeDomain, resourceTypeRange } from '../../data/color_palettes'
import { BaseData, Mark, Scale } from 'vega'


const STACK_WIDTH = 6
const GROUP_OFFSET = 4



export interface SankeyGraphData {
  data: string[]
  count: number
}




const metaTransform: BaseData['transform'] = [
	{ type: "formula", expr: "length(datum.data)", as: "columns" },
	{ type: "aggregate", fields: ["count", "columns"], ops: ["sum", "max"], as: ["total", "columnCount"]}
]




///// Nodes Transform ///////////////////////////
const nodeTransform: BaseData['transform'] = [
	{ type: "formula", expr: "join(datum.data, '->')", as: "id" },
	{ type: "flatten", fields: ["data"], index: "stack" },
	{ type: "formula", expr: "datum.data + ' : ' + datum.id", as: "id"},
	{
		type: "stack",
		groupby: ["data"],
		field: "count",
		sort: { field: "count", order: "ascending" }
	},
	{ type: "formula", expr: "(datum.y0+datum.y1)/2", as: "yc" },
]




///// Groups Transform //////////////////////////
const groupStacksTransform: BaseData['transform'] = [
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
	}
]


const groupIndicesTransform: BaseData['transform'] = [
	{ type: "collect", sort: { field: [ "stack", "count" ] } },
	{ type: "aggregate", groupby: ["stack"], fields: ["data"], ops: ["values"], as: ["groups"] },
	{ type: "flatten", fields: ["groups"], as: ["group"], index: "index"},
	{ type: "project", fields: ["group.data", "index"], as: ["group", "index"]}
]


const groupTransform: BaseData['transform'] = [
	{ type: "lookup", from: "groupIndices", key: "group", fields: ["data"], values: ["index"] },
	{ type: "formula", expr: `datum.y0 + (datum.index * ${GROUP_OFFSET})`, as: "y0" },
	{ type: "formula", expr: `datum.y1 + (datum.index * ${GROUP_OFFSET})`, as: "y1" },
]




///// Links Transform ///////////////////////////
const linkTransform: BaseData['transform'] = [
	{ type: "formula", expr: "join(datum.data, '->')", as: "id" },
	{ type: "flatten", fields: ["data"], as: ["target"], index: "targetStack" },
	{ type: "filter", expr: "datum.targetStack != 0" },

	{ type: "formula", expr: "datum.data[datum.targetStack - 1]", as: "source" },
	{ type: "formula", expr: "datum.source + ' : ' + datum.id", as: "sourceId" },
	{ type: "formula", expr: "datum.target + ' : ' + datum.id", as: "targetId" },

	{ type: "lookup", from: "nodes", key: "id", fields: ["sourceId"], values: ["yc", "y0", "y1"], as: ["ycNodeSource", "y0", "y1"] },
	{ type: "lookup", from: "nodes", key: "id", fields: ["targetId"], values: ["yc"], as: ["ycNodeTarget"] },
	{ type: "lookup", from: "groups", key: "data", fields: ["source"], values: ["y0"], as: ["yGroupSource"] },
	{ type: "lookup", from: "groups", key: "data", fields: ["target"], values: ["y0"], as: ["yGroupTarget"] },

	{ type: "formula", expr: "scale('y', datum.y0) - scale('y', datum.y1)", as: "strokeWidth" },

	{
		type: "linkpath",
		orient: "horizontal",
		shape: "diagonal",
		sourceX: { expr: `scale('x', datum.targetStack - 1) + ${STACK_WIDTH}` },
		targetX: { expr: "scale('x', datum.targetStack)" },

		sourceY: { expr: "scale('y', datum.yGroupSource + datum.ycNodeSource)" },
		targetY: { expr: "scale('y', datum.yGroupTarget + datum.ycNodeTarget)" },
	}
]




///// Marks /////////////////////////////////////
const groupMarks: Mark = {
	type: "rect",
	name: "groupMarks",
	from: { data: "groups" },

	encode: {
		enter: {
			width: { value: STACK_WIDTH },

			fill: { value: '#243B54' },
			fillOpacity: { value: 0.6 },
			tooltip: { signal: "datum.data + '   ' + round(datum.count) + '   (' + format(datum.count / data('meta')[0].total, '.0%') + ')'" }
		},

		update: {
			x: { scale: "x", field: "stack" },
			y: { signal: "scale('y', datum.y0)" },
			y2: { signal: "scale('y', datum.y1)" },
			fillOpacity: { value: 0.6 },
		},

		hover: { fillOpacity: { value: 1 } }
	}
}


const groupLabels: Mark = {
	type: "text",
	name: "labelMarks",
	from: { data: "groups" },

	encode: {
		enter: {
			align: { signal: "datum.stack == 0 ? 'left' : 'right'" },
			baseline: { value: "middle" },
			
			fill: { value: "black" },

			font: { value: "Source Sans Pro" },
			fontSize: { value: 16 },

			stroke: { value: "white" },
			strokeWidth: { value: 0.2 }
		},

		update: {
			text: { signal: "scale('y', datum.y0) - scale('y', datum.y1) > 13 ? datum.data : ''" },
			
			x: { signal: `scale('x', datum.stack) + (datum.stack == 0 ? ${STACK_WIDTH} + 4 : -4)` },
			yc: { signal: "scale('y', (datum.y0 + datum.y1) / 2)" },
		}
	},

	interactive: false,
	zindex: 10
}


const linkMarks: Mark = {
	type: "path",
	name: "linkMarks",
	from: { data: 'links' },
	clip: true,
	encode: {
		enter: {
			strokeWidth: { field: "strokeWidth" },
		},

		update: {
			path: { field: "path" },

			stroke: { scale: "color", signal: "datum.data[data('meta')[0].columnCount - 1]" },
			strokeOpacity: { signal: "indexof(datum.id, onHover.data) > -1 ? 1 : 0.6" },

			zindex: { signal: "indexof(datum.id, onHover.data) > -1 ? 100 : 1" },
			tooltip: { signal: "join(datum.data, ' → ') + ': ' + datum.count + ' (' + format(datum.count / data('meta')[0].total, '.0%') + ')'"}
		}
	}
}




///// Scales ////////////////////////////////////
const horizontalScale: Scale = {
	name: "x",
	type: "point",
	domain: { data: "nodes", field: "stack" },
	range: "width"
}

const verticalScale: Scale = {
	name: "y",
	type: "linear",
	domain: { data: "groups", fields: ["y1"] },
	range: "height"
}





const sankeySpec = (width = 500, height = 300, domain = resourceTypeDomain, range = resourceTypeRange): VisualizationSpec => ({
	$schema: "https://vega.github.io/schema/vega/v5.0.json",
	width: width,
	height: height,
	data: [
		{ name: "rawData" },
		{ name: "meta", source: "rawData", transform: metaTransform },


		{ name: "nodes", source: "rawData", transform: nodeTransform },

		{ name: "groupStacks", source: "nodes", transform: groupStacksTransform },
		{ name: "groupIndices", source: "groupStacks", transform: groupIndicesTransform },
		{ name: "groups", source: "groupStacks", transform: groupTransform },

		{ name: "links", source: "rawData", transform: linkTransform }
	],    
	scales: [
		{ name: "color", type: "ordinal", domain: domain, range: range },
		horizontalScale,
		verticalScale
	],
	marks: [ groupMarks, groupLabels, linkMarks ],
	signals: [
		{
			name: "onHover",
			value: { },
			on: [
				{ events: "@groupMarks:mouseover", update: "{ data: datum.data }" },
				{ events: "@linkMarks:mouseover", update: "{ data: datum.id }" },
				{ events: "mouseout", update: "{ }" }
			]
		}
	]
})




export default sankeySpec
