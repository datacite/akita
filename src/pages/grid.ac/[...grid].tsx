import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { GetServerSideProps } from 'next'
import { Col } from 'react-bootstrap'
import { useRouter } from 'next/router'

import Layout from '../../components/Layout/Layout'
import Error from '../../components/Error/Error'
import Loading from '../../components/Loading/Loading'
import { rorFromUrl } from '../../utils/helpers'

type Props = {
  gridId?: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {	
  const gridId = 'grid.ac/' + (context.params.grid as String[]).join('/')	

  return {	
    props: { gridId }	
  }	
}

export const GRID_GQL = gql`
  query getOrganizationQuery(
    $gridId: ID
  ) {
    organization(
      gridId: $gridId
    ) {
      id
    }
  }
`

interface GridType {
  id: string
}

interface GridQueryData {
  organization: GridType
}

interface GridQueryVar {
  gridId: string
}

const GridPage: React.FunctionComponent<Props> = ({
  gridId
}) => {
  const router = useRouter()
  const { loading, error, data } = useQuery<
    GridQueryData,
    GridQueryVar
  >(GRID_GQL, {
    errorPolicy: 'all',
    variables: {
      gridId: gridId
    }
  })

  if (loading)
    return (
      <Layout path={'/grid.ac/' + gridId } >
        <Loading />
      </Layout>
    )

  if (error)
    return (
      <Layout path={'/grid.ac/' + gridId } >
        <Col md={9} mdOffset={3}>
          <Error title="An error occured." message={error.message} />
        </Col>
      </Layout>
    )

  if (data && data.organization.id && typeof window !== 'undefined') {
    const path = '/ror.org' + rorFromUrl(data.organization.id)
    router.push({ pathname: path })
    return (
      <div className="row">
        <Loading />
      </div>
    )
  }

  return (
    <Layout path={'/grid.ac/' + gridId } >
      <Col md={9} mdOffset={3}>
        <Error title="An error occured." message='GRID ID not found.' />
      </Col>
    </Layout>
  )
}

export default GridPage
