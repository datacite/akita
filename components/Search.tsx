import * as React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from "@apollo/react-hooks"
import { useQueryState } from 'next-usequerystate'
import { gql } from "apollo-boost"
import { Alert, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link'
import ContentItem from "./ContentItem"
import Error from "./Error"

interface ContentNode {
  node: ContentItem
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
      registrationAgencies: ContentFacet[]
      totalCount: Number
  },
}

interface ContentQueryVar {
  query: string
  cursor: string
  published: string
  resourceTypeId: string
  registrationAgency: string
}

export const CONTENT_GQL = gql`
  query getContentQuery($query: String, $cursor: String, $published: String, $resourceTypeId: String, $registrationAgency: String) {
    works(first: 25, query: $query, after: $cursor, published: $published, resourceTypeId: $resourceTypeId, registrationAgency: $registrationAgency) {
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
  const [registrationAgency, setRegistrationAgency] = useQueryState('registration-agency', { history: 'push' })
  /* eslint-enable no-unused-vars */
  const [searchResults, setSearchResults] = React.useState([])
  const { loading, error, data, refetch, fetchMore } = useQuery<ContentQueryData, ContentQueryVar>(
    CONTENT_GQL,
    {
      errorPolicy: 'all',
      variables: { query: searchQuery, cursor: '', published: published as string, resourceTypeId: resourceType as string, registrationAgency: registrationAgency as string }
    }
  )

  const onSearchChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setSearchQuery(e.currentTarget.value)
  }

  const onSearchClear = () => {
    setSearchQuery('')
  }

  const onNextPage = () => {
    loadMore(data.works.pageInfo.endCursor)
  }

  const loadMore = (cursor: String) => {
    fetchMore(
      { variables: { cursor: cursor },
      updateQuery: (previousResult: ContentQueryData, { fetchMoreResult }) => {
        if (!fetchMoreResult) { return previousResult }

        const newNodes = fetchMoreResult.works.nodes
        const pageInfo = fetchMoreResult.works.pageInfo
        const totalCount = fetchMoreResult.works.totalCount
        const published = fetchMoreResult.works.published
        const resourceTypes = fetchMoreResult.works.resourceTypes
        const registrationAgencies = fetchMoreResult.works.registrationAgencies

        return newNodes.length
          ? {
              works: {
                __typename: previousResult.works.__typename,
                nodes: [...previousResult.works.nodes, ...newNodes],
                pageInfo,
                totalCount,
                published,
                resourceTypes,
                registrationAgencies
              }
          }
          : previousResult
        }
      })
  }

  React.useEffect(() => {
    const typingDelay = setTimeout(() => {
      refetch({ query: searchQuery, cursor: "", published: published as string, resourceTypeId: resourceType as string, registrationAgency: registrationAgency as string })
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
      <Alert bsStyle="info">
        Loading...
      </Alert>
    )

    if (error) return (
      <Error title="An error occured." message={error.message} />
    )

    if (!data) return ''

    if (searchResults.length == 0) return (
      <Alert bsStyle="warning">
        No content found.
      </Alert>
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

        {data.works.pageInfo.hasNextPage &&
          <div className="text-centered">
            <div className="pagination-centered">
              <ul className="pagination">
                <li className="active next">
                  <Button bsStyle="warning" onClick={onNextPage}>Next Page</Button>
                </li>
              </ul>
            </div>
          </div>
        }
      </div>
    )
  }

  const renderFacets = () => {
    if (!data || searchResults.length == 0) return (
      <div className="col-md-3"></div>
    )

    function facetLink(param: string, value: string) {
      let url = '/?'
      let icon = faSquare

      // get current query parameters from next router
      let params = new URLSearchParams(router.query as any)

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
              <FontAwesomeIcon icon={faTimesCircle}/>
            </span>
          }
        </form>

        {renderResults()}
      </div>
    </div>
  )
}

export default Search
