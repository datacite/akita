import React from 'react'
import { VegaLite } from 'react-vega'
import { VisualizationSpec } from 'vega-embed'

import useWindowDimensions from '../../utils/useWindowDimensions'
import EmptyChart from '../EmptyChart/EmptyChart'

interface ChartRecord {
  title: string
  count: number
  color?: string
}

type Props = {
  title: string
  data: ChartRecord[]
  color?: string
}

const actions = {
  export: true,
  source: false,
  compiled: false,
  editor: false
}

const DATA = [
  {
  "Name": "ARDC",
  "count": 1
  },
  {
  "Name": "Arizona State University",
  "count": 1
  },
  {
  "Name": "arolsen-archives",
  "count": 1
  },
  {
  "Name": "Atmospheric Model Data",
  "count": 1
  },
  {
  "Name": "British Antarctic Survey",
  "count": 1
  },
  {
  "Name": "Brunel University London",
  "count": 1
  },
  {
  "Name": "Center for Open Science",
  "count": 1
  },
  {
  "Name": "Centre de coopération internationale en recherche agronomique pour le développement",
  "count": 1
  },
  {
  "Name": "Centre for Biodiversity Genomics",
  "count": 1
  },
  {
  "Name": "Centro Euro-Mediterraneo sui Cambiamenti Climatici (CMCC) Foundation",
  "count": 1
  },
  {
  "Name": "Colorado School of Mines",
  "count": 1
  },
  {
  "Name": "Crossref",
  "count": 1
  },
  {
  "Name": "Curtin University",
  "count": 1
  },
  {
  "Name": "DARA bucket",
  "count": 1
  },
  {
  "Name": "Data Archiving and Networked Services",
  "count": 1
  },
  {
  "Name": "DKRZ",
  "count": 1
  },
  {
  "Name": "ecohealthalliance.org",
  "count": 1
  },
  {
  "Name": "Elsevier",
  "count": 1
  },
  {
  "Name": "embl-ebi",
  "count": 1
  },
  {
  "Name": "eScire",
  "count": 1
  },
  {
  "Name": "European Synchrotron Radiation Facility",
  "count": 1
  },
  {
  "Name": "Exaptive",
  "count": 1
  },
  {
  "Name": "Food and Agriculture Organization of the United Nations",
  "count": 1
  },
  {
  "Name": "github",
  "count": 1
  },
  {
  "Name": "GreyNet International",
  "count": 1
  },
  {
  "Name": "Helmholtz Centre Potsdam GFZ German Research Centre for Geosciences",
  "count": 1
  },
  {
  "Name": "IISKS",
  "count": 1
  },
  {
  "Name": "Jet Propulsion Lab",
  "count": 1
  },
  {
  "Name": "KU Leuven",
  "count": 1
  },
  {
  "Name": "lens",
  "count": 1
  },
  {
  "Name": "Macquarie University",
  "count": 1
  },
  {
  "Name": "Manaaki Whenua - Landcare Research",
  "count": 1
  },
  {
  "Name": "METADATAWORKS",
  "count": 1
  },
  {
  "Name": "MPG",
  "count": 1
  },
  {
  "Name": "MPI",
  "count": 1
  },
  {
  "Name": "National Institute for Materials Science",
  "count": 1
  },
  {
  "Name": "National Research Council Canada",
  "count": 1
  },
  {
  "Name": "New Digital Research Infrastructure Organization (NDRIO)",
  "count": 1
  },
  {
  "Name": "New Zealand eScience Infrastructure",
  "count": 1
  },
  {
  "Name": "northwestern university",
  "count": 1
  },
  {
  "Name": "ntu",
  "count": 1
  },
  {
  "Name": "Ocean Networks Canada Society",
  "count": 1
  },
  {
  "Name": "ORCID",
  "count": 1
  },
  {
  "Name": "ourresearch",
  "count": 1
  },
  {
  "Name": "Oxford University Library Service Databank",
  "count": 1
  },
  {
  "Name": "Parafia Ewangelicko-Augsburska w Gdańsku",
  "count": 1
  },
  {
  "Name": "Princeton University",
  "count": 1
  },
  {
  "Name": "Queen's University Belfast",
  "count": 1
  },
  {
  "Name": "sages",
  "count": 1
  },
  {
  "Name": "Stanford University Libraries",
  "count": 1
  },
  {
  "Name": "The Danish National Archives",
  "count": 1
  },
  {
  "Name": "TU Delft",
  "count": 1
  },
  {
  "Name": "Umeå universitet",
  "count": 1
  },
  {
  "Name": "univ-grenoble-alpes",
  "count": 1
  },
  {
  "Name": "Universidade Fernando Pessoa",
  "count": 1
  },
  {
  "Name": "University Kiel",
  "count": 1
  },
  {
  "Name": "University of Arizona",
  "count": 1
  },
  {
  "Name": "University of British Columbia",
  "count": 1
  },
  {
  "Name": "University of Cape Town",
  "count": 1
  },
  {
  "Name": "University of Sheffield",
  "count": 1
  },
  {
  "Name": "US Department of Energy (DOE), Office of Scientific and Technical Information (OSTI)",
  "count": 1
  },
  {
  "Name": "Wageningen University & Research",
  "count": 1
  },
  {
  "Name": "wsl",
  "count": 1
  },
  {
  "Name": "Zürcher Hochschule der Künste",
  "count": 1
  },
  {
  "Name": "American Geophysical Union",
  "count": 2
  },
  {
  "Name": "BL Repository Services",
  "count": 2
  },
  {
  "Name": "British Library",
  "count": 2
  },
  {
  "Name": "DataOne",
  "count": 2
  },
  {
  "Name": "German National Library of Science and Technology",
  "count": 2
  },
  {
  "Name": "Karlsruhe Institute of Technology",
  "count": 2
  },
  {
  "Name": "Pacific northwest National Laboratory",
  "count": 2
  },
  {
  "Name": "Technical University of Denmark",
  "count": 2
  },
  {
  "Name": "The Australian National University",
  "count": 2
  },
  {
  "Name": "unipd",
  "count": 2
  },
  {
  "Name": "University of Ottawa",
  "count": 2
  },
  {
  "Name": "University of Virginia",
  "count": 2
  },
  {
  "Name": "berkley lab",
  "count": 3
  },
  {
  "Name": "California Digital Library",
  "count": 3
  },
  {
  "Name": "Caltech",
  "count": 3
  },
  {
  "Name": "Imperial College London",
  "count": 3
  },
  {
  "Name": "Personal",
  "count": 3
  },
  {
  "Name": "usda",
  "count": 3
  },
  {
  "Name": "ZHB Luzern",
  "count": 3
  },
  {
  "Name": "National Institute of Standards and Technology",
  "count": 4
  },
  {
  "Name": "Spanish National Research Council (CSIC)",
  "count": 4
  },
  {
  "Name": "TIB",
  "count": 4
  },
  {
  "Name": "metadata game changers",
  "count": 5
  },
  {
  "Name": "Lyrasis",
  "count": 6
  },
  {
  "Name": "TU Wien",
  "count": 9
  }
  ]

