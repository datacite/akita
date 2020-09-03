import React from 'react'
import Layout from '../../components/Layout/Layout'
import WorkContainer from '../../components/WorkContainer/WorkContainer'
import OrganizationContainer from '../../components/OrganizationContainer/OrganizationContainer'
import { GetServerSideProps } from 'next'
import { useQueryState } from 'next-usequerystate'

const DoisPage = ({ doiPath }) => {
  const [searchQuery] = useQueryState<string>('query')

  // if DOI is a Crossref Funder ID
  if (doiPath.startsWith('10.13039'))
    return (
      <Layout path={doiPath} >
        <OrganizationContainer crossrefFunderId={doiPath} searchQuery={searchQuery} />
      </Layout>
    )

  return (
    <Layout path={'/doi.org/' + doiPath } >
      <WorkContainer item={doiPath} searchQuery={searchQuery} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const doiPath = (context.params.doi as String[]).join('/')

  return {
    props: { doiPath }
  }
}

export default DoisPage
