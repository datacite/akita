import React from 'react'
import { Col, Row } from "src/components/Layout";
import { getRelatedWorksGraph } from 'src/data/queries/relatedWorks'
import ForceDirectedGraph  from 'src/components/ForceDirectedGraph/ForceDirectedGraph'
import EmptyChart from 'src/components/EmptyChart/EmptyChart'

interface Props {
  doi: string
}

export default async function RelatedAggregateGraph( {doi}: Props) {
  const data = await getRelatedWorksGraph(doi)
  const titleText = ""
  const emptyTitleText = "No related works found"
  const innerGraph = (data.nodes.length==0) ?
    <EmptyChart title={emptyTitleText}/> :
    <ForceDirectedGraph titleText={titleText} nodes={data.nodes} links={data.links} />

  return (<Row>
            <Col mdOffset={3} className="panel panel-transparent">
              <div className="panel-body">
                {innerGraph}
              </div>
            </Col>
          </Row>
         )
}
