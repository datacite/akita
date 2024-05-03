'use client'

import React from 'react'
import { useQuery } from '@apollo/client'
import Loading from '../Loading/Loading'
import { Alert, Row, Col } from 'src/components/Layout'
import Error from 'src/components/Error/Server'
import PersonMetadata from 'src/components/PersonMetadata/PersonMetadata'
import Pager from 'src/components/Pager/Server'

import { SEARCH_PERSON_QUERY, QueryData, QueryVar } from 'src/data/queries/searchPersonQuery'

import { pluralize } from 'src/utils/helpers'

interface Props {
  variables: QueryVar
}

export default function SearchPerson (props: Props) {
  const { loading, data, error } = useQuery<QueryData, QueryVar>(
    SEARCH_PERSON_QUERY,
    {
      variables: props.variables,
      errorPolicy: 'all'
    }
  )

  if (loading) return <Row><Loading /></Row>

  if (error) return (
    <Row>
      <Col md={9} mdOffset={3}>
        <Error title="An error occured." message={error.message} />
      </Col>
    </Row>
  )

  const people = data?.people

  if (!people || people.nodes.length == 0) return (
    <Col md={9} mdOffset={3}>
      <div className="alert-works">
        <Alert bsStyle="warning">No people found.</Alert>
      </div>
    </Col>
  )


  return (
    <Row>
      <div>
        <Col md={9} mdOffset={3} id="content">
        {people.nodes.length > 0 && (
          <h3 className="member-results">
            {pluralize(people.totalCount, 'Person', false, 'People')}
          </h3>
        )}

        {people.nodes.map((item) => (
          <PersonMetadata metadata={item} key={item.id} />
        ))}

        {(people.totalCount || 0) > 25 && (
          <Pager
            url={'/orcid.org?'}
            hasNextPage={people.pageInfo.hasNextPage}
            endCursor={data.people.pageInfo.endCursor || ''}
          />
        )}
        </Col>
      </div>
    </Row>
  )
}
