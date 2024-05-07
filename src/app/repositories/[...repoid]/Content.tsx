import React from 'react'
import { Row, Col } from "src/components/Layout";

import apolloClient from 'src/utils/server/apolloClient'
import { Repository as RepositoryType } from 'src/data/types'
import { REPOSITORY_QUERY, QueryData, QueryVar } from 'src/data/queries/repositoryQuery';

import Error from 'src/components/Error/Error'
import { RepositoryDetail, RepositorySidebar } from 'src/components/RepositoryDetail/RepositoryDetail';

interface Props {
  variables: QueryVar
  isBot?: boolean
}

export default async function Content (props: Props) {
  const { variables } = props

  const { data, error } = await apolloClient.query<QueryData, QueryVar>({
    query: REPOSITORY_QUERY,
    variables: variables,
    errorPolicy: 'all'
  })

  if (error) return (
    <Col md={9} mdOffset={3}>
      <Error title="An error occured." message={error.message} />
    </Col>
  )

  const repository = data?.repository || {} as RepositoryType


  return (
    <Row>
      <Col md={3}>
        <RepositorySidebar repo={repository}/>
      </Col>
      <Col md={9}>
        <RepositoryDetail repo={repository} />
      </Col>
    </Row>
  )
}