'use client'

import React from 'react'
import styles from './ChartPanel.module.scss'

export interface ChartTooltipItem {
  name?: string | number
  value?: number | string | (number | string)[]
  dataKey?: string | number | ((obj: unknown) => unknown)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}

type Props = {
  // Injected by Recharts' <Tooltip content={<ChartTooltip />} />
  active?: boolean
  payload?: readonly ChartTooltipItem[]
  label?: string | number
  // Our own formatting hooks
  formatLabel?: (label: string | number | undefined, item: ChartTooltipItem) => React.ReactNode
  formatValue?: (item: ChartTooltipItem) => React.ReactNode
}

// Brand tooltip shared by every chart: a label line and a value line.
export default function ChartTooltip({
  active,
  payload,
  label,
  formatLabel,
  formatValue
}: Props) {
  if (!active || !payload || payload.length === 0) return null
  const item = payload[0]

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipLabel}>
        {formatLabel ? formatLabel(label, item) : label}
      </div>
      <div className={styles.tooltipValue}>
        {formatValue ? formatValue(item) : String(item.value ?? '')}
      </div>
    </div>
  )
}
