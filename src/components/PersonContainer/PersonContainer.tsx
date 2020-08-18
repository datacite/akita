import * as React from 'react'
import Error from '../Error/Error'
import { useQuery, gql } from '@apollo/client'
import Person from '../Person/Person'
import DoiFacet from '../DoiFacet/DoiFacet'
import ContentLoader from 'react-content-loader'
import { useQueryState } from 'next-usequerystate'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import { DoiType } from '../DoiContainer/DoiContainer'
import {
  PageInfo,
  connectionFragment,
  contentFragment
} from '../SearchContent/SearchContent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton
} from 'react-share'

type Props = {
  orcid?: string
}

export const DOI_GQL = gql`
  query getContentQuery(
    $id: ID!
    $cursor: String
    $published: String
    $resourceTypeId: String
    $fieldOfScience: String
    $language: String
    $license: String
    $registrationAgency: String
  ) {
    person(id: $id) {
      id
      description
      links {
        url
        name
      }
      identifiers {
        identifier
        identifierType
      }
      country {
        name
        id
      }
      name
      alternateName
      givenName
      familyName
      citationCount
      viewCount
      downloadCount
      works(
        first: 25
        after: $cursor
        published: $published
        resourceTypeId: $resourceTypeId
        fieldOfScience: $fieldOfScience
        language: $language
        license: $license
        registrationAgency: $registrationAgency
      ) {
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
  links: Links[]
  identifiers: Identifiers[]
  country: Attribute
  name: string
  givenName: string
  familyName: string
  alternateName: string[]
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
  licenses: ContentFacet[]
  languages: ContentFacet[]
  fieldsOfScience: ContentFacet[]
  registrationAgencies: ContentFacet[]
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
  license: string
  fieldOfScience: string
  registrationAgency: string
}

const PersonContainer: React.FunctionComponent<Props> = ({ orcid }) => {
  const [cursor] = useQueryState('cursor', { history: 'push' })
  const [published] = useQueryState('published', {
    history: 'push'
  })
  const [resourceType] = useQueryState('resource-type', {
    history: 'push'
  })
  const [fieldOfScience] = useQueryState('field-of-science', {
    history: 'push'
  })
  const [language] = useQueryState('language', { history: 'push' })
  const [license] = useQueryState('license', { history: 'push' })
  const [registrationAgency] = useQueryState('registration-agency', {
    history: 'push'
  })

  const { loading, error, data } = useQuery<OrcidDataQuery, OrcidQueryVar>(
    DOI_GQL,
    {
      errorPolicy: 'all',
      variables: {
        id: 'http://orcid.org/' + orcid,
        cursor: cursor,
        published: published as string,
        resourceTypeId: resourceType as string,
        fieldOfScience: fieldOfScience as string,
        language: language as string,
        license: license as string,
        registrationAgency: registrationAgency as string
      }
    }
  )

  if (loading)
    return (
      <React.Fragment>
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
      </React.Fragment>
    )

  if (error) {
    return <Error title="No Content" message="Unable to retrieve Content" />
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
          </div>

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

        <DoiFacet
          model="doi"
          data={data.person.works}
          loading={loading}
        ></DoiFacet>
      </div>
    )
  }

  const content = () => {
    return (
      <div className="col-md-9" id="content">
        <Person person={data.person} />
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
