'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import EmptyChart from 'src/components/EmptyChart/EmptyChart'
import type { ForceDirectedGraphLink, ForceDirectedGraphNode } from './ForceDirectedSpec'

export type LazyForceDirectedGraphProps = {
  titleText: string | string[]
  nodes: ForceDirectedGraphNode[]
  links: ForceDirectedGraphLink[]
  range?: string[]
  domain?: string[]
  tooltipText?: string
  isEmbed?: boolean
}

const ForceDirectedGraph = dynamic(() => import('./ForceDirectedGraph'), {
  ssr: false,
  loading: () => <EmptyChart title="Loading connections…" />,
})

export default function LazyForceDirectedGraph(props: LazyForceDirectedGraphProps) {
  return <ForceDirectedGraph {...props} />
}
