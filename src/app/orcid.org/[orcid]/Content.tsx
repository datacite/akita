import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { QueryVar, fetchPerson } from 'src/data/queries/personQuery'

import Error from 'src/components/Error/Error'
import ShareLinks from 'src/components/ShareLinks/ShareLinks'
import Person from 'src/components/Person/Person'
import { orcidFromUrl } from 'src/utils/helpers'

interface Props {
  variables: QueryVar
  isBot?: boolean
}

export default async function Content(props: Props) {
  const { variables } = props

  const { data, error } = await fetchPerson(variables)

  if (error) return (
    <Col md={{ span: 9, offset: 3 }}>
      <Error title="An error occured." message={error.message} />
    </Col>
  )

  const person = data?.person

  return (
    <Container fluid>
      <Row>
        <Col md={{ span: 9, offset: 3 }}>
          <h3 className="member-results">{person.id}</h3>
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <ShareLinks url={'orcid.org' + orcidFromUrl(person.id)} title={person.name} />
        </Col>
        <Col md={9}>
          <Person person={person} />
        </Col>
      </Row>
    </Container>
  )
}
