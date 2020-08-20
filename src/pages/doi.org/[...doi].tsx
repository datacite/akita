import React from 'react'
import Layout from '../../components/Layout/Layout'
import WorkContainer from '../../components/WorkContainer/WorkContainer'
import { GetServerSideProps } from 'next'

const DoisPage = ({ doiPath }) => {
  return (
    <Layout title={process.env.NEXT_PUBLIC_TITLE}>
      <WorkContainer item={doiPath.join('/')} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const doiPath = context.params.doi

  return {
    props: { doiPath } // will be passed to the page component as props
  }
}

export default DoisPage
