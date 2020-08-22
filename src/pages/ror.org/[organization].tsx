import React from 'react'
import Layout from '../../components/Layout/Layout'
import OrganizationContainer from '../../components/OrganizationContainer/OrganizationContainer'
import { GetServerSideProps } from 'next'
import { useQueryState } from 'next-usequerystate'

const OrganizationPage = ({ organizationPath }) => {
  const [searchQuery] = useQueryState<string>('query')

  return (
    <Layout path={'/ror.org/' + organizationPath} >
      <OrganizationContainer rorId={organizationPath} searchQuery={searchQuery} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const organizationPath = context.params.organization

  return {
    props: { organizationPath }
  }
}

export default OrganizationPage
