'use client'

import React, { useMemo, useRef } from 'react'
import { ResponsiveContainer } from 'recharts'

import EmptyChart from 'src/components/EmptyChart/EmptyChart'
import HelpIcon from 'src/components/HelpIcon/HelpIcon'
import { ChartCursorContext, trackCursor, type Cursor } from './chartCursor'
import styles from './ChartPanel.module.scss'

type Props = {
  /** Shown as an h4 above the chart, and on the empty state. */
  title?: React.ReactNode
  /** Replaces the default h4 title when a chart needs its own header. */
  header?: React.ReactNode
  /** Adds a help icon next to the default title. */
  helpText?: string
  /** Renders the empty state instead of the chart. */
  isEmpty?: boolean
  /** Title used by the empty state (defaults to `title` when it is a string). */
  emptyTitle?: string
  /** Chart height in px; the width always follows the container. */
  height: number
  /** Extra class on the panel body, e.g. for tests or legacy styles. */
  className?: string
  /** Render only the sized chart, without the panel, title or empty state. */
  bare?: boolean
  /** Rendered below the chart (legends, notes). */
  footer?: React.ReactNode
  /** A single Recharts chart element (BarChart, …). */
  children: React.ReactElement
}

// Shared wrapper for every Recharts chart: title, help icon, empty state and
// responsive sizing, plus the mouse tracking for cursor-following tooltips
// (see chartCursor.ts). Replaces the per-chart window-resize code.
export default function ChartPanel({
  title,
  header,
  helpText,
  isEmpty = false,
  emptyTitle,
  height,
  className = '',
  footer,
  bare = false,
  children
}: Props) {
  const cursorRef = useRef<Cursor>(undefined)
  const tipRef = useRef<HTMLDivElement>(null)
  const cursor = useMemo(() => ({ cursorRef, tipRef }), [])

  const chart = (
    <ChartCursorContext.Provider value={cursor}>
      <div className={styles.chart} style={{ height }} onMouseMove={(e) => trackCursor(e, cursor)}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartCursorContext.Provider>
  )

  if (bare) return chart

  if (isEmpty) {
    return <EmptyChart title={emptyTitle ?? (typeof title === 'string' ? title : '')} />
  }

  return (
    <div className="panel panel-transparent">
      <div className={`panel-body ${className}`.trim()}>
        {header ?? (title && (
          <div className={`title text-center ${styles.title}`}>
            <h4>{title}</h4>
            {helpText && <HelpIcon text={helpText} position="inline" color="#34495E" />}
          </div>
        ))}
        {chart}
        {footer}
      </div>
    </div>
  )
}
