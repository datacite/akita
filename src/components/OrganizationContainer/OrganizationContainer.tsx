import * as React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Alert, OverlayTrigger, Popover } from 'react-bootstrap'
import { useQueryState } from 'next-usequerystate'
import ContentLoader from 'react-content-loader'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton
} from 'react-share'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'

import Error from '../Error/Error'
import Pager from '../Pager/Pager'
import { Organization, OrganizationRecord } from '../Organization/Organization'
import { OrganizationMetadataRecord } from '../OrganizationMetadata/OrganizationMetadata'
import { DoiType } from '../DoiContainer/DoiContainer'
import DoiMetadata from '../DoiMetadata/DoiMetadata'

type Props = {
  rorId: string
}

interface OrganizationResult {
  id: string
  name: string
  alternateName: string[]
  url: string
  wikipediaUrl: string
  types: string[]
  address: {
    country: string
  }
  identifiers: [
    {
      identifier: string
      identifierType: string
    }
  ]
  works: Works
}

interface Works {
  totalCount: number
  resourceTypes: ContentFacet[]
  pageInfo: PageInfo
  published: ContentFacet[]
  nodes: DoiType[]
}

interface ContentFacet {
  id: string
  title: string
  count: number
}

interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}

interface OrganizationQueryData {
  organization: OrganizationResult
}

interface OrganizationQueryVar {
  id: string
  cursor: string
}

export const ORGANIZATION_GQL = gql`
  query getOrganizationQuery($id: ID!, $cursor: String) {
    organization(id: $id) {
      id
      name
      alternateName
      url
      wikipediaUrl
      types
      address {
        country
      }
      identifiers {
        identifier
        identifierType
      }
      works(first: 25, after: $cursor) {
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

const OrganizationContainer: React.FunctionComponent<Props> = ({ rorId }) => {
  const [cursor] = useQueryState('cursor', { history: 'push' })
  const [organization, setOrganization] = React.useState<OrganizationRecord>()

  const fullId = 'https://ror.org/' + rorId

  const { loading, error, data } = useQuery<
    OrganizationQueryData,
    OrganizationQueryVar
  >(ORGANIZATION_GQL, {
    errorPolicy: 'all',
    variables: {
      id: fullId,
      cursor: cursor
    }
  })

  React.useEffect(() => {
    if (data) {
      let organization = data.organization
      let grid = organization.identifiers.filter((i) => {
        return i.identifierType === 'grid'
      })
      let fundref = organization.identifiers.filter((i) => {
        return i.identifierType === 'fundref'
      })
      let isni = organization.identifiers.filter((i) => {
        return i.identifierType === 'isni'
      })
      let wikidata = organization.identifiers.filter((i) => {
        return i.identifierType === 'wikidata'
      })

      let orgMetadata: OrganizationMetadataRecord = {
        id: organization.id,
        name: organization.name,
        alternateNames: organization.alternateName,
        types: organization.types,
        url: organization.url,
        wikipediaUrl: organization.wikipediaUrl,
        countryName: organization.address.country,
        grid: grid,
        fundref: fundref,
        isni: isni,
        wikidata: wikidata,
        identifiers: organization.identifiers
      }

      setOrganization({
        metadata: orgMetadata
      })
    }
  }, [data])

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
    return (
      <Error title="No Service" message="Unable to retrieve organization" />
    )
  }

  if (!organization) {
    return <Error title="No Data" message="No organization data" />
  }

  const relatedContent = () => {
    const hasNextPage = data.organization.works.pageInfo
      ? data.organization.works.pageInfo.hasNextPage
      : false
    const endCursor = data.organization.works.pageInfo
      ? data.organization.works.pageInfo.endCursor
      : ''

    if (!data.organization.works.totalCount)
      return (
        <Alert bsStyle="warning" className="no-content">
          No content found.
        </Alert>
      )

    return (
      <div>
        {data.organization.works.totalCount > 1 && (
          <h3 className="member-results">
            {data.organization.works.totalCount.toLocaleString('en-US')} Works
          </h3>
        )}

        {data.organization.works.nodes.map((doi) => (
          <React.Fragment key={doi.id}>
            <DoiMetadata metadata={doi} />
          </React.Fragment>
        ))}

        <Pager
          url={'/organization/' + rorId + '/?'}
          hasNextPage={hasNextPage}
          endCursor={endCursor}
        />
      </div>
    )
  }

  const leftSideBar = () => {
    const title = 'DataCite Commons: ' + data.organization.name
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

    return (
      <div className="col-md-3 hidden-xs hidden-sm">
        <div className="panel panel-transparent">
          <div className="panel-body">
            <div className="edit"></div>
          </div>
        </div>
        <div className="panel panel-transparent">
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
      </div>
    )
  }

  const content = () => {
    return (
      <div className="col-md-9 panel-list" id="content">
        <div className="panel panel-transparent">
          <div className="panel-body">
            <h3 className="member-results">{organization.metadata.id}</h3>
            <Organization organization={organization} />
          </div>
        </div>
        {relatedContent()}
      </div>
    )
  }

  return (
    <Row>
      {leftSideBar()}
      {content()}
    </Row>
  )
}

export default OrganizationContainer
