import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { GraphData, getRelatedWorksGraph } from 'src/data/queries/relatedWorks'
import ForceDirectedGraph from 'src/components/ForceDirectedGraph/ForceDirectedGraph'
import EmptyChart from 'src/components/EmptyChart/EmptyChart'
import styles from "./RelatedAggregateGraph.module.scss"

interface Props {
  doi: string
  isBot?: boolean
  isEmbed?: boolean
}

interface FetchResult {
  data: GraphData;
  timedOut: boolean;
}

async function fetchRelatedWorksGraphWithTimeout(doi: string, timeoutDuration: number): Promise<FetchResult> {
  function timeoutPromise(ms: number) {
    return new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
  }

  try {
    const data = await Promise.race([
      getRelatedWorksGraph(doi),
      timeoutPromise(timeoutDuration)
    ]);
    return { data, timedOut: false };
  } catch (error) {
    // Return timedOut as true in case of timeout or any error
    return { data: { nodes: [], links: [] }, timedOut: true };
  }
}

export default async function RelatedAggregateGraph(props: Props) {
  const { doi, isBot = false, isEmbed = false } = props
  if (isBot) return null

  const timeoutDuration = 7000; // 7 second timeout
  const { data, timedOut } = await fetchRelatedWorksGraphWithTimeout(doi, timeoutDuration);

  const titleText = "Connections"
  const timedOutTitle = "Timed Out"
  const emptyTitleText = "No connections"
  const timedOutHelpText = "The Connections graph timed out, possibly due to a large number of related works."
  const helpText = 'The “relatedIdentifier” and “resourceTypeGeneral” fields in the metadata of the primary DOI and related work DOIs were used to generate this graph.'
  const explanitoryText = "The network graph visualizes the connections among the primary DOI and its related works, grouped by work type. It shows the number of instances of each work type, and hovering over a connection reveals the number of links between any two types."
  const graphExists = data.nodes.length > 0;

  let innerGraph = <EmptyChart title={emptyTitleText} />
  if (graphExists) {
    innerGraph = <ForceDirectedGraph
      titleText={titleText}
      nodes={data.nodes}
      links={data.links}
      tooltipText={helpText}
    />;
  } else if (timedOut) {
    innerGraph = <EmptyChart title={timedOutTitle}>
      <p className={styles.explanitoryText}>{timedOutHelpText}</p>
    </EmptyChart>
  }


  return (<Container fluid><Row>
    <Col md={{ offset: isEmbed ? 0 : 3 }} className="panel panel-transparent">
      <div className="panel-body">
        {innerGraph}
        {graphExists &&
          <p className={styles.explanitoryText}>{explanitoryText}</p>
        }
      </div>
    </Col>
  </Row>
  </Container>)
}
