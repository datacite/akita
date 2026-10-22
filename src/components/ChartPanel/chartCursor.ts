'use client'

import React, { createContext } from 'react'

// Cursor-following tooltips. Recharts anchors tooltips to the hovered item and
// slides them between items; instead each chart pins Recharts' tooltip wrapper
// to the chart origin (`<Tooltip position={{ x: 0, y: 0 }} />`), ChartPanel
// tracks the mouse, and ChartTooltip is moved to the cursor directly in the
// DOM. Mouse moves never re-render the chart or remount the tooltip.

export type Cursor = { x: number, y: number, flipX: boolean, flipY: boolean }

export type ChartCursor = {
  cursorRef: React.RefObject<Cursor | undefined>
  tipRef: React.RefObject<HTMLDivElement | null>
}

export const ChartCursorContext = createContext<ChartCursor | null>(null)

const CURSOR_OFFSET = 14
const FLIP_BOTTOM_MARGIN = 70

// Place the tooltip next to the cursor, on the side with more room.
const shift = (flip: boolean) =>
  flip ? `calc(-100% - ${CURSOR_OFFSET}px)` : `${CURSOR_OFFSET}px`

export const cursorTransform = (cursor?: Cursor) => cursor
  ? `translate(${cursor.x}px, ${cursor.y}px) translate(${shift(cursor.flipX)}, ${shift(cursor.flipY)})`
  : undefined

export function trackCursor(e: React.MouseEvent<HTMLElement>, { cursorRef, tipRef }: ChartCursor) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  // Flip up near the bottom, unless the chart is too short to have room above.
  const flipY = y > rect.height - FLIP_BOTTOM_MARGIN && y > FLIP_BOTTOM_MARGIN
  cursorRef.current = { x, y, flipX: x > rect.width / 2, flipY }
  if (tipRef.current) tipRef.current.style.transform = cursorTransform(cursorRef.current) ?? ''
}
