import React from 'react'
import { Vega } from 'react-vega'

import EmptyChart from '../EmptyChart/EmptyChart'
import HelpIcon from '../HelpIcon/HelpIcon'
import sankeySpec, { SankeyGraphData } from './SankeySpec'


type Props = {
  titleText: string
  data: SankeyGraphData[]
  labels?: string[]
}

const SankeyGraph: React.FunctionComponent<Props> = ({ titleText, data }) => {
  if (data.length==0){
    return <EmptyChart title={Array.isArray(titleText) ? titleText.join(' ') : titleText}/>
  }

  
  return (
    <div className="panel panel-transparent">
      <div className="panel-body" style={{ font: 'Source Sans Pro', fontSize: 21, color: '#1abc9c' }}>
        {titleText}
        <HelpIcon text='Connections data comes from Event Data service' />
      </div>
      <div className="panel-body production-chart">
        <Vega
          renderer="svg"
          spec={sankeySpec}
          data={{ "rawData": data }}
          actions={false}
          // logLevel={4}
          onNewView={view => {
            console.log('NEW VIEW DATA')
            console.log(view._runtime.data)
          }}
        />
      </div>
    </div>
  )
}

export default SankeyGraph
