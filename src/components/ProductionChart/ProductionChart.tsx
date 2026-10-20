'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

import ChartPanel from 'src/components/ChartPanel/ChartPanel'
import ChartTooltip from 'src/components/ChartPanel/ChartTooltip'
import {
  AXIS_LINE,
  AXIS_TICK,
  CHART_HIGHLIGHT,
  integerFormat
} from 'src/components/ChartPanel/chartTheme'

interface ChartRecord {
  title: string
  count: number
}

type Props = {
  title: string
  data: ChartRecord[]
  lowerBoundYear?: number
  color?: string
}

interface YearCount {
  year: number
  count: number
}

// One bar per year from lowerBoundYear up to and including the current year,
// with missing years filled in as 0 so the axis has no gaps.
function toYearSeries(data: ChartRecord[], lowerBoundYear: number, endYear: number): YearCount[] {
  const counts = new Map<number, number>()
  data.forEach((d) => {
    const year = Number(d.title)
    if (!Number.isNaN(year)) counts.set(year, (counts.get(year) ?? 0) + d.count)
  })

  const series: YearCount[] = []
  for (let year = lowerBoundYear; year < endYear; year++) {
    series.push({ year, count: counts.get(year) ?? 0 })
  }
  return series
}

export default function ProductionChart({ title, data, lowerBoundYear, color }: Props) {
  // exclusive upper bound: the bar for the current year is included
  const endYear = new Date().getFullYear() + 1

  // lower bound year should be multiple of 5
  const lowerBound = lowerBoundYear ?? Math.floor((endYear - 10) / 5) * 5
  const fill = color ?? 'var(--datacite-color-primary, #1abc9c)'

  const series = toYearSeries(data, lowerBound, endYear)

  return (
    <ChartPanel
      title={title}
      isEmpty={data.length == 0}
      height={220}
      className="production-chart"
    >
      <BarChart data={series} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
        <XAxis
          dataKey="year"
          interval={0}
          tickFormatter={(year: number) => (year % 5 === 0 ? String(year) : '')}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={AXIS_LINE}
        />
        <YAxis
          allowDecimals={false}
          tickFormatter={integerFormat}
          tick={AXIS_TICK}
          axisLine={AXIS_LINE}
          width={45}
        />
        <Tooltip
          cursor={false}
          content={
            <ChartTooltip formatValue={(item) => integerFormat(Number(item.value))} />
          }
        />
        <Bar
          dataKey="count"
          name="Works"
          fill={fill}
          activeBar={{ fill: CHART_HIGHLIGHT }}
          cursor="pointer"
          isAnimationActive={false}
        />
      </BarChart>
    </ChartPanel>
  )
}
