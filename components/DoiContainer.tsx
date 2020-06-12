/* eslint-disable react/jsx-no-target-blank */
import * as React from 'react'
import { gql } from "apollo-boost"
import Error from "./Error"
import { useQuery } from '@apollo/react-hooks';
import Doi from './Doi'

type Props = {
  item?: string
}


export const DOI_GQL = gql`
  query getContentQuery($id: ID!) {
  work(id: $id){
    titles{
      title
    }
    types{
      resourceTypeGeneral
      resourceType
    }
    creators {
      id
      name
      givenName
      familyName
    }
    version
    publicationYear
    publisher
    descriptions{
      description
    }
  	rights{
      rights
      rightsUri
    }
    id
    doi
    formattedCitation
    citationCount
    citationsOverTime{
      year
      total
    }
    viewCount
    viewsOverTime{
      yearMonth
      total
    }
    downloadCount
    downloadsOverTime{
      yearMonth
      total
    }
    citations{
      nodes{
        formattedCitation
      }
    }
    references{
      nodes{
        formattedCitation
      }  
    }
  }
}
`

interface DoiType {
  id: string
  doi: string
  url: string
  types: {
    resourceTypeGeneral: string
    resourceType: string
  }
  creators: Creator[]
  titles: Title[]
  publicationYear: number
  publisher: string
  descriptions: Description[]
  rights: Rights[]
  version: string
  formattedCitation: string
  citationCount: number
  citationsOverTime: CitationsYear[]
  citations: []
  viewCount: number
  viewsOverTime: UsageMonth[]
  views: []
  downloadCount: number
  downloadsOverTime: UsageMonth[]
  downloads: []
}

interface Creator {
  id: string
  name: string
  givenName: string
  familyName: string
}

interface Title {
  title: string
}

interface Rights {
  rights: string
  rightsUri: string
}

interface Description {
  description: string
}

interface CitationsYear {
  year: string,
  total: number
}

interface UsageMonth {
  yearMonth: string,
  total: number
}


interface DoiQueryData {
  work: DoiType
}

interface DoiQueryVar {
  id: string;
}


const DoiContainer: React.FunctionComponent<Props> = ({item}) => {

  const [doi, setDoi] = React.useState<DoiType>();
  const { loading, error, data } = useQuery<DoiQueryData, DoiQueryVar>(
      DOI_GQL,
      {
          errorPolicy: 'all',
          variables: { id: item }
      }
  )

  React.useEffect(() => {
    let result = undefined;
    if(data) {
      result = data.work;
    }

      setDoi(result);
  }, [item, data]);

  if (loading) return <p>Loading...</p>;

  if (error) {
      return <Error title="No Content" message="Unable to retrieve Content" />
  }

  if (!doi ) return <p>Content not found.</p>;

  const leftSideBar = () => {

    return (
      <div className="col-md-3 hidden-xs hidden-sm">
        <div className="panel panel-transparent">
          <div className="panel-body">
            <div className="edit">

            </div>
          </div>
        </div>
        <div className="panel panel-transparent">
        <div className="facets panel-body">


        <h4>Export</h4>
          <div id="export-xml" className="download">
            <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL + "/application/vnd.datacite.datacite+xml" + doi.doi}>DataCite XML</a>
          </div>
          <div id="export-json" className="download">
            <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL + "/application/vnd.datacite.datacite+json" + doi.doi}>DataCite JSON</a>
          </div>
          <div id="export-ld" className="download">
            <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL + "/application/vnd.schemaorg.ld+json" + doi.doi}>Schema.org JSON-LD</a>
          </div>
          <div id="export-bibtex" className="download">
            <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL + "/application/x-bibtex" + doi.doi}>BibTeX</a>
          </div>
          </div>
          </div>
      </div>
    )
  }

  // const rightSideBar = () => {

  //   return (
  //     <div className="col-md-3 hidden-xs hidden-sm">

  //     </div>
  //   )
  // }

  const content = () => {

    return (
      <div className="col-md-9 panel-list" id="content">
        <div key={doi.id} className="panel panel-transparent content-item">
          <div className="panel-body">
            <Doi item={doi}/>
          </div>
          <br/>
        </div>
      </div>
    )
  }

  return (
    <div className="row">
      {leftSideBar()}
      {content()}
      {/* {rightSideBar()} */}
    </div>
  )
}

export default DoiContainer
