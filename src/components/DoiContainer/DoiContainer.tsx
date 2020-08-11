/* eslint-disable react/jsx-no-target-blank */
import * as React from 'react'
import Error from '../Error/Error'
import { gql, useQuery } from '@apollo/client'
import Doi from '../Doi/Doi'
import {
  connectionFragment,
  contentFragment
} from '../SearchContent/SearchContent'
import ContentLoader from 'react-content-loader'
import { useQueryState } from 'next-usequerystate'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton
} from 'react-share'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import { useRouter } from 'next/router'
import Link from 'next/link'

type Props = {
  item?: string
}

export const DOI_GQL = gql`
  query getContentQuery($id: ID!, $cursor: String, $published: String, $resourceTypeId: String, $fieldOfScience: String, $language: String, $license: String, $registrationAgency: String, $repositoryId: String) {
    work(id: $id) {
      ...WorkFragment
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
      citations(first: 25, after: $cursor, published: $published, resourceTypeId: $resourceTypeId, fieldOfScience: $fieldOfScience, language: $language, license: $license, registrationAgency: $registrationAgency, repositoryId: $repositoryId) {
        ...WorkConnectionFragment
        nodes {
          ...WorkFragment
        }
      }
      references(first: 5, after: $cursor, published: $published, resourceTypeId: $resourceTypeId, fieldOfScience: $fieldOfScience, language: $language, license: $license, registrationAgency: $registrationAgency, repositoryId: $repositoryId) {
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
    published: ContentFacet[]
    resourceTypes: ContentFacet[]
    languages: ContentFacet[]
    licenses: ContentFacet[]
    fieldsOfScience: ContentFacet[]
    registrationAgencies: ContentFacet[]
    nodes: DoiType[]
    pageInfo: PageInfo
    totalCount: number
  }
  viewCount?: number
  viewsOverTime?: UsageMonth[]
  downloadCount?: number
  downloadsOverTime?: UsageMonth[]
  references?: {
    published: ContentFacet[]
    resourceTypes: ContentFacet[]
    languages: ContentFacet[]
    licenses: ContentFacet[]
    fieldsOfScience: ContentFacet[]
    registrationAgencies: ContentFacet[]
    nodes: DoiType[]
    pageInfo: PageInfo
    totalCount: number
  }
}

interface ContentFacet {
  id: string
  title: string
  count: number
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
  year: number
  total: number
}

export interface UsageMonth {
  yearMonth: string
  total: number
}

export interface RelatedContentList {
  nodes: {
    id: string
    formattedCitation: string
    repository: {
      name: string
      re3dataId: string
      id: string
    }
    registrationAgency: {
      name: string
      id: string
    }
    member: {
      name: string
      id: string
    }
  }
}

export interface DoiQueryData {
  work: DoiType
}

interface DoiQueryVar {
  id: string
  cursor: string
  published: string
  resourceTypeId: string
  language: string
  fieldOfScience: string
  registrationAgency: string
}

const DoiContainer: React.FunctionComponent<Props> = ({ item }) => {
  // const [selectedOption, setSelectedOption] = React.useState('')
  const router = useRouter()

  const [doi, setDoi] = React.useState<DoiType>()
  const [cursor] = useQueryState('cursor', { history: 'push' })

  const [published, setPublished] = useQueryState('published', { history: 'push' })
  const [resourceType, setResourceType] = useQueryState('resource-type', { history: 'push' })
  const [fieldOfScience, setFieldOfScience] = useQueryState('field-of-science', { history: 'push' })
  const [language, setLanguage] = useQueryState('language', { history: 'push' })
  const [registrationAgency, setRegistrationAgency] = useQueryState('registration-agency', { history: 'push' })


  const { loading, error, data } = useQuery<DoiQueryData, DoiQueryVar>(
    DOI_GQL,
    {
      errorPolicy: 'all',
      variables: { id: item, cursor: cursor,  published: published as string, resourceTypeId: resourceType as string, fieldOfScience: fieldOfScience as string, language: language as string, registrationAgency: registrationAgency as string}
    }
  )

  React.useEffect(() => {
    let result = undefined
    if (data) {
      result = data.work
    }

    setDoi(result)
  }, [item, data])

  if (loading || !doi)
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

    if (!loading && doi.citations.nodes.length == 0)
      return <div className="col-md-3"></div>

    function facetLink(param: string, value: string) {
      let url = '?'
      let icon = faSquare

      // get current query parameters from next router
      let params = new URLSearchParams(router.query as any)

      // delete person parameter
      params.delete('doi')

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
        <div className="panel facets add">
          <div className="panel-body">
            <h4>Publication Year</h4>
            <ul id="published-facets">
              {doi.citations.published.map((facet) => (
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
              {doi.citations.resourceTypes.map((facet) => (
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

        {doi.citations.registrationAgencies && doi.citations.registrationAgencies.length > 0 && (
          <div className="panel facets add">
            <div className="panel-body">
              <h4>Registration Agency</h4>
              <ul id="repository-facets">
                {doi.citations.registrationAgencies.map((facet) => (
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
        )}

        {doi.citations.languages && doi.citations.languages.length > 0 && (
          <div className="panel facets add">
            <div className="panel-body">
              <h4>Language</h4>
              <ul id="affiliation-facets">
                {doi.citations.languages.map((facet) => (
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
      </div>
    )
  }

  const leftSideBar = () => {
    const title = 'DataCite Commons: ' + doi.titles[0].title
    const url = window.location.href

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
            <div id="export-xml" className="download">
              <a
                target="_blank"
                rel="noopener"
                href={
                  process.env.NEXT_PUBLIC_API_URL +
                  '/dois/application/vnd.datacite.datacite+xml/' +
                  doi.doi
                }
              >
                DataCite XML
              </a>
            </div>
            <div id="export-json" className="download">
              <a
                target="_blank"
                rel="noopener"
                href={
                  process.env.NEXT_PUBLIC_API_URL +
                  '/dois/application/vnd.datacite.datacite+json/' +
                  doi.doi
                }
              >
                DataCite JSON
              </a>
            </div>
            <div id="export-ld" className="download">
              <a
                target="_blank"
                rel="noopener"
                href={
                  process.env.NEXT_PUBLIC_API_URL +
                  '/dois/application/vnd.schemaorg.ld+json/' +
                  doi.doi
                }
              >
                Schema.org JSON-LD
              </a>
            </div>
            <div id="export-bibtex" className="download">
              <a
                target="_blank"
                rel="noopener"
                href={
                  process.env.NEXT_PUBLIC_API_URL +
                  '/dois/application/x-bibtex/' +
                  doi.doi
                }
              >
                BibTeX
              </a>
            </div>
            <div id="export-ris" className="download">
              <a
                target="_blank"
                rel="noopener"
                href={
                  process.env.NEXT_PUBLIC_API_URL +
                  '/dois/application/x-research-info-systems/' +
                  doi.doi
                }
              >
                RIS
              </a>
            </div>
            <div id="export-jats" className="download">
              <a
                target="_blank"
                rel="noopener"
                href={
                  process.env.NEXT_PUBLIC_API_URL +
                  '/dois/application/vnd.jats+xml/' +
                  doi.doi
                }
              >
                JATS
              </a>
            </div>
            {doi.types.resourceTypeGeneral === 'Software' && (
              <div id="export-codemeta" className="download">
                <a
                  target="_blank"
                  rel="noopener"
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    '/dois/application/vnd.codemeta.ld+json/' +
                    doi.doi
                  }
                >
                  Codemeta
                </a>
              </div>
            )}
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
      <div className="col-md-9 panel-list" id="content">
        <Doi doi={doi}></Doi>
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

export default DoiContainer
