import React from 'react';
import { VegaLite } from 'react-vega';
import Pluralize from 'react-pluralize'
import { Grid, Row } from 'react-bootstrap';
  /* eslint-disable no-unused-vars */
import { VisualizationSpec } from 'vega-embed';

interface ChartRecord {
  year: number,
  total: number
}

type Props = {
  data: ChartRecord[],
  doi?: string,
  citationCount?: number,
  publicationYear?: number
}

const actions = {
  export: true,
  source: false,
  compiled: false, 
  editor: false,
}

/* eslint-disable no-unused-vars */
const CitationsChart: React.FunctionComponent<Props> = ({data, citationCount, publicationYear}) => {
  
  /* istanbul ignore next */
  const thisYear = new Date().getFullYear() + 1 
  
  /* istanbul ignore next */
  const lowerBoundYear = thisYear - 10 > publicationYear ? thisYear - 10 : publicationYear
  
  /* istanbul ignore next */
  const yearsDomain = thisYear - lowerBoundYear;

  /* istanbul ignore next */
  const spec: VisualizationSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    data: {
      name: 'table'
    },
    transform: [
      {
        calculate: "toNumber(datum.year)",
        as: "period"
      },
      {
        calculate: "toNumber(datum.year)+1",
        as: "bin_end"
      },
      {
        filter: "toNumber(datum.year) >" + lowerBoundYear
      }
    ],
    width: yearsDomain * 25,
    mark: {
      type: "bar",
      cursor: "pointer",
      tooltip: true,
    },
    selection: {
      highlight: {
        type: "single",
        empty: "none",
        on: "mouseover"
      }
    },
    encoding: {
      x: {
        field: "period",
        bin: {
          binned: true,
          step: 1,
          maxbins: 10
        },
        title: null,
        type: "quantitative",
        axis: {
          format: "1",
          labelAngle: yearsDomain < 11 ? 45 : 0,
          labelFlush: false,
          labelOverlap: true
        },
        scale: {
          domain: [lowerBoundYear, thisYear]
        }
      },
      x2: {
        field: "bin_end"
      },
      y: {
        field: "total",
        type: "quantitative",
        axis: null
      },
      color: {
        field: "total",
        scale: { range: ["#1abc9c"] },
        type: "nominal",
        legend: null,
        condition: [{ selection: "highlight", value: "#34495e" }]
      }
    },
    config: {
      view: {
        stroke: null
      },
      axis: {
        grid: false
      }
    }
  }

  const title = () => {
    // const style = {
    //   color:'#1abc9c',
    // }
    return (
      <small><Pluralize singular={'Citation'} count={citationCount}/> reported since publication in {publicationYear}</small>
    )
  }

  return (
    <div className="panel panel-transparent">
      <div className="citation-chart panel-body"> 
        <Grid>
          <Row> 
            {title()}
          </Row>
          <Row>       
            <VegaLite renderer="svg" spec={spec} data={{table: data}} actions={actions} />
          </Row>
        </Grid>
      </div>
    </div>
   );
}

export default CitationsChart
