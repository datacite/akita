import React from 'react';
import { VegaLite } from 'react-vega';
import Pluralize from 'react-pluralize'
import { Grid, Row } from 'react-bootstrap';


type Props = {
  data?: [],
  doi?: string,
  citationCount?: number,
  publicationYear?: number,
}

interface Spec {
  spec: string
}

const actions = {
  export: true,
  source: false,
  compiled: false, 
  editor: false,
}


const CitationsChart: React.FunctionComponent<Props> = ({data, doi, citationCount, publicationYear}) => {

  const lowerBoundYear = new Date().getFullYear() - 10

  const yearsDomain = new Date().getFullYear() - lowerBoundYear;

  const subset = data.filter((e)=> { return (e.year) > lowerBoundYear;});

  const width = 10 < subset.length ? yearsDomain : subset.length;

  const labelAngle = width < 3 ? 45 : 0 ;


  const spec = {
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
    width: width * 25,
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
          labelAngle: labelAngle,
          labelOverlap: "parity"
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
    return (
    <small><Pluralize singular={'Citation'} count={citationCount} />  reported since publication in {publicationYear}</small>
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
