import * as React from 'react'
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { Alert } from 'react-bootstrap'
import ContentItem from "../ContentItem/ContentItem"
import Error from "../Error/Error"

type Props = {

};

interface ContentNode {
  node: ContentQueryItem
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
      years: ContentFacet[];
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
      years {
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
        descriptions {
          description
          descriptionType
        }
        creators {
          id
          name
          givenName
          familyName
        }
        publicationYear
        publisher
      }
    }
  }
`

export const Search: React.FunctionComponent<Props> = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<Content[]>([]);
  const { loading, error, data, refetch, fetchMore } = useQuery<ContentQueryData, ContentQueryVar>(
    CONTENT_GQL,
    {
      errorPolicy: 'all',
      variables: { query: "", cursor: ""
    }
  })

  const onSearchChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setSearchQuery(e.currentTarget.value);
  };

  const loadMore = (cursor: String) => {
    fetchMore(
      { variables: { cursor: cursor },
      updateQuery: (previousResult: ContentQueryData, { fetchMoreResult }) => {
        if (!fetchMoreResult) { return previousResult; }

        const newNodes = fetchMoreResult.works.nodes;
        const pageInfo = fetchMoreResult.works.pageInfo;
        const totalCount = fetchMoreResult.works.totalCount;
        const years = fetchMoreResult.works.years;
        const resourceTypes = fetchMoreResult.works.resourceTypes;
        const registrationAgencies = fetchMoreResult.works.registrationAgencies;

        return newNodes.length
          ? {
              works: {
                __typename: previousResult.works.__typename,
                nodes: [...previousResult.works.nodes, ...newNodes],
                pageInfo,
                totalCount,
                years,
                resourceTypes,
                registrationAgencies
              }
          }
          : previousResult;
        }
      })
  }

  React.useEffect(() => {
    const typingDelay = setTimeout(() => {
      refetch({ query: searchQuery, cursor: ""})
    }, 300)

    const results: Content[] = [];
    if (data) {
      data.works.nodes.map(item => {
        results.push(item);

        return results;
        }
      )
    }
    setSearchResults(results);

    return () => clearTimeout(typingDelay)
  }, [searchQuery, data, refetch]);

  const renderResults = () => {
    if (loading) return (
      <Alert bsStyle="info">
        Loading...
      </Alert>
    )

    if (error) return <Error title="An error occured." message={error.message} />;

    if (!data ) return '';

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
          <div key={item.id}>
            <ContentItem item={item} />
          </div>
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
    if (!data || data.works.totalCount == 0) return '';

    return (
      <div>
        <div className="panel panel-transparent">
          <div className="panel-body">
            <div className="edit"></div>
          </div>
        </div>

        <div className="panel facets add">
          <div className="panel-body">
            <h4>Publication Year</h4>
            <ul>
              {data.works.years.map(facet => (
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
      <div className="col-md-3">
        {renderFacets()}
      </div>
      <div className="col-md-9 panel-list" id="content">
        <form className="form-horizontal">
          <div id="search" className="input-group">
            <input name="query" onChange={onSearchChange} value={searchQuery} placeholder="Type to search..." className="form-control" type="text" />
            <div className="input-group-btn">
              <button className="btn btn-primary hidden-xs" type="submit">Search</button>
            </div>
          </div>
        </form>

        {renderResults()}
      </div>
    </div>
  )
}

export default Search;
