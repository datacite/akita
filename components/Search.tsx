import * as React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link'
import ContentItem from "./ContentItem"
import Error from "./Error"

type Props = {

}

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
}

export const CONTENT_GQL = gql`
  query getContentQuery($query: String!, $cursor: String, $published: String, $resourceTypeId: String) {
    works(first: 25, query: $query, after: $cursor, published: $published, resourceTypeId: $resourceTypeId) {
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

export const Search: React.FunctionComponent<Props> = () => {
  const router = useRouter()
  // set initial searchQuery to query parameter in route
  const [searchQuery, setSearchQuery] = React.useState(router.query.query as string || "")
  const [searchResults, setSearchResults] = React.useState([])
  const { loading, error, data, refetch, fetchMore } = useQuery<ContentQueryData, ContentQueryVar>(
    CONTENT_GQL,
    {
      errorPolicy: 'all',
      variables: { query: "", cursor: "", published: router.query.published as string, resourceTypeId: router.query['resource-type'] as string }
    }
  )

  const onSearchChange = (e: React.FormEvent<HTMLInputElement>): void => {
    // sync searchQuery and query parameter in route
    router.push('/?query=' + e.currentTarget.value)
    setSearchQuery(e.currentTarget.value)
  }

  const onSearchClear = () => {
    // reset searchQuery and sync with query parameter in route
    router.push('/')
    setSearchQuery('')
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
      try {
        // only trigger search with at least one character as input
        // otherwise reset search results
        if (searchQuery.length > 0) {
          refetch({ query: searchQuery, cursor: "", published: router.query.published as string, resourceTypeId: router.query['resource-type'] as string})
        } else {
          setSearchResults([])
        }
      } catch(e) {
        console.log(e)
      }
    }, 300)

    let results: ContentNode[] = []

    if (searchQuery.length > 0) {
      if (data) results = data.works.nodes
    }
    setSearchResults(results)

    return () => clearTimeout(typingDelay)
  }, [searchQuery, data, refetch])

  const renderResults = () => {
    if (searchQuery.length == 0) return (
      <div className="panel panel-transparent">
        <div className="panel-body">
          <h3 className="member">Introduction</h3>
          <p>DataCite Commons is a web interface where you can explore the complete 
          collection of publicly available DOIs from DOI registation agencies DataCite
          and Crossref. You can search, filter, cite results, and more!</p>
          <p>DataCite Commons is work in progress and will officially launch in October 2020.</p>
          <p><a href="https://datacite.org/roadmap.html" target="_blank">Provide input to the DataCite Roadmap</a> | <a href="https://support.datacite.org/docs/datacite-search-user-documentation" target="_blank">Information in DataCite Support</a></p>
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
                  <a href="#" onClick={() => loadMore(data.works.pageInfo.endCursor)}>Next Page</a>
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
      // get current query parameters from next router
      // workaround as type definition does not seem to accept object
      let params = new URLSearchParams(router.query as any)

      if (params.get(param) == value) {
        // if param is present, delete from query and use checked icon
        params.delete(param)
        url += params.toString()
        return <Link href={url}><a><FontAwesomeIcon icon={faCheckSquare}/> </a></Link>
      } else {
        // otherwise replace param with new value and use unchecked icon
        params.set(param, value)
        url += params.toString() 
        return <Link href={url}><a><FontAwesomeIcon icon={faSquare}/> </a></Link>
      }
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
        <input name="query" onChange={onSearchChange} value={searchQuery} placeholder="Type to search..." className="form-control" type="text" />
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
