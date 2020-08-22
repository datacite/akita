import React from 'react'
import Layout from '../../components/Layout/Layout'
import WorkContainer from '../../components/WorkContainer/WorkContainer'
import { GetServerSideProps } from 'next'
import { useQueryState } from 'next-usequerystate'

const DoisPage = ({ doiPath }) => {
  const [searchQuery] = useQueryState<string>('query')

  return (
    <Layout title={process.env.NEXT_PUBLIC_TITLE} path={'/doi.org/' + doiPath.join('/')} >
      <WorkContainer item={doiPath.join('/')} searchQuery={searchQuery} />
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
