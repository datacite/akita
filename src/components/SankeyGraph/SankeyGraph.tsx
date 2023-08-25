import React, { useEffect, useRef, useState } from 'react'
import { Vega } from 'react-vega'

import EmptyChart from '../EmptyChart/EmptyChart'
import sankeySpec, { SankeyGraphData } from './SankeySpec'
import { MultilevelFacet } from '../SearchWork/SearchWork'


type Props = {
  titleText: string
  data: SankeyGraphData[]
  labels?: string[]
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

const SankeyGraph: React.FunctionComponent<Props> = ({ titleText, data }) => {
  const [width, setWidth] = useState(500);
  const graphDivRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (!graphDivRef.current) return
      setWidth(graphDivRef.current.offsetWidth);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (data.length==0){
    return <EmptyChart title={Array.isArray(titleText) ? titleText.join(' ') : titleText}/>
  }

  
  return (
    <div className="panel panel-transparent">
      <div className="panel-body" style={{ font: 'Source Sans Pro', fontSize: 21, color: '#1abc9c' }}>
        {titleText}
      </div>
      <div className="panel-body production-chart" ref={graphDivRef}>
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
