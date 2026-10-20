// Shared colours and axis styling for the Recharts-based charts.

export const CHART_PRIMARY = '#1abc9c'
export const CHART_HIGHLIGHT = '#34495e'
export const CHART_FALLBACK = '#bdc3c7'

export const AXIS_TICK = { fontSize: 11, fill: '#666' }
export const AXIS_LINE = { stroke: '#888' }

export const integerFormat = (value: number | string) =>
  Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 })
