import React, { Component } from 'react';
import { VegaLite } from 'react-vega'


const barData = {
  table: [
    { repository: 'A', count: 28 },
    { repository: 'B', count: 55 },
    { repository: 'C', count: 43 },
    { repository: 'D', count: 91 },
    { repository: 'E', count: 81 },
    { repository: 'F', count: 53 },
    { repository: 'G', count: 19 },
    { repository: 'H', count: 87 },
    { repository: 'I', count: 52 },
  ],
}

const spec = {
  width: 500,
  height: 300,
  mark: {type: 'bar',"tooltip": true},
  encoding: {
    x: { field: 'repository', type: 'ordinal' },
    y: { field: 'count', type: 'quantitative' },
    color: {
      condition: [{ selection: "highlight", value: "#66615b" }],
      value: "#7bdcc0"
    }
  },
  selection: {
    highlight: {
      type: "single",
      empty: "none",
      on: "mouseover"
    }
  },
  data: { name: 'table' }, // note: vega-lite data attribute is a plain object instead of an array
}



class VegaBarChart extends Component {
  render() {
      return (
        <VegaLite renderer="svg" spec={spec} data={barData} />
      );
  }
}



export default VegaBarChart;
