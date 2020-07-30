/* eslint-disable react/jsx-no-target-blank */
import * as React from 'react'
import Error from "../Error/Error"
import { gql, useQuery } from '@apollo/client'
import Doi from '../Doi/Doi'
import ContentLoader from "react-content-loader"
import { Popover, OverlayTrigger } from 'react-bootstrap'
import { Tabs, Tab, Alert } from 'react-bootstrap'
import CitationFormatter from '../CitationFormatter/CitationFormatter'
import CitationsChart from '../CitationsChart/CitationsChart'
import DoiRelatedContent from '../DoiRelatedContent/DoiRelatedContent'
import Pluralize from 'react-pluralize'
import DoiMetadata from '../DoiMetadata/DoiMetadata'
import { compactNumbers } from '../../utils/helpers'
import Pager from '../Pager/Pager'

import UsageChart from '../UsageChart/UsageChart'


type Props = {
  item?: string
}

export const DOI_GQL = gql`
  query getContentQuery($id: ID!) {
  work(id: $id){
    id
    doi
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
    descriptions {
      description
    }
  	rights {
      rights
      rightsUri
      rightsIdentifier
    }
    fieldsOfScience {
      id
      name
    }
    language {
      id
      name
    }
    registrationAgency {
      id
      name
    }
    registered
    formattedCitation
    citationCount
    citationsOverTime {
      year
      total
    }
    viewCount
    viewsOverTime {
      yearMonth
      total
    }
    downloadCount
    downloadsOverTime {
      yearMonth
      total
    }
    citations{
      pageInfo {
          endCursor
          hasNextPage
      }
      nodes{
        id
        formattedCitation
        repository{
          name
          re3dataId
          id
        }
        registrationAgency{
          name
          id
        }
        member{
          name
          id
        }
      }
    }
    references{
      pageInfo {
          endCursor
          hasNextPage
      }
      nodes{
        id
        formattedCitation
        repository{
          name
          re3dataId
          id
        }
        registrationAgency{
          name
          id
        }
        member{
          name
          id
        }
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
    resourceTypeGeneral?: string
    resourceType?: string
  }
  creators: Creator[]
  titles: Title[]
  publicationYear: number
  publisher: string
  descriptions?: Description[]
  fieldsOfScience?: FieldOfScience[]
  rights?: Rights[]
  version?: string
  language?: {
    id: string
    name: string
  }
  registrationAgency: {
    id: string
    name: string
  }
  registered?: Date
  formattedCitation?: string
  citationCount?: number
  citationsOverTime?: CitationsYear[]
  citations?: {
    nodes: RelatedContentList[]
    pageInfo: PageInfo
  }
  viewCount?: number
  viewsOverTime?: UsageMonth[]
  downloadCount?: number
  downloadsOverTime?: UsageMonth[]
  references?: {
    nodes: RelatedContentList[]
    pageInfo: PageInfo
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
  rightsIdentifier: string
}

interface FieldOfScience {
  id: string
  name: string
}

interface Description {
  description: string
}

interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}

interface CitationsYear {
  year: number,
  total: number
}

export interface UsageMonth {
  yearMonth: string,
  total: number
}

export interface RelatedContentList {
  nodes: {
    id: string,
    formattedCitation: string,
    repository: {
      name: string,
      re3dataId: string,
      id: string,
    },
    registrationAgency: {
      name: string,
      id: string,
    },
    member: {
      name: string,
      id: string,
    },
  },
}

export interface DoiQueryData {
  work: DoiType
}

interface DoiQueryVar {
  id: string
}

const DoiContainer: React.FunctionComponent<Props> = ({ item }) => {
  const [selectedOption, setSelectedOption] = React.useState('')
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
    if (data) {
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
          uniqueKey="2"
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

  if (!doi) return <p>Content not found.</p>

  const leftSideBar = () => {
    const facebook = (
      <Popover id="share" title="Sharing via Facebook">
        Sharing via social media will be implemented later in 2020. <a href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-doi-search" target="_blank" rel="noreferrer">Provide input</a>
      </Popover>
    )

    const twitter = (
      <Popover id="share" title="Sharing via Twitter">
        Sharing via social media will be implemented later in 2020. <a href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-doi-search" target="_blank" rel="noreferrer">Provide input</a>
      </Popover>
    )

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
              <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL
                + "/dois/application/vnd.datacite.datacite+xml/" + doi.doi}>DataCite XML</a>
            </div>
            <div id="export-json" className="download">
              <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL
                + "/dois/application/vnd.datacite.datacite+json/" + doi.doi}>DataCite JSON</a>
            </div>
            <div id="export-ld" className="download">
              <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL
                + "/dois/application/vnd.schemaorg.ld+json/" + doi.doi}>Schema.org JSON-LD</a>
            </div>
            <div id="export-bibtex" className="download">
              <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL + "/dois/application/x-bibtex/" +
                doi.doi}>BibTeX</a>
            </div>
            <div id="export-ris" className="download">
              <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL
                + "/dois/application/x-research-info-systems/" + doi.doi}>RIS</a>
            </div>
            <div id="export-jats" className="download">
              <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL
                + "/dois/application/vnd.jats+xml/" + doi.doi}>JATS</a>
            </div>
            {doi.types.resourceTypeGeneral === "Software" &&
              <div id="export-codemeta" className="download">
                <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL
                  + "/dois/application/vnd.codemeta.ld+json/" + doi.doi}>Codemeta</a>
              </div>
            }
          </div>
          <div className="facets panel-body">
            <h4>Share</h4>
            <span className="actions">
              <OverlayTrigger placement="top" overlay={facebook}>
                <span className="share">Facebook</span>
              </OverlayTrigger>
              <br></br>
              <OverlayTrigger placement="top" overlay={twitter}>
                <span className="share">Twitter</span>
              </OverlayTrigger>
            </span>
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

    
  const formattedCitation = () => { 

    return (
      <div>
        <div id="citation" className="input-group pull-right">
          <select className="cite-as" onChange={e => setSelectedOption(e.target.value)} >
              <option value="apa">APA</option>
              <option value="harvard-cite-them-right">Harvard</option>
              <option value="modern-language-association">MLA</option>
              <option value="vancouver">Vancouver</option>
              <option value="chicago-fullnote-bibliography">Chicago</option>
              <option value="ieee">IEEE</option>
          </select>
        </div>
        <CitationFormatter id={doi.doi} input={doi.formattedCitation} locale="en" style={selectedOption}></CitationFormatter>
      </div>
    )
  }

  const style = {
    fontWeight: 600,  
    color:'#1abc9c',
    fontSize: '25px',
    padding: 0,
    margin: '0 0 .35em 10px',
  }

  const citationsTabLabel = Pluralize({count: compactNumbers(doi.citationCount), singular:'Citation', style:style, showCount:true}) 
  const viewsTabLabel = Pluralize({count: compactNumbers(doi.viewCount), singular:'View', style:style, showCount:true}) 
  const downloadsTabLabel = Pluralize({count: compactNumbers(doi.downloadCount), singular:'Download', style:style, showCount:true}) 

  const citationsOverTime = doi.citationsOverTime.map(datum => ({ year: datum.year, total: datum.total }));
  const viewsOverTime = doi.viewsOverTime.map(datum => ({ yearMonth: datum.yearMonth, total: datum.total }));
  const downloadsOverTime = doi.downloadsOverTime.map(datum => ({ yearMonth: datum.yearMonth, total: datum.total }));
 
  const analyticsBar = () => {
    return (
      <div className="panel panel-transparent">
        <div className="panel-body tab-content nav-tabs-member">
          <Tabs  id="over-time-tabs">
            {doi.citationCount > 0 && 
              <Tab className="citations-over-time-tab" eventKey="citationsOverTime" title={citationsTabLabel}>
                <CitationsChart data={citationsOverTime} publicationYear={doi.publicationYear} citationCount={doi.citationCount}></CitationsChart>
              </Tab>
            }
            {doi.viewCount > 0 && 
              <Tab className="views-over-time-tab" eventKey="viewsOverTime" title={viewsTabLabel}>
                <UsageChart data={viewsOverTime} counts={doi.viewCount} publicationYear={doi.publicationYear} type="View"/> 
              </Tab>
            }
            {doi.downloadCount > 0 && 
              <Tab className="downloads-over-time-tab" eventKey="downloadsOverTime" title={downloadsTabLabel}>
                <UsageChart data={downloadsOverTime} counts={doi.downloadCount} publicationYear={doi.publicationYear} type="Download" />
              </Tab>
            }
          </Tabs>
        </div>
      </div>
    )
  }

// eslint-disable-next-line no-unused-vars
  const relatedContent = () => {
    const referencesTabLabel = Pluralize({count: compactNumbers(doi.references.nodes.length), singular:'Reference', style:style,showCount:true}) 
    const citationsTabLabel = Pluralize({count: compactNumbers(doi.citations.nodes.length), singular:'Citation', style:style,showCount:true}) 

    return (
      <div className="panel panel-transparent">
        <div className="panel-body tab-content nav-tabs-member">
          <Tabs id="related-content-tabs">
            {doi.citations.nodes.length > 0 && 
              <Tab className="citations-list" eventKey="citationsList" title={citationsTabLabel}>
                <DoiRelatedContent dois={doi.citations} type="citation" count={doi.citations.nodes.length} />
              </Tab>
            }
            {doi.references.nodes.length > 0 && 
              <Tab className="references-list" eventKey="referencesList" title={referencesTabLabel}>
                <DoiRelatedContent dois={doi.references} type="reference" count={doi.references.nodes.length} />
              </Tab>
            }
          </Tabs>
        </div>
      </div>
    )
  }

  const content = () => {
    return (
      <div className="col-md-9 panel-list" id="content">
        <div key={doi.id} className="panel panel-transparent content-item">
          <div className="panel-body">
          <div key={doi.id} className="panel panel-transparent">
            <h2 className="member-results">{doi.doi}</h2>
            <DoiMetadata metadata={doi}></DoiMetadata>
            <br/>
          </div>
          </div>
          <br />
        </div>
        {formattedCitation()}
        {analyticsBar()}
        {relatedContent()}
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
