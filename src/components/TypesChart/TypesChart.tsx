import React from 'react';
import { VegaLite } from 'react-vega';
import { Grid, Row } from 'react-bootstrap';
  /* eslint-disable no-unused-vars */
import { VisualizationSpec } from 'vega-embed';

type Props = {
  data?: [],
  doi?: string,
}

const actions = {
  export: true,
  source: false,
  compiled: false, 
  editor: false,
}

/* eslint-disable no-unused-vars */
const TypesChart: React.FunctionComponent<Props> = ({data, doi}) => {

  const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
      "description": "A simple donut chart with embedded data.",
      "data": {
        "name": "table"
      },
      "mark": {
        "type": "arc",
        "innerRadius": 70,
        "cursor": "pointer",
        "tooltip": true
      },
      "encoding": {
        "theta": {
          "field": "count",
          "type": "quantitative",
          "sort": "descending"
        },
        "color": {
          "field": "title",
          "title": "Type",
          "type": "nominal",
          "scale": {
            "scheme": "viridis"
          }
        }
      },
      "view": {
        "stroke": null
      }
  }


  return (
      <div className="panel panel-transparent">
       <div className="citation-chart panel-body"> 
       <Grid>
        <Row>       
          <VegaLite renderer="svg" spec={spec} data={{table: data}} actions={actions} />
        </Row>
       </Grid>
       </div>
      </div>
   );
}

export default TypesChart
