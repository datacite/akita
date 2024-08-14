import React from 'react'
import { Col, Row } from "src/components/Layout";
import { getRelatedNetworkGraph, GraphData } from 'src/data/queries/relatedWorks'
import VisGraph from 'src/components/VisGraph/VisGraph'
// import Graph from 'react-graph-vis'
// import ForceDirectedGraph  from 'src/components/ForceDirectedGraph/ForceDirectedGraph'
import EmptyChart from 'src/components/EmptyChart/EmptyChart'
import styles from "./RelatedAggregateGraph.module.scss"

interface Props {
  doi: string
}

export default async function NetworkGraph( {doi}: Props) {
  const data :GraphData = await getRelatedNetworkGraph(doi)
  const gData = {
    'nodes':data.nodes,
    'edges':data.edges,
  }
  const titleText = "Connections"
  const emptyTitleText = "No connections"
  const helpText = 'The “relatedIdentifier” and “resourceTypeGeneral” fields in the metadata of the primary DOI and related work DOIs were used to generate this graph.'
  const explanitoryText="The network graph visualizes the connections between different work types. It shows the number of instances of each work type, and hovering over a connection reveals the number of links between any two types."
  const graphExists = data.nodes.length >0;
  const innerGraph = (graphExists) ?
    <VisGraph
      graph={ gData }
      titleText={titleText}
      options={data.options}
      tooltipText={helpText}
      />:<EmptyChart title={emptyTitleText}/>

  return (<Row>
            <Col mdOffset={3} className="panel panel-transparent">
              <div className="panel-body">
                {innerGraph}
                { graphExists &&
                  <p className={styles.explanitoryText}>{explanitoryText}</p>
                }
              </div>
            </Col>
          </Row>
         )
}
