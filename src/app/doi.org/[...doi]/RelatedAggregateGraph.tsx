'use client'
import React from 'react'
import { Col, Row } from "src/components/Layout";
import { getRelatedWorksGraph } from 'src/data/queries/relatedWorks'
import ForceDirectedGraph  from 'src/components/ForceDirectedGraph/ForceDirectedGraph'
import { TEST_NODES, TEST_LINKS } from 'src/components/ForceDirectedGraph/ForceDirectedSpec'
import EmptyChart from 'src/components/EmptyChart/EmptyChart'

interface Props {
  doi: string
}

export default async function RelatedAggregateGraph( {doi}: Props) {
  const data0 = await getRelatedWorksGraph(doi)
  // const data = await getRelatedWorksGraph(doi)
  const data = {nodes: TEST_NODES, links: TEST_LINKS}
  // const data = JSON.parse(JSON.stringify(data0)) // JSON.parse(data0)
  // const data = {nodes: [], links: []}; // {nodes: TEST_NODES, links: TEST_LINKS}
  const titleText = "Test Related Aggregate Graph"
  const innerGraph = (data.nodes.length==0) ?
    <EmptyChart title={titleText}/> :
    <ForceDirectedGraph titleText= "Related Aggregate Graph" nodes={data.nodes} links={data.links} />

    return (<Row>
      <Col mdOffset={3} className="panel panel-transparent">
          <div className="panel-body">
            {innerGraph}
            {/* <ForceDirectedGraph titleText= "TEST GRAPH" nodes={TEST_NODES} links={TEST_LINKS} /> */}
            {/* <h3 className="member-results">Related Aggregate Graph</h3> */}
            <code>{JSON.stringify(data)}</code>
            <code>{JSON.stringify(data0)}</code>
          </div>
      </Col>
    </Row>
           )
}
