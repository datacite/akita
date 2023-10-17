import { VisualizationSpec } from 'vega-embed'
import { resourceTypeDomain, resourceTypeRange } from '../../data/color_palettes'
import { Mark, Scale, Signal } from 'vega'



export const TEST_NODES: ForceDirectedGraphNode[] = [
	{ title: 'Preprint',        count:    22357 },
	{ title: 'Software',        count:   136204 },
	{ title: 'Dataset',         count:  7524645 },
	{ title: 'Organization',    count:    97795 },
	{ title: 'Journal Article', count: 14043135 },
	{ title: 'Person',          count:  8718993 }
]

export const TEST_LINKS: ForceDirectedGraphLink[] = [
	{ source: 'Preprint',        target: 'Software',        count: 7992 },
	{ source: 'Preprint',        target: 'Dataset',         count: 68292 },
	{ source: 'Preprint',        target: 'Journal Article', count: 25263 },

	{ source: 'Software',        target: 'Dataset',         count: 1983 },
	{ source: 'Software',        target: 'Person',          count: 28612 },
	{ source: 'Software',        target: 'Organization',    count: 24 },

	{ source: 'Dataset',         target: 'Organization',    count: 11657 },
	{ source: 'Dataset',         target: 'Person',          count: 546454 },
	{ source: 'Dataset',         target: 'Journal Article', count: 387906 },
	
	{ source: 'Organization',    target: 'Journal Article', count: 1777 },
	{ source: 'Organization',    target: 'Person',          count: 3009 },

	{ source: 'Journal Article', target: 'Person',          count: 3847926 },
	{ source: 'Journal Article', target: 'Journal Article', count: 2043502 },
]



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

	// Parameter bindings
	{ name: "scale", value: 40, bind: { input: "range", min: 1, max: 100, step: 1 } },
	{ name: "nodeCharge", value: -30, bind: { input: "range", min: -100, max: 30, step: 1 } },
	{ name: "linkDistance", value: 1, bind: { input: "range", min: 1, max: 100, step: 1 } },

	{ name: "static", value: false, bind: { input: "checkbox" } },


	// Hovered item signal
	{
		name: "selected",
		value: null,
		on: [
			{ events: "@nodes:mouseover", update: "datum.title" },
			{ events: "@links:mouseover", update: "datum.id" },
			{ events: "mouseout", update: "null" }
		]
	},


	// Force specific signals
	{ name: "cx", update: "width / 2" },
	{ name: "cy", update: "height / 2" },
	
	{
		name: "fix",
		description: "State variable for active node fix status.",
		value: false,
		on: [
			{ events: "symbol:mouseout[!event.buttons], window:mouseup", update: "false" },
			{ events: "symbol:mouseover", update: "fix || true" },
			{
				events: "[symbol:mousedown, window:mouseup] > window:mousemove!",
				update: "xy()",
				force: true
			}
		]
	},
	{
		name: "node",
		description: "Graph node most recently interacted with.",
		value: null,
		on: [{ events: "symbol:mouseover", update: "fix === true ? item() : node" }]
	},
	{
		name: "restart",
		description: "Flag to restart Force simulation upon data changes.",
		value: false,
		on: [{ events: { signal: "fix" }, update: "fix && fix.length" }]
	}
]




///// Scales ////////////////////////////////////
const sizeScale: Scale = {
	name: "size",
	type: "log",
	domain: { fields: [
		{ data: "nodeData", field: "count" },
		{ data: "linkData", field: "count" }
	]}
}




///// Marks /////////////////////////////////////
const nodeMarks: Mark = {
	name: "nodes",
	type: "symbol",
	from: { data: "nodeData" },

	transform: [{
		type: "force",

		forces: [
			{ force: "center", x: { signal: "cx" }, y: { signal: "cy" } },
			{ force: "collide", radius: { signal: "scale" } },
			{ force: "nbody", strength: { signal: "nodeCharge" } },
			{ force: "link", links: "linkData", id: "datum.title", distance: { signal: "linkDistance * scale" } },
		],

		iterations: 300,
		signal: "force",
		restart: { signal: "restart" },
		static: { signal: "static" },
	}],

	encode: {
		enter: {
			fill: { scale: "color", field: "title" },
			stroke: { value: 'black' },
			strokeWidth: { value: 1 }
		},

		update: {
			size: { signal: "2 * scale('size', datum.count) * scale('size', datum.count) * scale * scale" },
			fillOpacity: { signal: "selected ? indexof(selected, datum.title) > -1 ? 1 : 0.6 : 0.6" },

			tooltip: { signal: "datum.title + ': ' + format(datum.count, ',')" },
			cursor: { value: "pointer" }
		}
	},

	on: [
		{ trigger: "fix", modify: "node", values: "fix === true ? { fx: node.x, fy: node.y } : {fx: fix[0], fy: fix[1]}" },
		{ trigger: "!fix", modify: "node", values: "{ fx: null, fy: null }" }
	],
	
	zindex: 1
}


const linkMarks: Mark = {
	name: "links",
	type: "path",
	from: { data: "linkIds" },

	transform: [
		{
			type: "linkpath",
			shape: "line",
			
			require: { signal: "force" },

			sourceX: "datum.source.x",
			sourceY: "datum.source.y",
			targetX: "datum.target.x",
			targetY: "datum.target.y"
		}
	],

	encode: {
		enter: {
			stroke: { value: "#ccc" },
			strokeCap: { value: "round" }
		},

		update: {
			strokeWidth: { signal: "scale('size', datum.count) * scale" },
			strokeOpacity: { signal: "indexof(datum.id, selected) > -1 ? 1 : 0.6" },

			tooltip: { signal: "datum.id + ': ' + format(datum.count, ',')" }
		}
	}
}





const forceDirectedGraphSpec = (width = 500, domain = resourceTypeDomain.concat(['Person', 'Organization']), range = resourceTypeRange.concat(['#A83', '#FAD'])): VisualizationSpec => ({
	$schema: "https://vega.github.io/schema/vega/v5.json",
	width: width,
	height: 300,
	autosize: "none",
	
	data: [
		{ name: "nodeData" },
		{ name: "linkData" },
		{ name: "linkIds", source: "linkData", transform: [{ type: "formula", expr: "datum.source + ' ⇄ ' + datum.target", as: "id", initonly: true }]}
	],

	signals: signals,
	scales: [ sizeScale, { name: "color", type: "ordinal", domain: domain, range: range } ],
	marks: [ nodeMarks, linkMarks ]
})




export default forceDirectedGraphSpec
