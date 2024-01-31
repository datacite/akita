import React from 'react'
import { Row, Col, Alert } from 'react-bootstrap'
import { gql, useQuery } from '@apollo/client'
import { useQueryState } from 'next-usequerystate'
import { pluralize } from '../../utils/helpers'

import { PersonType } from '../../pages/orcid.org/[orcid]'
import Pager from '../Pager/Pager'
import Error from '../Error/Error'
import PersonMetadata from '../PersonMetadata/PersonMetadata'
import Loading from '../Loading/Loading'

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
  query getSearchPersonQuery($query: String, $cursor: String) {
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
    if (loading) return <Loading />

    if (error)
      return (
        <Col md={9} mdOffset={3}>
          <Error title="An error occured." message={error.message} />
        </Col>
      )

    const hasNextPage = data.people.pageInfo
      ? data.people.pageInfo.hasNextPage
      : false
    const endCursor = data.people.pageInfo ? data.people.pageInfo.endCursor : ''

    if (data.people.nodes.length == 0)
      return (
        <Col md={9} mdOffset={3}>
          <Alert bsStyle="warning">No people found.</Alert>
        </Col>
      )

    return (
      <Col md={9} mdOffset={3} id="content">
        {data.people.nodes.length > 0 && (
          <h3 className="member-results">
            {pluralize(data.people.totalCount, 'Person', false, 'People')}
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
