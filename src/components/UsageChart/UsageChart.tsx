import React from 'react';
import { VegaLite } from 'react-vega';
import Pluralize from 'react-pluralize'
import { Grid, Row } from 'react-bootstrap';
import Moment from 'moment';
/* eslint-disable no-unused-vars */
import { VisualizationSpec } from 'vega-embed';


interface ChartRecord {
  yearMonth: string,
  total: number
}



type Props = {
  data?: ChartRecord[],
  doi?: string,
  counts?: number,
  publicationYear?: number,
  type: string
}


const actions = {
  export: true,
  source: false,
  compiled: false, 
  editor: false,
}

/* eslint-disable no-unused-vars */
const UsageChart: React.FunctionComponent<Props> = ({data, counts, publicationYear, type}) => {

  // current date
  /* istanbul ignore next */
  const thisYear= new Date().getFullYear()

  /* istanbul ignore next */
  const thisMonth= new Date().getMonth()

  // Get the lowerBound
  /* istanbul ignore next */
  const lowerBoundYear = Moment(Moment().subtract(3, 'years')).isSameOrBefore(Moment(publicationYear,"YYYY")) ? Moment(publicationYear,"YYYY") : Moment().subtract(3, 'years')

  // Filter dataset
  /* istanbul ignore next */
  let subset: ChartRecord[] = data.filter((e)=> { return (Moment(e.yearMonth,"YYYY-MM")).isAfter(lowerBoundYear);});

  /* istanbul ignore next */
  subset = subset.filter((e)=> { return (Moment(e.yearMonth,"YYYY-MM")).isAfter(Moment(publicationYear,'YYYY'));});

  // Get domain
  /* istanbul ignore next */
  const domain =  Math.abs(lowerBoundYear.diff(new Date(), 'months'))   

  /* istanbul ignore next */
  const spec: VisualizationSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    data: {
      name: 'table'
    },
    width: domain * 25,
    mark: {
      type: "bar",
      tooltip: true,
      cursor: "pointer"
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
        field: "yearMonth",
        timeUnit: {
          unit: "yearmonth",
          step: 1,
          // band: 0.5
        },
        type: "temporal",
        title: null,
        axis: {
          labelAngle: domain < 30 ? 45 : 0,
          labelFlush: false,
          labelOverlap: true
        },
        scale: {
          domain: [{year:lowerBoundYear.year(),"month": 1}, {year:thisYear,"month": thisMonth}]
        }
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
    <small><Pluralize singular={type} count={counts} style={{color:'#1abc9c'}} />  reported since publication in {publicationYear}</small>
    )
  }

  return (
      <div className="panel panel-transparent">
       <div className="usage-chart panel-body"> 
       <Grid>
        <Row> 
          {title()}
        </Row>
        <Row>       
        <VegaLite renderer="svg" spec={spec} data={{table: subset}} actions={actions} />
        </Row>
       </Grid>
       </div>
      </div>
   );
}

export default UsageChart





