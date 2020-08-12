import React from 'react'
import Layout from '../../components/Layout/Layout'
import PersonContainer from '../../components/PersonContainer/PersonContainer'
import { GetServerSideProps } from 'next'

const PersonPage = ({ personPath }) => {
  return (
    <Layout title={process.env.NEXT_PUBLIC_TITLE}>
      <PersonContainer orcid={personPath} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const personPath = context.params.person

  return {
    props: { personPath } // will be passed to the page component as props
  }
}

export default PersonPage
