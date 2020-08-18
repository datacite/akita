import * as React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Col, Alert, OverlayTrigger, Popover } from 'react-bootstrap'
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
import clone from 'lodash/clone'
import Pluralize from 'react-pluralize'

import Error from '../Error/Error'
import Pager from '../Pager/Pager'
import DoiFacet from '../DoiFacet/DoiFacet'
import { Organization } from '../Organization/Organization'
import { DoiType } from '../DoiContainer/DoiContainer'
import DoiMetadata from '../DoiMetadata/DoiMetadata'
import TypesChart from '../TypesChart/TypesChart'
import LicenseChart from '../LicenseChart/LicenseChart'
import ProductionChart from '../ProductionChart/ProductionChart'
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
    return (      
      <React.Fragment>
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <Error title="An error occured." message={error.message} />
        </div>
      </React.Fragment>
    )
  }

  const renderFacets = () => {
    return (
      <div className="col-md-3 hidden-xs hidden-sm">
        <DoiFacet
          model="organization"
          data={data.organization.works}
          loading={loading}
        ></DoiFacet>
      </div>
    )
  }

  const analyticsBar = () => {
    if (!data.organization.works.totalCount) return null

    const published = data.organization.works.published.map((x) => ({
      title: x.title,
      count: x.count
    }))
    const resourceTypes = data.organization.works.resourceTypes.map((x) => ({
      title: x.title,
      count: x.count
    }))

    const noLicenseValue: ContentFacet = {
      id: 'no-license',
      title: 'No License',
      count:
        data.organization.works.totalCount -
        data.organization.works.licenses.reduce(
          (a, b) => a + (b['count'] || 0),
          0
        )
    }
    let licenses = clone(data.organization.works.licenses)
    licenses.unshift(noLicenseValue)
    licenses = licenses.map((x) => ({
      id: x.id,
      title: x.title,
      count: x.count
    }))
 
    return (
      <React.Fragment>
        <Row>
          <Col xs={6}>
            <ProductionChart
              data={published}
              doiCount={data.organization.works.totalCount}
            ></ProductionChart>
          </Col>
          <Col xs={3}>
            <TypesChart
              data={resourceTypes}
              legend={false}
              count={data.organization.works.totalCount}
            ></TypesChart>
          </Col>
          <Col xs={3}>
            <LicenseChart
              data={licenses}
              legend={false}
              count={data.organization.works.totalCount}
            ></LicenseChart>
          </Col>
        </Row>
      </React.Fragment>
    )
  }

  const relatedContent = () => {
    const hasNextPage = data.organization.works.totalCount > 25
    const endCursor = data.organization.works.pageInfo
      ? data.organization.works.pageInfo.endCursor
      : ''

    if (!data.organization.works.totalCount)
      return (
        <div className="col-md-9">
          <div className="alert-works">
            <Alert bsStyle="warning">No works found.</Alert>
          </div>
        </div>
      )

    return (
      <div className="col-md-9" id="related-content">
        {data.organization.works.totalCount > 0 && (
          <h3 className="member-results">
            {data.organization.works.totalCount.toLocaleString('en-US') + ' '}
            <Pluralize
              singular={'Work'}
              count={data.organization.works.totalCount}
              showCount={false}
            />
          </h3>
        )}

        {analyticsBar()}

        {data.organization.works.nodes.map((work) => (
          <React.Fragment key={work.id}>
            <DoiMetadata metadata={work} />
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
        <h3 className="member-results">{data.organization.id}</h3>
        <Organization organization={data.organization} />
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
