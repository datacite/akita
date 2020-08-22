import React from 'react'
import Layout from '../../components/Layout/Layout'
import PersonContainer from '../../components/PersonContainer/PersonContainer'
import { GetServerSideProps } from 'next'
import { useQueryState } from 'next-usequerystate'

const PersonPage = ({ personPath }) => {
  const [searchQuery] = useQueryState<string>('query')

  return (
    <Layout path={'/orcid.org/' + personPath} >
      <PersonContainer orcid={personPath} searchQuery={searchQuery} />
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
