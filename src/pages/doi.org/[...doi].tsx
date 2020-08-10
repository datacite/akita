import React from 'react'
import Layout from '../../components/Layout/Layout'
import DoiContainer from '../../components/DoiContainer/DoiContainer'
/* eslint-disable no-unused-vars*/
import { GetServerSideProps } from 'next'
/* eslint-enable no-unused-vars*/

const DoisPage = ({ doiPath }) => {
  return (
    <Layout title={process.env.NEXT_PUBLIC_TITLE}>
      <DoiContainer item={doiPath.join('/')} />
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
