import React from 'react';
// import { Component } from 'react';
import { VegaLite } from 'react-vega';
// import { Handler } from 'vega-tooltip';


type Props = {
  data: [],
  doi: string,
  yearOfPublication: number,
}

const barData = {
  table: [
    { year: 1989, total: 7 },
    { year: 1991, total: 29 },
    { year: 1996, total: 71 },
    { year: 1997, total: 127 },
    { year: 1999, total: 7 },
    { year: 2012, total: 54 },
    { year: 2013, total: 100 },
    { year: 2014, total: 2 },
    { year: 2015, total: 4 },
    { year: 2019, total: 54 },
    { year: 2020, total: 17 },
    { year: 2021, total: 5 }
  ],
}


const lowerBoundYear = new Date().getFullYear() - 10

const yearsDomain = new Date().getFullYear() - lowerBoundYear;

const dataset_2 = barData.table.filter((e)=> { return (e.year) > lowerBoundYear;});

const width = 10 < dataset_2.length ? yearsDomain : dataset_2.length;

const labelAngle = width < 3 ? 45 : 0 ;

interface Spec {
  spec: string
}


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
  title: {
    text: "DOI citations per year distribution",
    subtitle: "doi-name-here",
    baseline: "top",
    anchor: "middle",
    angle: 0
  },
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
      title: "period",
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

const actions = {
  export: true,
  source: false,
  compiled: false, 
  editor: false,
}


const CitationsChart = () => {
  return ( 
    <VegaLite renderer="svg" spec={spec} data={barData} actions={actions} />
   );
}

export default CitationsChart
