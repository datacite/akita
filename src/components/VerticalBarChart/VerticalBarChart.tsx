'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

import ChartPanel from 'src/components/ChartPanel/ChartPanel'
import ChartTooltip from 'src/components/ChartPanel/ChartTooltip'
import {
  AXIS_LINE,
  AXIS_TICK,
  CHART_HIGHLIGHT,
  CHART_PRIMARY,
  integerFormat
} from 'src/components/ChartPanel/chartTheme'

interface ChartRecord {
  title: string
  count: number
  color?: string
}

type Props = {
  title: string
  data: ChartRecord[]
  color?: string
}

const MAX_BARS = 10
const LABEL_LENGTH = 9
const BAR_ROW_HEIGHT = 22

const truncate = (label: string) =>
  label.length > LABEL_LENGTH ? label.substring(0, LABEL_LENGTH) + '…' : label

// Top-10 horizontal bars (the name is historical), largest first, on a
// square-root scale so long tails stay visible.
export default function VerticalBarChart({ title, data, color }: Props) {
  const rows = [...data].sort((a, b) => b.count - a.count).slice(0, MAX_BARS)
  const height = Math.max(rows.length, 3) * BAR_ROW_HEIGHT + 40

  return (
    <ChartPanel
      title={title}
      isEmpty={data.length == 0}
      height={height}
      className="production-chart"
    >
      <BarChart
        data={rows}
        layout="vertical"
        margin={{ top: 5, right: 15, bottom: 5, left: 5 }}
      >
        <XAxis
          type="number"
          scale="sqrt"
          domain={[0, 'auto']}
          allowDecimals={false}
          tickCount={5}
          tickFormatter={integerFormat}
          tick={AXIS_TICK}
          axisLine={AXIS_LINE}
        />
        <YAxis
          type="category"
          dataKey="title"
          width={80}
          interval={0}
          tickFormatter={truncate}
          tick={AXIS_TICK}
          axisLine={AXIS_LINE}
        />
        <Tooltip
          cursor={false}
          content={
            <ChartTooltip formatValue={(item) => integerFormat(Number(item.value))} />
          }
        />
        <Bar
          dataKey="count"
          name={title}
          fill={color ?? CHART_PRIMARY}
          activeBar={{ fill: CHART_HIGHLIGHT }}
          cursor="pointer"
          isAnimationActive={false}
        />
      </BarChart>
    </ChartPanel>
  )
}
