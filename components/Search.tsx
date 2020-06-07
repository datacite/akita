import * as React from 'react'
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { Alert, Button, InputGroup, FormControl } from 'react-bootstrap'
import ContentItem from "./ContentItem"
import Error from "./Error"

type Props = {

};

interface ContentNode {
  node: ContentItem
}

interface ContentFacet {
  id: string
  title: string
  count: number
}

interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

interface ContentQueryData {
  works: {
      __typename: String;
      nodes: ContentNode[];
      pageInfo: PageInfo;
      published: ContentFacet[];
      resourceTypes: ContentFacet[];
      registrationAgencies: ContentFacet[];
      totalCount: Number;
  },
}

interface ContentQueryVar {
  query: string;
  cursor: string;
}

export const CONTENT_GQL = gql`
  query getContentQuery($query: String!, $cursor: String) {
    works(first: 25, query: $query, after: $cursor) {
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
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<Content[]>([])
  const { loading, error, data, refetch, fetchMore } = useQuery<ContentQueryData, ContentQueryVar>(
    CONTENT_GQL,
    {
      errorPolicy: 'all',
      variables: { query: "", cursor: ""
    }
  })

  const onSearchChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setSearchQuery(e.currentTarget.value)
  }

  const onSearchClear = (e: React.FormEvent<HTMLInputElement>): void => {
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
        // only trigger search with at least two characters as input
        // if (searchQuery.length > 1) {
        refetch({ query: searchQuery, cursor: ""})
      } catch(e) {
        console.log(e)
      }
    }, 300)

    let results: Content[] = []
    if (data) results = data.works.nodes
    setSearchResults(results);

    return () => clearTimeout(typingDelay)
  }, [searchQuery, data, refetch])

  const renderResults = () => {
    if (loading) return (
      <Alert bsStyle="info">
        Loading...
      </Alert>
    )

    if (error) return (
      <Error title="An error occured." message={error.message} />
    )

    if (!data ) return ''

    if (data.works.totalCount == 0) return (
      <Alert bsStyle="warning">
        No content found.
      </Alert>
    )

    return (
      <div>
        {data.works.totalCount > 1 &&
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
    if (!data || data.works.totalCount == 0) return (
      <div className="col-md-3"></div>
    )
    
    return (
      <div className="col-md-3">
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
                  <a href="#"><i className='fa fa-square-o'></i></a>
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
                  <a href="#"><i className='fa fa-square-o'></i></a>
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
                <a href="#"><i className='fa fa-square-o'></i></a>
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
        <form className="form-horizontal">
          <InputGroup id="search">
            <FormControl
              type="text"
              name="query"
              value={searchQuery}
              placeholder="Type to search..."
              onChange={onSearchChange}
            />
            {searchQuery &&
              <span id="search-clear" title="Clear" aria-label="Clear" onClick={onSearchClear}>
                <i className='fa fa-times-circle'></i>
              </span>
            }
            <InputGroup.Button>
              <Button bsStyle="primary" type="submit">Search</Button>
            </InputGroup.Button>
          </InputGroup>
        </form>

        {renderResults()}
      </div>
    </div>
  )
}

export default Search;
