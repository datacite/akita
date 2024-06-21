import React from 'react'
import { Col, Row } from "src/components/Layout";
import { getRelatedWorksGraph } from 'src/data/queries/relatedWorks'
import ForceDirectedGraph  from 'src/components/ForceDirectedGraph/ForceDirectedGraph'

interface Props {
  doi: string
}

export default async function RelatedAggregateGraph( {doi}: Props) {
  const data = await getRelatedWorksGraph(doi)
    return (<Row>
      <Col mdOffset={3} className="panel panel-transparent">
          <div className="panel-body">
            <ForceDirectedGraph titleText= "Related Aggregate Graph" nodes={data.nodes} links={data.links} />
            <h3 className="member-results">Related Aggregate Graph</h3>
            <code>{JSON.stringify(data)}</code>
          </div>
      </Col>
    </Row>
           )
}
