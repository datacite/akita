import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { Person as PersonType } from 'src/data/types'
import { fetchPerson } from 'src/data/queries/personQuery'

import Error from 'src/components/Error/Error'
import Person from 'src/components/Person/Person'

interface Props {
  orcid: string
  isBot?: boolean
}

export default async function Content(props: Props) {
  const { orcid } = props

  const { data, error } = await fetchPerson(orcid)

  if (error) return (
    <Col md={{ span: 9, offset: 3 }}>
      <Error title="An error occured." message={error.message} />
    </Col>
  )

  const person = data?.person || {} as PersonType

  return (
    <Container fluid>
      <Row>
        <Col md={{ span: 9, offset: 3 }}>
          <Person person={person} />
        </Col>
      </Row>
    </Container>
  )
}
