/* eslint-disable react/jsx-no-target-blank */
import * as React from 'react'
import Error from '../Error/Error'
import { useQuery, gql } from '@apollo/client'
import Person from '../Person/Person'
import ContentLoader from 'react-content-loader'
import { useQueryState } from 'next-usequerystate'
import { Popover, OverlayTrigger } from 'react-bootstrap'
// eslint-disable-next-line no-unused-vars
import { DoiType } from '../DoiContainer/DoiContainer'
// eslint-disable-next-line no-unused-vars
import { PageInfo, connectionFragment, contentFragment } from '../SearchContent/SearchContent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton
} from "react-share"
import { useRouter } from 'next/router'
import Link from 'next/link'
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons'
// import { Row, Col, Nav, NavItem } from 'react-bootstrap'

type Props = {
  orcid?: string
}

export const DOI_GQL = gql`
  query getContentQuery($id: ID!, $cursor: String, $published: String, $resourceTypeId: String, $fieldOfScience: String, $language: String, $license: String, $registrationAgency: String, $repositoryId: String) {
    person(id: $id) {
      id
      description
      links {
        url
        name
      }
      identifiers{
        identifier
        identifierType
      }
      country{
        name
        id
      }
      name
      givenName
      familyName
      citationCount
      viewCount
      downloadCount
      # affiliation {
      #   name
      #   id
      # }

      works(first: 25, after: $cursor, published: $published, resourceTypeId: $resourceTypeId, fieldOfScience: $fieldOfScience, language: $language, license: $license, registrationAgency: $registrationAgency, repositoryId: $repositoryId) {
        ...WorkConnectionFragment
        nodes {
          ...WorkFragment
        }
      }
    }
  }
  ${connectionFragment.workConnection}
  ${contentFragment.work}
`

export interface PersonType {
  id: string
  description: string
  links: Link[]
  identifiers: Identifier[]
  country: Attribute
  name: string
  givenName: string
  familyName: string
  alternateName: string[]
  links: Links[]
  identifiers: Identifiers[]
  country: Country
  citationCount: number
  viewCount: number
  pageInfo: PageInfo
  downloadCount: number
  works: Works
}

interface Links {
  name: string
  url: string
}

interface Identifiers {
  identifierType: string
  identifierUrl: string
  identifier: string
}

interface Country {
  id: string
  name: string
}

interface Works {
  totalCount: number
  resourceTypes: ContentFacet[]
  pageInfo: PageInfo
  published: ContentFacet[]
  affiliations: ContentFacet[]
  repositories: ContentFacet[]
  nodes: DoiType[]
}

interface ContentFacet {
  id: string
  title: string
  count: number
}

export interface Attribute {
  name: string
  id: string
}

interface Identifier {
  identifier: string
  identifierType: string
}

interface Link {
  url: string
  name: string
}

export interface OrcidDataQuery {
  person: PersonType
}

interface OrcidQueryVar {
  id: string
  cursor: string
  published: string
  resourceTypeId: string
  language: string
  fieldOfScience: string
  registrationAgency: string
  repositoryId: string

}

