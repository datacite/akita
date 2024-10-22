'use client'

import React from 'react'
import { useQuery } from '@apollo/client'
import Loading from 'src/components/Loading/Loading'
import { Alert, Row, Col } from 'react-bootstrap'
import Error from 'src/components/Error/Error'
import PersonMetadata from 'src/components/PersonMetadata/PersonMetadata'
import Pager from 'src/components/Pager/Pager'

import { SEARCH_PERSON_QUERY, QueryData, QueryVar } from 'src/data/queries/searchPersonQuery'

import { pluralize } from 'src/utils/helpers'

interface Props {
  variables: QueryVar
}

export default function SearchPerson(props: Props) {
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
      <Col md={{ span: 9, offset: 3 }}>
        <Error title="An error occured." message={error.message} />
      </Col>
    </Row>
  )

  const people = data?.people

  if (!people || people.nodes.length == 0) return (
    <Col md={{ span: 9, offset: 3 }}>
      <div className="alert-works">
        <Alert variant="warning">No people found.</Alert>
      </div>
    </Col>
  )


  return (<>
    <Row><Col md={{ span: 9, offset: 3 }}>
      {people.nodes.length > 0 && (
        <h3 className="member-results">
          {pluralize(people.totalCount, 'Person', false, 'People')}
        </h3>
      )}
    </Col></Row>

    <Row><Col md={{ span: 9, offset: 3 }}>
      {people.nodes.map((item) => (
        <PersonMetadata metadata={item} key={item.id} />
      ))}
    </Col></Row>


    <Row><Col md={{ span: 9, offset: 3 }}>
      {(people.totalCount || 0) > 25 && (
        <Pager
          url={'/orcid.org?'}
          hasNextPage={people.pageInfo.hasNextPage}
          endCursor={data.people.pageInfo.endCursor || ''}
        />
      )}
    </Col></Row>
  </>)
}
