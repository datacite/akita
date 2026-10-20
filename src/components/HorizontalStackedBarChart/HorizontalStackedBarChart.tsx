'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

import ChartPanel from 'src/components/ChartPanel/ChartPanel'
import ChartTooltip from 'src/components/ChartPanel/ChartTooltip'
import HelpIcon from 'src/components/HelpIcon/HelpIcon'
import { AXIS_TICK, CHART_FALLBACK } from 'src/components/ChartPanel/chartTheme'
import styles from './HorizontalStackedBarChart.module.scss'

type Props = {
  chartTitle: string
  topCategory: { title: string, percent: number }
  data: HorizontalBarRecord[]
  range: string[]
  domain: string[]
  tooltipText?: string
}

export interface HorizontalBarRecord {
  title: string
  count: number
}

interface Segment extends HorizontalBarRecord {
  key: string
  color: string
}

const percentOf = (count: number, total: number) =>
  total > 0 ? Math.round((count / total) * 100) : 0

// A single 100% stacked bar with a legend, using fixed category colours
// (domain[i] is drawn in range[i]).
const HorizontalBarChart: React.FunctionComponent<Props> = ({
  chartTitle,
  topCategory,
  data,
  range,
  domain,
  tooltipText
}) => {
  const total = data.reduce((sum, d) => sum + d.count, 0)

  // Largest segment first. Keys are synthetic because titles such as
  // "CC-BY-4.0" contain dots, which Recharts would read as a path.
  const segments: Segment[] = [...data]
    .sort((a, b) => b.count - a.count)
    .map((d, i) => {
      const index = domain ? domain.indexOf(d.title) : -1
      return { ...d, key: `s${i}`, color: index >= 0 && range[index] ? range[index] : CHART_FALLBACK }
    })

  const row: Record<string, number | string> = { name: chartTitle }
  segments.forEach((s) => { row[s.key] = s.count })

  const legend = [...segments].sort((a, b) => a.title.localeCompare(b.title))

  const header = (
    <>
      <div className={styles.chartText}>
        {chartTitle}
        {tooltipText && <HelpIcon text={tooltipText} padding={25} position='inline' color='#34495E' />}
      </div>
      <div className={styles.chartDetail}>
        <span className={styles.chartDetailText}>{topCategory.title}</span>
        <span className={styles.chartDetailText}>{topCategory.percent}%</span>
      </div>
    </>
  )

  const footer = (
    <ul className={styles.legend}>
      {legend.map((s) => (
        <li key={s.key} className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ backgroundColor: s.color }} />
          {s.title}
        </li>
      ))}
    </ul>
  )

  return (
    <ChartPanel
      header={header}
      footer={footer}
      isEmpty={data.length == 0}
      emptyTitle={`Percent ${chartTitle}`}
      height={80}
      className="production-chart"
    >
      <BarChart
        data={[row]}
        layout="vertical"
        stackOffset="expand"
        margin={{ top: 5, right: 10, bottom: 5, left: 10 }}
        barCategoryGap={0}
      >
        <XAxis
          type="number"
          domain={[0, 1]}
          ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
          tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
          tick={AXIS_TICK}
          axisLine={{ stroke: 'lightgray' }}
          tickLine={{ stroke: 'lightgray' }}
        />
        <YAxis type="category" dataKey="name" hide />
        <Tooltip
          shared={false}
          cursor={false}
          content={
            <ChartTooltip
              formatLabel={(_, item) => String(item.name ?? '')}
              formatValue={(item) => `${percentOf(Number(item.value), total)}%`}
            />
          }
        />
        {segments.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.title}
            stackId="all"
            fill={s.color}
            barSize={50}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ChartPanel>
  )
}

export default HorizontalBarChart
