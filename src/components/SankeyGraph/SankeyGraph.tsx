import React, { useEffect, useRef, useState } from 'react'
import { Vega } from 'react-vega'

import HelpIcon from '../HelpIcon/HelpIcon'
import EmptyChart from '../EmptyChart/EmptyChart'
import { MultilevelFacet } from '../SearchWork/SearchWork'
import sankeySpec, { SankeyGraphData } from './SankeySpec'

import styles from './SankeyGraph.module.scss'


type Props = {
  titleText: string
  data: SankeyGraphData[]
  tooltipText?: string
}


export function multilevelToSankey(facets: MultilevelFacet[]): SankeyGraphData[] {
  let data: SankeyGraphData[] = []
  facets = facets.filter(f => f.title)

  facets.forEach(facet => {
    const arr: SankeyGraphData[] = facet.inner.map(i => ({ data: [facet.title, i.title], count: i.count }))
    data = data.concat(arr)
  })

  return data
}


const SankeyGraph: React.FunctionComponent<Props> = ({ titleText, data, tooltipText }) => {
  const [width, setWidth] = useState(500);
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

  

  if (data.length==0) {
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
          spec={{ ...sankeySpec, width: width }}
          data={{ "rawData": data }}
          actions={false}
        />
      </div>
    </div>
  )
}

export default SankeyGraph
