/* eslint-disable react/jsx-no-target-blank */
import * as React from 'react'
import { gql } from "apollo-boost"
import Error from "../Error/Error"
import { useQuery } from '@apollo/react-hooks'
import Person from '../Person/Person'
import ContentLoader from "react-content-loader"
import { useQueryState } from 'next-usequerystate'
import { Popover, OverlayTrigger } from 'react-bootstrap'
// eslint-disable-next-line no-unused-vars
import { DoiType } from '../DoiContainer/DoiContainer'
// eslint-disable-next-line no-unused-vars
import { PageInfo } from '../Search/Search'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faOrcid,
} from '@fortawesome/free-brands-svg-icons'
import { 
  faInfoCircle, 
} from '@fortawesome/free-solid-svg-icons'


type Props = {
  item?: string
}

export const DOI_GQL = gql`
  query getContentQuery($id: ID!, $cursor: String) {
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
      works(first: 5, after: $cursor) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        resourceTypes {
          title
          count
        }
        published {
          title
          count
        }
        nodes {
          doi
          id
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
  pageInfo: PageInfo
  downloadCount: number
  affiliation: Attribute
  works: Works
}

interface Works {
  totalCount: number
  resourceTypes: Attribute[]
  pageInfo: PageInfo
  published: Attribute[]
  nodes: DoiType[] 
}

export interface Attribute {
  title: string
  count: number
}


export interface OrcidDataQuery {
  person: PersonType
}

interface OrcidQueryVar {
  id: string
  cursor: string
}

const PersonContainer: React.FunctionComponent<Props> = ({item}) => {
  const [orcid, setOrcid] = React.useState<PersonType>()
  const [cursor, setCursor] = useQueryState('cursor', { history: 'push' })
  const { loading, error, data } = useQuery<OrcidDataQuery, OrcidQueryVar>(
    DOI_GQL,
    {
      errorPolicy: 'all',
      variables: { id: "http://orcid.org/" +  item, cursor: cursor }
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

    const orcidLink = (
      <a href={"https://orcid.org/" + item} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faOrcid}/> ORCiD</a>
    )
    console.log(item)

    const impactLink = (
      <a href={"https://profiles.impactstory.org/u/" + item} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInfoCircle}/> Impact Story</a>
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

          <h4>Other Websites</h4>
          {orcidLink}
          <br/>
          {impactLink}

          </div>
 
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
