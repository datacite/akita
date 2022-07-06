import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { GetServerSideProps } from 'next'
import Error from '../../components/Error/Error'
import Layout from '../../components/Layout/Layout'
import Loading from '../../components/Loading/Loading'
import { Row, Col } from 'react-bootstrap'
import {
  REPOSITORY_DETAIL_FIELDS,
  RepositoryDetailNode,
  RepositorySidebar,
  RepositoryHeadInfo,
  RepositoryDetail
} from '../../components/RepositoryDetail/RepositoryDetail'

type Props = {
  repoId?: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const repoId = context.params.repoid as string
  return {
    props: { repoId }
  }
}

interface RepositoryQueryData {
  repository: RepositoryDetailNode
}
interface RepositoryQueryVar {
  uid: string
}

export const REPOSITORY_DETAIL_QUERY = gql`
  ${REPOSITORY_DETAIL_FIELDS}
  query repositoryDetailQuery(
    $uid: ID!
  ) {
  repository(id: $uid){
    ...repositoryDetailFields
  }
}
`

const RepositoryDetalPage: React.FunctionComponent<Props> = ({
  repoId
})=> {
  const { loading, error, data } = useQuery<
    RepositoryQueryData, RepositoryQueryVar
  >(REPOSITORY_DETAIL_QUERY, {
    errorPolicy: 'all',
    variables: {
      uid : repoId,
    }
})

  return (
    <Layout path={'/repositories'}>
        {loading? <Loading/>:(
          <>
            {error? <Error title="An error occured." message={error.message} />:(
              <>
                <RepositoryHeadInfo repo={data.repository}/>
                <Row>
                  <Col md={3}>
                    <RepositorySidebar repo={data.repository}/>
                  </Col>
                  <Col md={9}>
                    <RepositoryDetail repo={data.repository}></RepositoryDetail>
                  </Col>
                </Row>
              </>
            )}
          </>
        )}
    </Layout>
  )
}

export default RepositoryDetalPage
