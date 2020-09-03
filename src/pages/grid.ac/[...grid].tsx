import React from 'react'
import Layout from '../../components/Layout/Layout'
import OrganizationContainer from '../../components/OrganizationContainer/OrganizationContainer'
import { GetServerSideProps } from 'next'
import { useQueryState } from 'next-usequerystate'

const GridPage = ({ gridPath }) => {
  const [searchQuery] = useQueryState<string>('query')

  return (
    <Layout path={gridPath} >
      <OrganizationContainer gridId={gridPath} searchQuery={searchQuery} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const gridPath = 'grid.ac/' + (context.params.grid as String[]).join('/')

  return {
    props: { gridPath }
  }
}

export default GridPage
