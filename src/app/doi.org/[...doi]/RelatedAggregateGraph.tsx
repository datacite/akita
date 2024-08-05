import React from 'react'
import { Col, Row } from "src/components/Layout";
import { getRelatedWorksGraph } from 'src/data/queries/relatedWorks'
import ForceDirectedGraph  from 'src/components/ForceDirectedGraph/ForceDirectedGraph'
import EmptyChart from 'src/components/EmptyChart/EmptyChart'
import styles from "./RelatedAggregateGraph.module.scss"

interface Props {
  doi: string
}

export default async function RelatedAggregateGraph( {doi}: Props) {
  const data = await getRelatedWorksGraph(doi)
  const titleText = "Project Related Works"
  const emptyTitleText = "No related works found"
  const helpText = 'The “relatedIdentifier” and “resourceTypeGeneral” fields in the metadata of the project DOI and related work DOIs were used to generate this graph.'
  const explanitoryText="The network graph visualizes the relationships between different work types in the project. It shows the number of instances of each work type, and hovering over a connection reveals the number of links between any two types."
  const graphExists = data.nodes.length >0;
  const innerGraph = (graphExists) ?
    <ForceDirectedGraph
        titleText={titleText}
        nodes={data.nodes}
        links={data.links}
        tooltipText={helpText}
    /> :<EmptyChart title={emptyTitleText}/>

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
