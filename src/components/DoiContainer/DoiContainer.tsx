/* eslint-disable react/jsx-no-target-blank */
import * as React from 'react'
import { gql } from "apollo-boost"
import Error from "../Error/Error"
import { useQuery } from '@apollo/react-hooks'
import Doi from '../Doi/Doi'
import ContentLoader from "react-content-loader"

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

export interface DoiType {
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
  citations: {
    nodes: RelatedContentList[]
  }
  viewCount: number
  viewsOverTime: UsageMonth[]
  views: []
  downloadCount: number
  downloadsOverTime: UsageMonth[]
  downloads: []
  references: {
    nodes: RelatedContentList[]
  }
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

interface RelatedContentList {
  nodes: {
    formattedCitation: string
  }
}

interface DoiQueryData {
  work: DoiType
}

interface DoiQueryVar {
  id: string
}

const DoiContainer: React.FunctionComponent<Props> = ({item}) => {
  const [doi, setDoi] = React.useState<DoiType>()
  const { loading, error, data } = useQuery<DoiQueryData, DoiQueryVar>(
    DOI_GQL,
    {
      errorPolicy: 'all',
      variables: { id: item }
    }
  )

  React.useEffect(() => {
    let result = undefined
    if(data) {
      result = data.work
    }

    setDoi(result)
  }, [item, data])

  if (loading) return (
    <div className="row">
      <div className="col-md-3"></div>
      <div className="col-md-9">
        <ContentLoader 
          speed={1}
          width={1000}
          height={250}
          viewBox="0 0 1000 250"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="117" y="34" rx="3" ry="3" width="198" height="14" /> 
          <rect x="117" y="75" rx="3" ry="3" width="117" height="14" /> 
          <rect x="9" y="142" rx="3" ry="3" width="923" height="14" /> 
          <rect x="9" y="178" rx="3" ry="3" width="855" height="14" /> 
          <rect x="9" y="214" rx="3" ry="3" width="401" height="14" /> 
          <circle cx="54" cy="61" r="45" /> 
        </ContentLoader>
      </div>
    </div>
  )

  if (error) {
    return <Error title="No Content" message="Unable to retrieve Content" />
  }

  if (!doi ) return <p>Content not found.</p>

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
          <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL + "/dois/application/vnd.datacite.datacite+xml/" + doi.doi}>DataCite XML</a>
        </div>
        <div id="export-json" className="download">
          <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL + "/dois/application/vnd.datacite.datacite+json/" + doi.doi}>DataCite JSON</a>
        </div>
        <div id="export-ld" className="download">
          <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL + "/dois/application/vnd.schemaorg.ld+json/" + doi.doi}>Schema.org JSON-LD</a>
        </div>
        <div id="export-bibtex" className="download">
          <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL + "/dois/application/x-bibtex/" + doi.doi}>BibTeX</a>
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
