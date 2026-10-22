'use client'

import React, { useRef } from 'react'
import { Sankey, Tooltip } from 'recharts'
import type { NodeProps, LinkProps } from 'recharts/types/chart/Sankey'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { RESOURCE_TYPE_DOMAIN, RESOURCE_TYPE_RANGE } from 'maltipoo'

import ChartPanel from 'src/components/ChartPanel/ChartPanel'
import ChartTooltip from 'src/components/ChartPanel/ChartTooltip'
import HelpIcon from 'src/components/HelpIcon/HelpIcon'
import { CHART_FALLBACK, CHART_HIGHLIGHT, integerFormat } from 'src/components/ChartPanel/chartTheme'
import type { SankeyGraphData, SankeyGraphNode } from './sankeyUtils'

import styles from './SankeyGraph.module.scss'

type Props = {
  titleText: string
  data: SankeyGraphData
  tooltipText?: string
}

const LABEL_WIDTH = 160
const MAX_LABEL_CHARS = 24
const ROW_HEIGHT = 34
const CURSOR_OFFSET = 14

type Cursor = { x: number, y: number, flipX: boolean, flipY: boolean }

// Place the tooltip next to the cursor, on the side with more room.
const cursorShift = (flip: boolean) =>
  flip ? `calc(-100% - ${CURSOR_OFFSET}px)` : `${CURSOR_OFFSET}px`

const cursorTransform = (cursor?: Cursor) => cursor
  ? `translate(${cursor.x}px, ${cursor.y}px) translate(${cursorShift(cursor.flipX)}, ${cursorShift(cursor.flipY)})`
  : undefined

type SankeyTooltipProps = React.ComponentProps<typeof ChartTooltip> & {
  tipRef: React.RefObject<HTMLDivElement | null>
  cursorRef: React.RefObject<Cursor | undefined>
}

// Recharts pins the tooltip wrapper to the chart's origin (see `position`
// below); this element is then moved to the cursor directly in the DOM, so
// mouse moves never re-render the chart or remount the tooltip.
function SankeyTooltip({ tipRef, cursorRef, ...props }: SankeyTooltipProps) {
  if (!props.active || !props.payload?.length) return null

  return (
    <div ref={tipRef} style={{ transform: cursorTransform(cursorRef.current) }}>
      <ChartTooltip
        {...props}
        formatLabel={(_, item) => {
          const p = item.payload?.payload ?? item.payload
          return p?.source && p?.target ? `${p.source.name} → ${p.target.name}` : String(item.name ?? '')
        }}
        formatValue={(item) => {
          const count = Number(item.value)
          return `${integerFormat(count)} ${count === 1 ? 'work' : 'works'}`
        }}
      />
    </div>
  )
}

const typeColor = (name: string) => {
  const index = RESOURCE_TYPE_DOMAIN.indexOf(name)
  return index >= 0 ? RESOURCE_TYPE_RANGE[index] : CHART_FALLBACK
}

const truncate = (text: string) =>
  text.length > MAX_LABEL_CHARS ? `${text.slice(0, MAX_LABEL_CHARS - 1)}…` : text

const orcidPath = (id: string) => {
  const match = id.match(/(\d{4}-\d{4}-\d{4}-\d{3}[\dX])$/i)
  return match ? `/orcid.org/${match[1]}` : undefined
}

// Contributors (left) flowing into the work types they are associated with
// (right). People link to their Commons page; work types toggle the
// resource-type filter on the listing below.
const SankeyGraph: React.FunctionComponent<Props> = ({ titleText, data, tooltipText }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeType = searchParams?.get('resource-type')

  // Recharts anchors Sankey tooltips to the middle of the hovered node or
  // link; track the pointer instead so the tooltip sits next to the cursor.
  const cursorRef = useRef<Cursor>(undefined)
  const tipRef = useRef<HTMLDivElement>(null)
  const trackCursor = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cursorRef.current = { x, y, flipX: x > rect.width / 2, flipY: y > rect.height - 70 }
    if (tipRef.current) tipRef.current.style.transform = cursorTransform(cursorRef.current) ?? ''
  }

  const typeHref = (id: string) => {
    const params = new URLSearchParams(Array.from(searchParams?.entries() || []))
    if (activeType === id) params.delete('resource-type')
    else params.set('resource-type', id)
    params.delete('cursor')
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  const hrefFor = (node: SankeyGraphNode) => {
    if (node.kind === 'person') return orcidPath(node.id)
    if (node.kind === 'type' && node.id) return typeHref(node.id)
    return undefined
  }

  const people = data.nodes.filter(n => n.kind !== 'type').length
  const types = data.nodes.length - people
  const height = Math.min(Math.max(Math.max(people, types) * ROW_HEIGHT + 40, 240), 560)

  const renderNode = ({ x, y, width, height, payload }: NodeProps) => {
    const node = payload as unknown as SankeyGraphNode
    const isType = node.kind === 'type'
    const href = hrefFor(node)
    const fill = isType ? typeColor(node.name) : CHART_HIGHLIGHT
    const dimmed = isType && activeType && activeType !== node.id

    const content = (
      <>
        <rect x={x} y={y} width={width} height={Math.max(height, 1)} fill={fill} fillOpacity={dimmed ? 0.35 : 0.9} />
        <text
          x={isType ? x + width + 6 : x - 6}
          y={y + height / 2}
          textAnchor={isType ? 'start' : 'end'}
          dominantBaseline="middle"
          className={styles.label}
        >
          <title>{node.name}</title>
          {truncate(node.name)}
        </text>
      </>
    )

    if (!href) return <g>{content}</g>

    return (
      <a
        href={href}
        className={styles.nodeLink}
        aria-label={isType ? `Filter by ${node.name}` : `View ${node.name}`}
        onClick={(e) => {
          e.preventDefault()
          router.push(href, { scroll: !isType })
        }}
      >
        {content}
      </a>
    )
  }

  const renderLink = (props: LinkProps) => {
    const { sourceX, sourceY, sourceControlX, targetX, targetY, targetControlX, linkWidth, payload } = props
    const target = payload.target as unknown as SankeyGraphNode
    return (
      <path
        className={styles.link}
        d={`M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`}
        fill="none"
        stroke={typeColor(target.name)}
        strokeWidth={Math.max(linkWidth, 1)}
      />
    )
  }

  const header = (
    <div className={styles.chartTitle}>
      {titleText}
      {tooltipText && <HelpIcon text={tooltipText} padding={25} position='inline' color='#34495E' />}
    </div>
  )

  return (
    <ChartPanel
      header={header}
      isEmpty={data.links.length === 0}
      emptyTitle={titleText}
      height={height}
      className="production-chart"
      onChartMouseMove={trackCursor}
    >
      <Sankey
        data={data}
        node={renderNode}
        link={renderLink}
        nodeWidth={10}
        nodePadding={16}
        linkCurvature={0.5}
        margin={{ top: 10, right: LABEL_WIDTH, bottom: 10, left: LABEL_WIDTH }}
      >
        <Tooltip
          isAnimationActive={false}
          position={{ x: 0, y: 0 }}
          content={<SankeyTooltip tipRef={tipRef} cursorRef={cursorRef} />}
        />
      </Sankey>
    </ChartPanel>
  )
}

export default SankeyGraph
