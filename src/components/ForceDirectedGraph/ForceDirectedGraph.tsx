'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Vega } from 'react-vega'

import HelpIcon from '../HelpIcon/HelpIcon'
import forceDirectedGraphSpec, { ForceDirectedGraphNode, ForceDirectedGraphLink } from './ForceDirectedSpec'
import styles from './ForceDirectedGraph.module.scss'

type Props = {
  titleText: string | string[]
  nodes: ForceDirectedGraphNode[]
  links: ForceDirectedGraphLink[]
  range?: string[]
  domain?: string[]
  tooltipText?: string
  isEmbed?: boolean
}

const ForceDirectedGraph: React.FunctionComponent<Props> = ({ titleText, nodes, links, domain, range, tooltipText, isEmbed }) => {
  const [width, setWidth] = useState(500);
  const graphDivRef = useRef<HTMLDivElement>(null);

  function handleResize() {
    if (!graphDivRef.current) return
    setWidth(graphDivRef.current.offsetWidth - 20);
  }


  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  useEffect(() => {
    handleResize();
  });

  return (
    <div className="panel panel-transparent">
      <div className="panel-body production-chart" ref={graphDivRef}>
        <h3 className={`${styles.chartTitle} member-results`}>
          {titleText}
          {tooltipText && !isEmbed && <HelpIcon text={tooltipText} padding={25} position='inline' color='#34495E' />}
        </h3>

        <Vega
          renderer="svg"
          spec={forceDirectedGraphSpec(width, domain, range)}
          data={{ "nodeData": nodes, "linkData": links }}
          actions={false}
        />
      </div>
    </div>
  )
}

export default ForceDirectedGraph