const PersonContainer: React.FunctionComponent<Props> = ({ orcid }) => {
  const [orcidRecord, setOrcid] = React.useState<PersonType>()
  const [cursor] = useQueryState('cursor', { history: 'push' })
  const router = useRouter()


  const [published, setPublished] = useQueryState('published', { history: 'push' })
  const [resourceType, setResourceType] = useQueryState('resource-type', { history: 'push' })
  const [fieldOfScience, setFieldOfScience] = useQueryState('field-of-science', { history: 'push' })
  const [language, setLanguage] = useQueryState('language', { history: 'push' })
  const [registrationAgency, setRegistrationAgency] = useQueryState('registration-agency', { history: 'push' })
  const [repositoryId, setRepositoryId] = useQueryState('repository-id', { history: 'push' })


  const { loading, error, data } = useQuery<OrcidDataQuery, OrcidQueryVar>(
    DOI_GQL,
    {
      errorPolicy: 'all',
      variables: { id: "http://orcid.org/" + orcid, cursor: cursor,  published: published as string, resourceTypeId: resourceType as string, fieldOfScience: fieldOfScience as string, language: language as string, registrationAgency: registrationAgency as string, repositoryId: repositoryId as string   }
    }
  )

  React.useEffect(() => {
    let result = undefined
    if (data) {
      result = data.person
    }

    setOrcid(result)
  }, [orcid, data])

  if (loading || !orcidRecord)
    return (
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

  const renderFacets = () => {
    if (loading) return <div className="col-md-3"></div>

    if (!loading && orcidRecord.works.nodes.length == 0)
      return <div className="col-md-3"></div>

    function facetLink(param: string, value: string) {
      let url = '?'
      let icon = faSquare

      // get current query parameters from next router
      let params = new URLSearchParams(router.query as any)

      // delete person parameter
      params.delete('person')

      // delete cursor parameter
      params.delete('cursor')

      if (params.get(param) == value) {
        // if param is present, delete from query and use checked icon
        params.delete(param)
        icon = faCheckSquare
      } else {
        // otherwise replace param with new value and use unchecked icon
        params.set(param, value)
      }

      url += params.toString()
      return (
        <Link href={url}>
          <a>
            <FontAwesomeIcon icon={icon} />{' '}
          </a>
        </Link>
      )
    }

    return (
      <div>
        {/* <div className="panel facets add">
          <div className="panel-body">
            <h4>Filter by search</h4>
            {relatedContentSearchBox()}
          </div>
        </div> */}

        <div className="panel facets add">
          <div className="panel-body">
            <h4>Publication Year</h4>
            <ul id="published-facets">
              {orcidRecord.works.published.map((facet) => (
                <li key={facet.id}>
                  {facetLink('published', facet.id)}
                  <div className="facet-title">{facet.title}</div>
                  <span className="number pull-right">
                    {facet.count.toLocaleString('en-US')}
                  </span>
                  <div className="clearfix" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panel facets add">
          <div className="panel-body">
            <h4>Work Type</h4>
            <ul id="work-type-facets">
              {orcidRecord.works.resourceTypes.map((facet) => (
                <li key={facet.id}>
                  {facetLink('resource-type', facet.id)}
                  <div className="facet-title">{facet.title}</div>
                  <span className="number pull-right">
                    {facet.count.toLocaleString('en-US')}
                  </span>
                  <div className="clearfix" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {orcidRecord.works.repositories && orcidRecord.works.repositories.length > 0 && (
          <div className="panel facets add">
            <div className="panel-body">
              <h4>Repository</h4>
              <ul id="repository-facets">
                {orcidRecord.works.repositories.map((facet) => (
                  <li key={facet.id}>
                    {facetLink('repository', facet.id)}
                    <div className="facet-title">{facet.title}</div>
                    <span className="number pull-right">
                      {facet.count.toLocaleString('en-US')}
                    </span>
                    <div className="clearfix" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {orcidRecord.works.affiliations && orcidRecord.works.affiliations.length > 0 && (
          <div className="panel facets add">
            <div className="panel-body">
              <h4>Affiliation</h4>
              <ul id="affiliation-facets">
                {orcidRecord.works.affiliations.map((facet) => (
                  <li key={facet.id}>
                    {facetLink('affiliation', facet.id)}
                    <div className="facet-title">{facet.title}</div>
                    <span className="number pull-right">
                      {facet.count.toLocaleString('en-US')}
                    </span>
                    <div className="clearfix" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    )
  }


  // const relatedContentSearchBox = () => {
  
  //   const onSearchRelatedContentChange = (e: React.FormEvent<HTMLInputElement>): void => {
  //     setRelatedContentQuery(e.currentTarget.value)
  //   }
  
  //   const onSearchClear = () => {
  //     setRelatedContentQuery('')
  //   }


  //   return(
  //     <Row>
  //     <Col md={12}>
  //       <form className="form-horizontal search">
  //         <input
  //           name="query"
  //           value={relatedContentQuery || ''}
  //           onChange={onSearchRelatedContentChange}
  //           placeholder="Type to search..."
  //           className="form-control"
  //           type="text"
  //         />
  //         <span id="search-icon" title="Search" aria-label="Search" onClick={onSearchRelatedContentChange}>
  //           <FontAwesomeIcon icon={faSearch} />
  //         </span>
  //         {relatedContentQuery && (
  //           <span
  //             id="search-clear"
  //             title="Clear"
  //             aria-label="Clear"
  //             onClick={onSearchClear}
  //           >
  //             <FontAwesomeIcon icon={faTimes} />
  //           </span>
  //         )}
  //       </form>
  //     </Col>
  //   </Row>
  //   )
  // }


  const otherIdentifiers = () => {
    
    const identifiers = (
      data.person.identifiers.map((identifier) => (
        <div key={identifier.identifier} id={"identifier-"+identifier.identifier} className="download">
          <span>
            {identifier.identifierType+": "+identifier.identifier}
          </span>
        </div>
        ))
    )

    return ( 
      <div className="facets panel-body">
      <h4>Other Identifiers for this Person</h4>
        {identifiers}
      </div>
     );
  }

  const leftSideBar = () => {
    const title = 'DataCite Commons: ' + data.person.name
    const url = window.location.href

    const bibtex = (
      <Popover id="share" title="Export bibtex">
        Export as BibTeX will be implemented later in 2020.{' '}
        <a
          href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-orcid-search"
          target="_blank"
          rel="noreferrer"
        >
          Provide input
        </a>
      </Popover>
    )

    const orcidLink = (
      <a href={data.person.id} target="_blank" rel="noreferrer">
        ORCID
      </a>
    )

    const impactLink = (
      <a
        href={'https://profiles.impactstory.org/u/' + orcid}
        target="_blank"
        rel="noreferrer"
      >
        Impactstory
      </a>
    )

    const europePMCLink = (
      <a
        href={'http://europepmc.org/authors/' + orcid}
        target="_blank"
        rel="noreferrer"
      >
        Europe PMC
      </a>
    )

    return (
      <div className="col-md-3 hidden-xs hidden-sm">
        <div className="panel panel-transparent">
          <div className="panel-body">
            <div className="edit"></div>
          </div>
        </div>
        <div className="panel panel-transparent">
          <div className="facets panel-body">
            <h4>Other Profiles</h4>
            <div id="profile-orcid" className="download">
              {orcidLink}
            </div>
            <div id="profile-impactstory" className="download">
              {impactLink}
            </div>
            <div id="profile-europepmc" className="download">
              {europePMCLink}
            </div>
            {data.person.links.map((link) => (
              <div key={link.name} id={"profile-"+link.name} className="download">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.name}
                </a>
              </div>
              ))}
          </div>

          {otherIdentifiers()}
          <div className="facets panel-body">
            <h4>Export</h4>
            <OverlayTrigger placement="top" overlay={bibtex}>
              <span className="share">Works as BibTeX</span>
            </OverlayTrigger>
          </div>
          <div className="facets panel-body">
            <h4>Share</h4>
            <span className="share-button">
              <EmailShareButton url={url} title={title}>
                <FontAwesomeIcon icon={faEnvelope} size="lg" />
              </EmailShareButton>
            </span>
            <span className="share-button">
              <TwitterShareButton url={url} title={title}>
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </TwitterShareButton>
            </span>
            <span className="share-button">
              <FacebookShareButton url={url} title={title}>
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </FacebookShareButton>
            </span>
          </div>
        </div>

        {renderFacets()}
      </div>
    )
  }

  const content = () => {
    return (
      <div className="col-md-9" id="content">
        <Person person={orcidRecord} />
      </div>
    )
  }

  return (
    <div className="row">
      {leftSideBar()}     
      {content()}
    </div>
  )
}

export default PersonContainer
