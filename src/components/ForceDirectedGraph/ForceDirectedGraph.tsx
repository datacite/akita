'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Vega } from 'react-vega'

import EmptyChart from '../EmptyChart/EmptyChart'
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
}

const ForceDirectedGraph: React.FunctionComponent<Props> = ({ titleText, nodes, links, domain, range, tooltipText }) => {
  const [width, setWidth] = useState(500);
  // const width = 500;
  const graphDivRef = useRef(null);

  function handleResize () {
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



  if (nodes.length==0){
    return <EmptyChart title={Array.isArray(titleText) ? titleText.join(' ') : titleText}/>
  }


  return (
    <div className="panel panel-transparent">
      <div className="panel-body production-chart" ref={graphDivRef}>
        <div className={styles.chartTitle}>
          {titleText}
          {tooltipText && <HelpIcon text={tooltipText} padding={25} position='inline' color='#34495E' />}
        </div>

        <Vega
          renderer="svg"
          spec={forceDirectedGraphSpec(width, domain, range)}
          data={{ "nodeData": nodes, "linkData": links }}
          actions={false}
          onNewView={view => console.log(view._runtime)}
        />
      </div>
    </div>
  )
}

export default ForceDirectedGraph
