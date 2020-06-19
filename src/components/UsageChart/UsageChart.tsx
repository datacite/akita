import React from 'react';
import { VegaLite } from 'react-vega';
import Pluralize from 'react-pluralize'
import { Grid, Row } from 'react-bootstrap';
import Moment from 'moment';


type Props = {
  data?: [],
  doi?: string,
  counts?: number,
  publicationYear?: number,
  type: string
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


const UsageChart: React.FunctionComponent<Props> = ({doi, data, counts, publicationYear, type}) => {

  // current date
  const thisYear= new Date().getFullYear()
  const thisMonth= new Date().getMonth()

  // Get the lowerBound
  const lowerBoundYear = Moment(Moment().subtract(3, 'years')).isSameOrBefore(Moment(publicationYear,"YYYY")) ? Moment(publicationYear,"YYYY") : Moment().subtract(3, 'years')
  console.log(lowerBoundYear.year())

  // Filter dataset
  let subset = data.filter((e)=> { return (Moment(e.yearMonth,"YYYY-MM")).isAfter(lowerBoundYear);});
  subset = subset.filter((e)=> { return (Moment(e.yearMonth,"YYYY-MM")).isAfter(Moment(publicationYear,'YYYY'));});
  console.log(subset)


  // Get domain
  const domain =  Math.abs(lowerBoundYear.diff(new Date(), 'months'))   


  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    data: {
      values: subset
    },
    transform: [
    ],
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
          labelAngle: domain < 3 ? 45 : 0 ,
          labelOverlap: "parity"
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
    <small><Pluralize singular={type} count={counts} />  reported since publication in {publicationYear}</small>
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
        <VegaLite renderer="svg" spec={spec} data={{table: data}} actions={actions} />
        </Row>
       </Grid>
       </div>
      </div>
   );
}

export default UsageChart





