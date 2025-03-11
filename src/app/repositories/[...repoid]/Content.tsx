import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { Repository as RepositoryType } from 'src/data/types'
import { fetchRepository, QueryVar } from 'src/data/queries/repositoryQuery';

import Error from 'src/components/Error/Error'
import { RepositoryDetail } from 'src/components/RepositoryDetail/RepositoryDetail';
import { RepositorySidebar } from 'src/components/RepositoryDetail/RepositorySidebar'

interface Props {
  variables: QueryVar
  isBot?: boolean
}

export default async function Content(props: Props) {
  const { variables } = props

  const { data, error } = await fetchRepository(variables.id)

  if (error) return (
    <Col md={{ span: 9, offset: 3 }}>
      <Error title="An error occured." message={error.message} />
    </Col>
  )

  const repository = data?.repository || {} as RepositoryType


  return (<Container fluid>
    <Row>
      <RepositorySidebar repo={repository} />

      <Col md={9}>
        <RepositoryDetail repo={repository} />
      </Col>
    </Row>
  </Container>)
}
