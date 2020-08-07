import * as React from 'react'
import { Row, Alert } from 'react-bootstrap'
import { gql, useQuery } from '@apollo/client'
import { useQueryState } from 'next-usequerystate'
// eslint-disable-next-line no-unused-vars
import { PersonType } from '../PersonContainer/PersonContainer'
import Pager from '../Pager/Pager'
import ContentLoader from 'react-content-loader'
import Error from '../Error/Error'
import PersonMetadata from '../PersonMetadata/PersonMetadata'

type Props = {
  searchQuery: string
}

interface ContentQueryData {
  people: {
    __typename: String
    nodes: PersonType[]
    pageInfo: PageInfo
  }
}

interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}

interface ContentQueryVar {
  query: string
  cursor: string
}

export const CONTENT_GQL = gql`
  query getContentQuery($query: String, $cursor: String) {
    people(first: 25, query: $query, after: $cursor) {
      nodes {
        id
        name
        givenName
        familyName
        # citationCount
        # viewCount
        # downloadCount
        affiliation {
          name
          id
        }
        works {
          totalCount
        }
      }
    }
  }
`

const SearchPerson: React.FunctionComponent<Props> = ({ searchQuery }) => {
  /* eslint-disable no-unused-vars */
  const [cursor, setCursor] = useQueryState('cursor', { history: 'push' })
  /* eslint-enable no-unused-vars */
  const [searchResults, setSearchResults] = React.useState([])
  const { loading, error, data, refetch } = useQuery<
    ContentQueryData,
    ContentQueryVar
  >(CONTENT_GQL, {
    errorPolicy: 'all',
    variables: { query: searchQuery, cursor: cursor }
  })

  React.useEffect(() => {
    const typingDelay = setTimeout(() => {
      refetch({ query: searchQuery, cursor: cursor })
    }, 1000)

    let results: PersonType[] = []

    if (searchQuery) {
      if (data) results = data.people.nodes
    }
    setSearchResults(results)

    return () => clearTimeout(typingDelay)
  }, [searchQuery, data, refetch])

  const renderResults = () => {
    if (loading)
      return (
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-9">
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
          </div>
        </div>
      )

    if (error)
      return <Error title="An error occured." message={error.message} />

    const hasNextPage = data.people.pageInfo
      ? data.people.pageInfo.hasNextPage
      : false
    const endCursor = data.people.pageInfo ? data.people.pageInfo.endCursor : ''

    if (!loading && searchResults.length == 0)
      return (
        <React.Fragment>
          <Alert bsStyle="warning">No content found.</Alert>

          <Pager
            url={'/?'}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
          ></Pager>
        </React.Fragment>
      )

    return (
      <div className="col-md-9 panel-list" id="content">
        <div className="panel panel-transparent content-item">
          <div className="panel-body">
            {searchResults.length > 1 && (
              <h3 className="member-results"> Results</h3>
            )}

            {searchResults.map((item) => (
              <React.Fragment key={item.id}>
                <PersonMetadata metadata={item} />
              </React.Fragment>
            ))}

            <Pager
              url={'/?'}
              hasNextPage={hasNextPage}
              endCursor={endCursor}
            ></Pager>
          </div>
        </div>
      </div>
    )
  }

  const renderFacets = () => {
    if (loading || searchResults.length == 0)
      return <div className="col-md-3"></div>

    return (
      <div className="col-md-3 hidden-xs hidden-sm">
        <div className="panel panel-transparent">
          <div className="panel-body">
            <div className="edit"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Row>
      {renderFacets()}
      {renderResults()}
    </Row>
  )
}

export default SearchPerson
