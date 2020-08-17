import React from 'react'
import { useQueryState } from 'next-usequerystate'

import Layout from '../../components/Layout/Layout'
import About from '../../components/About/About'
import SearchOrganization from '../../components/SearchOrganization/SearchOrganization'

const OrganizationIndexPage = () => {
  const [searchQuery] = useQueryState<string>('query')

  return (
    <Layout title={process.env.NEXT_PUBLIC_TITLE}>
      <React.Fragment>
        {!searchQuery || searchQuery === '' ? (
          <About title={'Introduction'} />
        ) : (
          <SearchOrganization searchQuery={searchQuery} />
        )}
      </React.Fragment>
    </Layout>
  )
}

export default OrganizationIndexPage
