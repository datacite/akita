import { VisualizationSpec } from "react-vega";

const stackedBarChartSpec = (width = 300, domain: string[] = [], range: string[] = []): VisualizationSpec => ({
  $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
  data: { name: 'rawData' },
  width: width,
  height: 50,
  mark: {
    type: 'bar',
    tooltip: { signal: "datum.title + ': ' + round((datum.sum_count_end - datum.sum_count_start) * 100) + '%'" },
    height: 50,
    baseline: 'middle'
  },
  encoding: {
    x: {
      aggregate: 'sum',
      field: 'count',
      stack: 'normalize',
      type: 'quantitative',
      axis: { format: '.0%', domainColor: 'lightgray', tickColor: 'lightgray' },
      title: ''
    },
    color: {
      field: 'title',
      type: 'nominal',
      scale: { domain: domain, range: range },
      sort: { field: 'title', order: 'ascending', op: 'count'},
      title: ''
    },
    order: {
      field: 'count',
      aggregate: 'sum',
      sort: 'descending'
    },
  },
  config: {
    legend: {
      orient: 'bottom',
      direction: 'horizontal',
      columns: 4
    }
  }
})


export default stackedBarChartSpec