const VerticalBarChart: React.FunctionComponent<Props> = ({
  title,
  data,
  color
}) => {
  if (data.length==0){
    return <EmptyChart title={title}/>
  }
  // get current screen size
  const windowDimensions: any = useWindowDimensions()
  const width = windowDimensions.width

  if (typeof color == 'undefined') {
    color = '#1abc9c'
  }

  /* istanbul ignore next */
  const chartWidth = width >= 1400 ? 11 * 22 : 11 * 18

  const hundredBarSpec = function (data: any, variable: string) {
    return {
      data: {
          url: data
      },
      width: 500,
      mark: {
        type: "bar",
        tooltip: true
      },
      transform: [
        {
          calculate: "datum.count * 100",
          as: "percentage"
        },
        {calculate: "datum."+variable+" == '__missing__'? '__missing__' : 'complete'",
         as: "completenes"
         }
        ],
      encoding: {
          x: {
              "aggregate": "sum",
              "field": "count",
              "stack": "normalize",
              "type": "quantitative",
              "axis": {"format": ".0%"},
              "title":variable
          },
          color: {
              "field": "completenes"
          },
          // order: {
          //     "aggregate": "sum",
          //     "sort": "descending",
          //     "field": "count"
          // }
      }
    }
  }

  /* istanbul ignore next */
  const spec: VisualizationSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    data: {
      name: 'table'
    },
    padding: { left: 5, top: 5, right: 5, bottom: 5 },
    axes: [
      { orient: "bottom", scale: "xscale", tickCount: 5 },
      { orient: "left", scale: "yscale", tickCount: 5 }
    ],
    mark: {
      type: "bar",
      cursor: "pointer",
      tooltip: true
    },
    selection: {
      highlight: {
        type: "single",
        empty: "none",
        on: "mouseover"
      }
    },
    width: chartWidth,
    height: 200,
    encoding: {
      y: {
        field: "title",
        type: "ordinal",
        sort: { encoding: "x" },
        axis: {
          title: "",
          labelLimit: 100,
          labelExpr: 'substring(datum.value, 0,9)'
        }
      },
      x: {
        field: "count",
        type: "quantitative",
        title: "",
        axis: {
          format: ",d",
          tickMinStep: 1
        },
        scale: { type: "sqrt" }
      },
      color: {
        field: "count",
        scale: { range: [color] },
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
        grid: false,
        title: null,
        labelFlush: false
      }
    }
  }

  const stackedBarChartSpec: VisualizationSpec = {
    data: {
        url: 'https://gist.githubusercontent.com/kjgarza/7d6afa241d2d39d5a0a9b4add8a17bdb/raw/0c423a00e28e51a9b494886fcebf88d18b8a7568/face-domain-name.json'
    },
    width: 500,
    mark: {
      type: "bar",
      tooltip: true
    },
    transform: [
      {
        calculate: "datum.count * 100",
        as: "percentage"
      },
      // {calculate: "datum.Name == '__missing__'? '__missing__' : 'complete'",
      //  as: "completenes"
      //  }
      ],
    encoding: {
        x: {
            aggregate: "sum",
            field: "count",
            stack: "normalize",
            type: "quantitative",
            axis: {"format": ".0%"},
            title: 'Name'
        },
        color: {
            field: "Name"
        },
        // order: {
        //     "aggregate": "sum",
        //     "sort": "descending",
        //     "field": "count"
        // }
    }
  }


  const mydata = data.map(item => {
    if(item.title === "missing") {
      return {...item, color: "#e74c3c"}
    }else{
      return {...item, color: "#1abc9c"}
    }
  })

  return (
    <div className="panel panel-transparent">
      <div className="panel-body production-chart">
        <div className="title text-center">
          <h4>{title}</h4>
        </div>
        <VegaLite
          renderer="svg"
          spec={stackedBarChartSpec}
          // data={{ table: mydata.slice(0, 10) }}
          actions={actions}
        />
      </div>
    </div>
  )
}

export default VerticalBarChart
