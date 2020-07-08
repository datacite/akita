/* eslint-disable react/jsx-no-target-blank */
import * as React from 'react'
import { gql } from "apollo-boost"
import Error from "../Error/Error"
import { useQuery } from '@apollo/react-hooks'
import Person from '../Person/Person'
import ContentLoader from "react-content-loader"
import { Popover, OverlayTrigger } from 'react-bootstrap'
import { DoiType } from '../DoiContainer/DoiContainer'

type Props = {
  item?: string
}

export const DOI_GQL = gql`
  query getContentQuery($id: ID!) {
    person(id: $id) {
      id
      name
      givenName
      familyName
      citationCount
      viewCount
      downloadCount
      affiliation {
        name
        id
      }
      works(first: 5) {
        totalCount
        resourceTypes {
          title
          count
        }
        published {
          title
          count
        }
        nodes {
          id
          formattedCitation
          rights {
            rights
          }
          citationCount
          viewCount
          downloadCount
        }
      }
    }
}
`

export interface PersonType {
  id: string
  name: string
  givenName: string
  familyName: string
  citationCount: number
  viewCount: number
  downloadCount: number
  affiliation: Attribute
  works: Works
}

interface Works {
  totalCount: number
  resourceTypes: Attribute
  published: Attribute
  nodes: DoiType[] 
}

interface Attribute {
  title: string
  count: number
}


export interface OrcidDataQuery {
  person: PersonType
}

interface OrcidQueryVar {
  id: string
}

const PersonContainer: React.FunctionComponent<Props> = ({item}) => {
  const [orcid, setOrcid] = React.useState<PersonType>()
  const { loading, error, data } = useQuery<OrcidDataQuery, OrcidQueryVar>(
    DOI_GQL,
    {
      errorPolicy: 'all',
      variables: { id: "http://orcid.org/" +  item }
    }
  )

  React.useEffect(() => {
    let result = undefined
    if(data) {
      result = data.person
    }

    setOrcid(result)
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

  if (!orcid ) return <p>Content not found.</p>

  const leftSideBar = () => {

    const facebook = (
      <Popover id="share" title="Sharing via Facebook">
         Sharing via social media will be implemented later in 2020. <a href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-orcid-search" target="_blank" rel="noreferrer">Provide input</a>
      </Popover>
    )

    const twitter = (
      <Popover id="share" title="Sharing via Twitter">
        Sharing via social media will be implemented later in 2020. <a href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-orcid-search" target="_blank" rel="noreferrer">Provide input</a>
      </Popover>
    )

    const bibtex = (
      <Popover id="share" title="Export bibtex">
        Sharing via social media will be implemented later in 2020. <a href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-orcid-search" target="_blank" rel="noreferrer">Provide input</a>
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
            {/* <div id="export-bibtex" className="download">
              <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL + "/dois/application/x-bibtex/"}>Works as BibTeX</a>
            </div> */}
            <OverlayTrigger  placement="top" overlay={bibtex}>
              <span className="share">Works as BibTeX</span>
            </OverlayTrigger>
          </div>
          <div className="facets panel-body">

            <h4>Share</h4>
            <span className="actions">
            <OverlayTrigger  placement="top" overlay={facebook}>
              <span className="share">Facebook</span>
            </OverlayTrigger>
            <br></br>
            <OverlayTrigger  placement="top" overlay={twitter}>
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

  const content = () => {
    return (
      <div className="col-md-9 panel-list" id="content">
        <div key={orcid.id} className="panel panel-transparent content-item">
          <div className="panel-body">
            <Person item={orcid}/>
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

export default PersonContainer
