'use client'
import React, { useRef, useEffect } from 'react'
import HelpIcon from '../HelpIcon/HelpIcon'
import {Node, Edge, Options} from 'src/data/queries/relatedWorks'
import {DataSet, Network} from 'vis-network/standalone'
import styles from './VisGraph.module.scss'

interface VisNetworkProps {
  nodes: Node[];
  edges: Edge[];
  options?: Options;
}

const VisNetwork: React.FC<VisNetworkProps> = ({ nodes, edges, options }) => {
  const networkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = networkRef.current;

    if (container) {
      const data = {
        nodes: new DataSet<Node>(nodes),
        edges: new DataSet<Edge>(edges),
      };

      // Network options will be overridden if provided
      const networkOptions: Options = options || {
        autoResize: true,
        height: '100%',
        width: '100%',
        interaction: {
          zoomView: false,
          dragView: true,
          dragNodes: true,
          hover: true,
          hoverConnectedEdges: true,
          selectConnectedEdges: true,
          navigationButtons: true,
        },
        physics: {
          enabled: true,
        },
      };

      const network = new Network(container, data, networkOptions);

      return () => {
        network.destroy();
      };
    }
  }, [nodes, edges, options]);

  return <div ref={networkRef} style={{ width: '100%', height: '500px' }} />;
};



type VisGraphData = {
  nodes: Node[]
  edges: Edge[]
}
type Props = {
  titleText: string | string[]
  graph: VisGraphData
  options?: Options
  tooltipText?: string
}

const VisGraph: React.FunctionComponent<Props> = ({ titleText, graph, options, tooltipText }) => {
  return (
    <div className="panel panel-transparent">
      <div className="panel-body production-chart">
        <div className={styles.chartTitle}>
          {titleText}
          {tooltipText && <HelpIcon text={tooltipText} padding={25} position='inline' color='#34495E' />}
        </div>
        <VisNetwork
          nodes={graph.nodes}
          edges={graph.edges}
          options={options}
        />
      </div>
    </div>
  )
}

export default VisGraph
