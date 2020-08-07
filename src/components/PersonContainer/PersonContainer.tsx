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
import { PageInfo } from '../SearchContent/SearchContent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton
} from "react-share"
import FilterItem from "../FilterItem/FilterItem"

type Props = {
  orcid?: string
}

export const DOI_GQL = gql`
  query getContentQuery($id: ID!, $cursor: String, $published: String, $resourceTypeId: String, $fieldOfScience: String, $language: String, $license: String, $registrationAgency: String, $repositoryId: String) {
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
      works(first: 25, after: $cursor, published: $published, resourceTypeId: $resourceTypeId, fieldOfScience: $fieldOfScience, language: $language, license: $license, registrationAgency: $registrationAgency, repositoryId: $repositoryId) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        resourceTypes {
          title
          count
          id
        }
        published {
          title
          count
          id
        }
        affiliations {
          count
          title
          id
        }
        repositories{
          count
          title
          id
        }
        nodes {
          doi
          id
          titles {
            title
          }
          types {
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
  affiliation: Attribute[]
  works: Works
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
  license: string
  registrationAgency: string
  repositoryId: string

}

const PersonContainer: React.FunctionComponent<Props> = ({ orcid }) => {
  const [orcidRecord, setOrcid] = React.useState<PersonType>()
  const [cursor] = useQueryState('cursor', { history: 'push' })

  const [published, setPublished] = useQueryState('published', { history: 'push' })
  const [resourceType, setResourceType] = useQueryState('resource-type', { history: 'push' })
  const [fieldOfScience, setFieldOfScience] = useQueryState('field-of-science', { history: 'push' })
  const [language, setLanguage] = useQueryState('language', { history: 'push' })
  const [registrationAgency, setRegistrationAgency] = useQueryState('registration-agency', { history: 'push' })
  const [repositoryId, setRepositoryId] = useQueryState('repository-id', { history: 'push' })
  const [resourceTypeId, setResourceTypeId] = useQueryState('resource-type-id', { history: 'push' })


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

  if (loading)
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

  if (!orcidRecord) return <p>Content not found.</p>

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
          </div>
          <div className="facets panel-body">
            <h4>Export</h4>
            {/* <div id="export-bibtex" className="download">
              <a target="_blank" rel="noopener" href={process.env.NEXT_PUBLIC_API_URL + "/dois/application/x-bibtex/"}>Works as BibTeX</a>
            </div> */}
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


             
              <div className="panel facets add">
                  <div className="panel-body">
                    <h4>Publication Year</h4>
                    <ul>
                      {orcidRecord.works.published.map(facet => (
                        <li key={facet.id}>
                          <FilterItem name="published" id={facet.id} count={facet.count} title={facet.title} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="panel facets add">
                  <div className="panel-body">
                    <h4>Content Type</h4>
                    <ul>
                      {orcidRecord.works.resourceTypes.map(facet => (
                        <li key={facet.id}>
                          <FilterItem name="resource-type-id" id={facet.id} count={facet.count} title={facet.title} />

                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {orcidRecord.works.affiliations.length > 0 &&
                <div className="panel facets add">
                  <div className="panel-body">
                    <h4>Affiliations</h4>
                    <ul>
                      {orcidRecord.works.affiliations.map(facet => (
                        <li key={facet.id}>
                          <FilterItem name="affiliation-id" id={facet.id} count={facet.count} title={facet.title} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                }

                {orcidRecord.works.repositories.length > 0 &&
                <div className="panel facets add">
                  <div className="panel-body">
                    <h4>Repositories</h4>
                    <ul>
                      {orcidRecord.works.repositories.map(facet => (
                        <li key={facet.id}>
                          <FilterItem name="repository-id" id={facet.id} count={facet.count} title={facet.title} />

                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                }

                {/* {orcidRecord.works.fieldsOfScience.length > 0 &&
                  <div className="panel facets add">
                    <div className="panel-body">
                      <h4>Field of Science</h4>
                      <ul>
                        {orcidRecord.works.fieldsOfScience.map(facet => (
                          <li key={facet.id}>
                            <FilterItem name="orgtype" id={facet.id} count={facet.count} title={facet.title} />

                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                }

                {orcidRecord.works.licenses.length > 0 &&
                  <div className="panel facets add">
                    <div className="panel-body">
                      <h4>License</h4>
                      <ul>
                        {orcidRecord.works.licenses.map(facet => (
                          <li key={facet.id}>
                          <FilterItem name="orgtype" id={facet.id} count={facet.count} title={facet.title} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                }

                {orcidRecord.works.languages.length > 0 &&
                  <div className="panel facets add">
                    <div className="panel-body">
                      <h4>Language</h4>
                      <ul>
                        {orcidRecord.works.languages.map(facet => (
                          <li key={facet.id}>
                            <FilterItem name="orgtype" id={facet.id} count={facet.count} title={facet.title} />

                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                } */}

      </div>
    )
  }

  // const rightSideBar = () => {
  //   if (!orcidRecord.works) return '';

  //   return (
  //   )
  // }

  const content = () => {
    return (
      <div className="col-md-9 panel-list" id="content">
        <div
          key={orcidRecord.id}
          className="panel panel-transparent content-orcid"
        >
          <div className="panel-body">
            <Person person={orcidRecord} />
          </div>
          <br />
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
