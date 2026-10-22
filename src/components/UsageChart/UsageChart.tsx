'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import {
  addMonths,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfMonth,
  startOfYear,
  subYears
} from 'date-fns'

import { pluralize } from 'src/utils/helpers'
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
  yearMonth: string
  total: number
}

type Props = {
  data?: ChartRecord[]
  doi?: string
  counts?: number
  publicationYear?: number
  type: string
}

interface MonthTotal {
  yearMonth: string // yyyy-MM
  total: number
}

const UsageChart: React.FunctionComponent<Props> = ({
  data,
  counts,
  publicationYear,
  type
}) => {
  const now = new Date()

  // Show at most the last three years. (Kept as before: publicationYear is a
  // year, so as a date it is always earlier than three years ago.)
  const threeYearsAgo = subYears(now, 3)
  const lowerBound = isAfter(publicationYear || 0, threeYearsAgo)
    ? publicationYear || 0
    : threeYearsAgo

  const totals = new Map<string, number>()
  ;(data ?? [])
    .filter((e) => {
      const chartDate = parseISO(e.yearMonth)
      return isAfter(chartDate, lowerBound) && isAfter(chartDate, publicationYear || 0)
    })
    .forEach((e) => totals.set(e.yearMonth, (totals.get(e.yearMonth) ?? 0) + e.total))

  // One bar per month from January of the lower-bound year to this month,
  // with missing months as 0 so the time axis has no gaps.
  const series: MonthTotal[] = []
  const lastMonth = startOfMonth(now)
  for (
    let month = startOfYear(lowerBound);
    !isBefore(lastMonth, month);
    month = addMonths(month, 1)
  ) {
    const key = format(month, 'yyyy-MM')
    series.push({ yearMonth: key, total: totals.get(key) ?? 0 })
  }

  const monthLabel = (yearMonth: string) => format(parseISO(yearMonth), 'MMM yyyy')

  return (
    <div className="panel panel-transparent">
      <div className="usage-chart panel-body">
        <Container>
          <Row>
            <div>
              {pluralize(counts || 0, type)} reported since publication in{' '}
              {publicationYear}.
            </div>
          </Row>
          <Row>
            <ChartPanel height={200} bare>
              <BarChart data={series} margin={{ top: 10, right: 10, bottom: 5, left: 10 }}>
                <XAxis
                  dataKey="yearMonth"
                  tickFormatter={monthLabel}
                  interval="preserveStartEnd"
                  minTickGap={24}
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={AXIS_LINE}
                />
                <YAxis hide />
                <Tooltip
                  isAnimationActive={false}
                  position={{ x: 0, y: 0 }}
                  cursor={false}
                  content={
                    <ChartTooltip
                      formatLabel={(label) => monthLabel(String(label))}
                      formatValue={(item) => integerFormat(Number(item.value))}
                    />
                  }
                />
                <Bar
                  dataKey="total"
                  name={type}
                  fill={CHART_PRIMARY}
                  activeBar={{ fill: CHART_HIGHLIGHT }}
                  cursor="pointer"
                  isAnimationActive={false}
                />
              </BarChart>
            </ChartPanel>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default UsageChart
