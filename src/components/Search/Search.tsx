import * as React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from "@apollo/react-hooks"
import { useQueryState } from 'next-usequerystate'
import { gql } from "apollo-boost"
import { Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link'
// eslint-disable-next-line no-unused-vars
import { DoiType } from "../DoiContainer/DoiContainer"
import ContentItem from "../ContentItem/ContentItem"
import Error from "../Error/Error"
import ContentLoader from "react-content-loader"

interface ContentNode {
  node: DoiType
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

interface ContentQueryData {
  works: {
      __typename: String
      nodes: ContentNode[]
      pageInfo: PageInfo
      published: ContentFacet[]
      resourceTypes: ContentFacet[]
      fieldsOfScience: ContentFacet[]
      registrationAgencies: ContentFacet[]
      totalCount: Number
  },
}

interface ContentQueryVar {
  query: string
  cursor: string
  published: string
  resourceTypeId: string
  fieldOfScience: string
  registrationAgency: string
}

export const CONTENT_GQL = gql`
  query getContentQuery($query: String, $cursor: String, $published: String, $resourceTypeId: String, $fieldOfScience: String, $registrationAgency: String) {
    works(first: 25, query: $query, after: $cursor, published: $published, resourceTypeId: $resourceTypeId, fieldOfScience: $fieldOfScience, registrationAgency: $registrationAgency) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      resourceTypes {
        id
        title
        count
      }
      published {
        id
        title
        count
      }
      fieldsOfScience {
        id
        title
        count
      }
      registrationAgencies {
        id
        title
        count
      }
      nodes {
        id
        doi
        types {
          resourceTypeGeneral
          resourceType
        }
        titles {
          title
        }
        creators {
          id
          name
          givenName
          familyName
        }
        descriptions {
          description
          descriptionType
        }
        publicationYear
        publisher
        version
        registrationAgency
        citationCount
        viewCount
        downloadCount
      }
    }
  }
`

export const Search: React.FunctionComponent = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useQueryState("query", { history: 'push' })
  /* eslint-disable no-unused-vars */
  const [published, setPublished] = useQueryState('published', { history: 'push' })
  const [resourceType, setResourceType] = useQueryState('resource-type', { history: 'push' })
  const [fieldOfScience, setfieldOfScience] = useQueryState('field-of-science', { history: 'push' })
  const [registrationAgency, setRegistrationAgency] = useQueryState('registration-agency', { history: 'push' })
  const [cursor, setCursor] = useQueryState('cursor', { history: 'push' })
  /* eslint-enable no-unused-vars */
  const [searchResults, setSearchResults] = React.useState([])
  const { loading, error, data, refetch } = useQuery<ContentQueryData, ContentQueryVar>(
    CONTENT_GQL,
    {
      errorPolicy: 'all',
      variables: { query: searchQuery, cursor: cursor, published: published as string, resourceTypeId: resourceType as string, fieldOfScience: fieldOfScience as string, registrationAgency: registrationAgency as string }
    }
  )

  const onSearchChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setSearchQuery(e.currentTarget.value)
  }

  const onSearchClear = () => {
    setSearchQuery('')
  }

  const renderPagination = () => {
    let url = '/?'
    let firstPageUrl = null
    let nextPageUrl = null

    // get current query parameters from next router
    let params = new URLSearchParams(router.query as any)

    if (params.get('cursor')) {
      // remove cursor query parameter for first page
      params.delete('cursor')
      firstPageUrl = url + params.toString()
    }

    if (data.works.pageInfo.hasNextPage && data.works.pageInfo.endCursor) {
      // set cursor query parameter for next page
      params.set('cursor', data.works.pageInfo.endCursor)
      nextPageUrl = url + params.toString()
    }

    return (
      <div className="pagination-centered">
        <ul className="pagination">
          {firstPageUrl &&
            <li className="page-number">
              <Link href={firstPageUrl}><a>First Page</a></Link>
            </li>
          }
          {nextPageUrl &&
            <li className="page-number">
              <Link href={nextPageUrl}><a>Next Page</a></Link>
            </li>
          }
        </ul>
      </div>
    )
  }

  React.useEffect(() => {
    const typingDelay = setTimeout(() => {
      refetch({ query: searchQuery, cursor: cursor, published: published as string, resourceTypeId: resourceType as string, fieldOfScience: fieldOfScience as string, registrationAgency: registrationAgency as string })
    }, 1000)

    let results: ContentNode[] = []

    if (searchQuery) {
      if (data) results = data.works.nodes
    }
    setSearchResults(results)

    return () => clearTimeout(typingDelay)
  }, [searchQuery, data, refetch])

  const renderResults = () => {
    if (!searchQuery) return (
      <div className="panel panel-transparent">
        <div className="panel-body">
          <h3 className="member">Introduction</h3>
          <p>DataCite Commons is a web interface where you can explore the complete 
          collection of publicly available DOIs from DOI registation agencies DataCite
          and Crossref. You can search, filter, cite results, and more!</p>
          <p>DataCite Commons is work in progress and will officially launch in October 2020.</p>
          <p><a href="https://datacite.org/roadmap.html" target="_blank" rel="noreferrer">Provide input to the DataCite Roadmap</a> | <a href="https://support.datacite.org/docs/datacite-search-user-documentation" target="_blank" rel="noreferrer">Information in DataCite Support</a></p>
        </div>
      </div>
    )

    if (loading) return (
      <ContentLoader 
        speed={1}
        width={1000}
        height={250}
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
    )

    if (error) return (
      <Error title="An error occured." message={error.message} />
    )

    if (!data) return ''

    if (searchResults.length == 0) return (
      <React.Fragment>
        <Alert bsStyle="warning">
          No content found.
        </Alert>

        {renderPagination()}
      </React.Fragment>
    )

    return (
      <div>
        {searchResults.length > 1 &&
         <h3 className="member-results">{data.works.totalCount.toLocaleString('en-US')} Results</h3>
        }

        {searchResults.map(item => (
          <React.Fragment key={item.id}>
            <ContentItem item={item} />
          </React.Fragment>
        ))}

        {renderPagination()}
      </div>
    )
  }

  const renderFacets = () => {
    if (loading) return (
      <div className="col-md-3"></div>
    )

    if (!data || searchResults.length == 0) return (
      <div className="col-md-3"></div>
    )

    function facetLink(param: string, value: string) {
      let url = '/?'
      let icon = faSquare

      // get current query parameters from next router
      let params = new URLSearchParams(router.query as any)

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
      return <Link href={url}><a><FontAwesomeIcon icon={icon}/> </a></Link>
    }

    return (
      <div className="col-md-3 hidden-xs hidden-sm">
        <div className="panel panel-transparent">
          <div className="panel-body">
            <div className="edit"></div>
          </div>
        </div>

        <div className="panel facets add">
          <div className="panel-body">
            <h4>Publication Year</h4>
            <ul>
              {data.works.published.map(facet => (
                <li key={facet.id}>
                  {facetLink('published', facet.id)}
                  <div className="facet-title">{facet.title}</div>
                  <span className="number pull-right">{facet.count.toLocaleString('en-US')}</span>
                  <div className="clearfix"/>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panel facets add">
          <div className="panel-body">
            <h4>Content Type</h4>
            <ul>
              {data.works.resourceTypes.map(facet => (
                <li key={facet.id}>
                  {facetLink('resource-type', facet.id)}
                  <div className="facet-title">{facet.title}</div>
                  <span className="number pull-right">{facet.count.toLocaleString('en-US')}</span>
                  <div className="clearfix"/>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {data.works.fieldsOfScience.length > 0 &&
          <div className="panel facets add">
            <div className="panel-body">
              <h4>Field of Science</h4>
              <ul>
                {data.works.fieldsOfScience.map(facet => (
                  <li key={facet.id}>
                    {facetLink('field-of-science', facet.id)}
                    <div className="facet-title">{facet.title}</div>
                    <span className="number pull-right">{facet.count.toLocaleString('en-US')}</span>
                    <div className="clearfix"/>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }

        <div className="panel facets add">
          <div className="panel-body">
            <h4>DOI Registration Agency</h4>
            <ul>
            {data.works.registrationAgencies.map(facet => (
              <li key={facet.id}>
                {facetLink('registration-agency', facet.id)}
                <div className="facet-title">{facet.title}</div>
                <span className="number pull-right">{facet.count.toLocaleString('en-US')}</span>
                <div className="clearfix"/>
              </li>
            ))}
          </ul>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="row">
      {renderFacets()}
      <div className="col-md-9 panel-list" id="content">
        <form className="form-horizontal search">
          <input name="query" value={searchQuery || ''} onChange={onSearchChange} placeholder="Type to search..." className="form-control" type="text" />
          <span id="search-icon" title="Search" aria-label="Search">
            <FontAwesomeIcon icon={faSearch}/>
          </span>
          {searchQuery &&
            <span id="search-clear" title="Clear" aria-label="Clear" onClick={onSearchClear}>
              <FontAwesomeIcon icon={faTimes}/>
            </span>
          }
        </form>

        {renderResults()}
      </div>
    </div>
  )
}

export default Search