import * as React from 'react'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'
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
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'

import Error from '../Error/Error'
import Pager from '../Pager/Pager'
// import Search from '../Search/Search'
import { Organization, OrganizationRecord } from '../Organization/Organization'
import { OrganizationMetadataRecord } from '../OrganizationMetadata/OrganizationMetadata'
import { DoiType } from '../DoiContainer/DoiContainer'
import DoiMetadata from '../DoiMetadata/DoiMetadata'
import {
  PageInfo,
  connectionFragment,
  contentFragment
} from '../SearchContent/SearchContent'

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
  pageInfo: PageInfo
  published: ContentFacet[]
  resourceTypes: ContentFacet[]
  languages: ContentFacet[]
  licenses: ContentFacet[]
  fieldsOfScience: ContentFacet[]
  registrationAgencies: ContentFacet[]
  nodes: DoiType[]
}

interface ContentFacet {
  id: string
  title: string
  count: number
}

interface OrganizationQueryData {
  organization: OrganizationResult
}

interface OrganizationQueryVar {
  id: string
  cursor: string
  published: string
  resourceTypeId: string
  language: string
  fieldOfScience: string
  license: string
  registrationAgency: string
}

export const ORGANIZATION_GQL = gql`
  query getOrganizationQuery(
    $id: ID!
    $cursor: String
    $published: String
    $resourceTypeId: String
    $fieldOfScience: String
    $language: String
    $license: String
    $registrationAgency: String
  ) {
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

const OrganizationContainer: React.FunctionComponent<Props> = ({ rorId }) => {
  const router = useRouter()

  const [published] = useQueryState('published', {
    history: 'push'
  })
  const [resourceType] = useQueryState('resource-type', {
    history: 'push'
  })
  const [fieldOfScience] = useQueryState('field-of-science', {
    history: 'push'
  })
  const [license] = useQueryState('license', { history: 'push' })
  const [language] = useQueryState('language', { history: 'push' })
  const [registrationAgency] = useQueryState('registration-agency', {
    history: 'push'
  })
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
      cursor: cursor,
      published: published as string,
      resourceTypeId: resourceType as string,
      fieldOfScience: fieldOfScience as string,
      language: language as string,
      license: license as string,
      registrationAgency: registrationAgency as string
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

  if (!organization) return <div></div>

  const renderFacets = () => {
    if (loading) return <div className="col-md-3"></div>

    if (!loading && data.organization.works.nodes.length == 0)
      return <div className="col-md-3"></div>

    function facetLink(param: string, value: string) {
      let url = '?'
      let icon = faSquare

      // get current query parameters from next router
      let params = new URLSearchParams(router.query as any)

      // delete organization parameter
      params.delete('organization')

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
      <div className="col-md-3 hidden-xs hidden-sm">
        <div className="panel facets add">
          <div className="panel-body">
            <h4>Publication Year</h4>
            <ul>
              {data.organization.works.published.map((facet) => (
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
            <ul>
              {data.organization.works.resourceTypes.map((facet) => (
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

        {data.organization.works.fieldsOfScience.length > 0 && (
          <div className="panel facets add">
            <div className="panel-body">
              <h4>Field of Science</h4>
              <ul>
                {data.organization.works.fieldsOfScience.map((facet) => (
                  <li key={facet.id}>
                    {facetLink('field-of-science', facet.id)}
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

        {data.organization.works.licenses.length > 0 && (
          <div className="panel facets add">
            <div className="panel-body">
              <h4>License</h4>
              <ul>
                {data.organization.works.licenses.map((facet) => (
                  <li key={facet.id}>
                    {facetLink('license', facet.id)}
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

        {data.organization.works.languages.length > 0 && (
          <div className="panel facets add">
            <div className="panel-body">
              <h4>Language</h4>
              <ul>
                {data.organization.works.languages.map((facet) => (
                  <li key={facet.id}>
                    {facetLink('language', facet.id)}
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

        <div className="panel facets add">
          <div className="panel-body">
            <h4>DOI Registration Agency</h4>
            <ul>
              {data.organization.works.registrationAgencies.map((facet) => (
                <li key={facet.id}>
                  {facetLink('registration-agency', facet.id)}
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
      </div>
    )
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
          No works found.
        </Alert>
      )

    return (
      <div className="col-md-9" id="related-content">
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

        {data.organization.works.totalCount > 25 && (
          <Pager
            url={'/ror.org/' + rorId + '/?'}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
          />
        )}
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
        <h3 className="member-results">{organization.metadata.id}</h3>
        <Organization organization={organization} />
      </div>
    )
  }

  return (
    <React.Fragment>
      <Row>
        {leftSideBar()}
        {content()}
      </Row>
      <Row>
        {renderFacets()}
        {relatedContent()}
      </Row>
    </React.Fragment>
  )
}

export default OrganizationContainer
