import * as React from 'react'
import { Row, Col, Alert } from 'react-bootstrap'
import { gql, useQuery } from '@apollo/client'
import { useQueryState } from 'next-usequerystate'
import Pluralize from 'react-pluralize'

import { PersonType } from '../PersonContainer/PersonContainer'
import Pager from '../Pager/Pager'
import ContentLoader from 'react-content-loader'
import Error from '../Error/Error'
import PersonMetadata from '../PersonMetadata/PersonMetadata'

type Props = {
  searchQuery: string
}

interface PersonQueryData {
  people: {
    __typename: String
    nodes: PersonType[]
    totalCount: number
    pageInfo: PageInfo
  }
}

interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}

interface PersonQueryVar {
  query: string
  cursor: string
}

export const PERSON_GQL = gql`
  query getPersonQuery($query: String, $cursor: String) {
    people(first: 25, query: $query, after: $cursor) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        id
        name
        givenName
        familyName
        alternateName
      }
    }
  }
`

const SearchPerson: React.FunctionComponent<Props> = ({ searchQuery }) => {
  const [cursor] = useQueryState('cursor', { history: 'push' })
  const { loading, error, data } = useQuery<PersonQueryData, PersonQueryVar>(
    PERSON_GQL,
    {
      errorPolicy: 'all',
      variables: { query: searchQuery, cursor: cursor }
    }
  )

  const renderResults = () => {
    if (loading)
      return (
        <Col md={9}>
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
        </Col>
      )

    if (error)
      return (
        <Col md={9}>
          <Error title="An error occured." message={error.message} />
        </Col>
      )

    const hasNextPage = data.people.pageInfo
      ? data.people.pageInfo.hasNextPage
      : false
    const endCursor = data.people.pageInfo ? data.people.pageInfo.endCursor : ''

    if (data.people.nodes.length == 0)
      return (
        <Col md={9}>
          <Alert bsStyle="warning">No people found.</Alert>
        </Col>
      )

    return (
      <Col md={9} id="content">
        {data.people.nodes.length > 0 && (
          <h3 className="member-results">
            {data.people.totalCount.toLocaleString('en-US') + ' '}
            <Pluralize
              singular={'Person'}
              plural={'People'}
              count={data.people.totalCount}
              showCount={false}
            />
          </h3>
        )}

        {data.people.nodes.map((item) => (
          <React.Fragment key={item.id}>
            <PersonMetadata metadata={item} />
          </React.Fragment>
        ))}

        {data.people.totalCount > 25 && (
          <Pager
            url={'/orcid.org?'}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
          ></Pager>
        )}
      </Col>
    )
  }

  return <Row>{renderResults()}</Row>
}

export default SearchPerson
