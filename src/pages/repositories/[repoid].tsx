import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { GetServerSideProps } from 'next'
import Error from '../../components/Error/Error'
import Head from 'next/head'
import Layout from '../../components/Layout/Layout'
import Loading from '../../components/Loading/Loading'
import { Row, Col } from 'react-bootstrap'
import {
  REPOSITORY_DETAIL_FIELDS,
  RepositoryDetailNode,
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
  id: string
}

export const REPOSITORY_DETAIL_QUERY = gql`
  ${REPOSITORY_DETAIL_FIELDS}
  query repositoryDetailQuery(
    $id: ID!
  ) {
  repository(id: $id){
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
      id : repoId,
    }
})


  const content = () => {
    if (error)
      return (
        <Error title="An error occured." message={error.message} />
    )
    return (
      <Col md={9}>
        <h1> Repository Detail Page {repoId}</h1>
        <RepositoryDetail repo={data.repository}></RepositoryDetail>
      </Col>
    )
  }
  const relatedContent = () => {
    return (
      <Col md={3}>
      </Col>
    )

  }

  const headMetadata = () => {
    const title = data.repository.name
      ? 'DataCite Commons: ' + data.repository.name
      : 'DataCite Commons: No Name'
    const pageUrl =
      process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
        ? 'https://commons.datacite.org/repositories/' + repoId
        : 'https://commons.stage.datacite.org/repositories/' + repoId

    const imageUrl =
      process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
        ? 'https://commons.datacite.org/images/logo.png'
        : 'https://commons.stage.datacite.org/images/logo.png'
    return (
      <>
          <title>{title}</title>
          <meta name="og:title" content={title} />
          <meta name="og:url" content={pageUrl} />
          <meta name="og:image" content={imageUrl} />
          <meta name="og:type" content="organization" />
      </>
    )
  }

  return (
    <Layout path={'repositories'}>
    {loading? <Loading/>:(
      <>
        <Head>
          {headMetadata()}
        </Head>
        <Row>
          {relatedContent()}
          {content()}
        </Row>
      </>
    )}
    </Layout>
  )
}

export default RepositoryDetalPage
