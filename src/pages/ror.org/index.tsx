import React from 'react'
import { useQueryState } from 'next-usequerystate'

import Teaser from '../../components/Teaser/Teaser'
import Layout from '../../components/Layout/Layout'
import SearchOrganization from '../../components/SearchOrganization/SearchOrganization'

const OrganizationIndexPage = () => {
  const [searchQuery] = useQueryState<string>('query')

  return (
    <Layout path={'/ror.org'} >
      {!searchQuery || searchQuery === '' ? (
        <Teaser title={'organizations'} />
      ) : (
        <SearchOrganization searchQuery={searchQuery} />
      )}
    </Layout>
  )
}

export default OrganizationIndexPage
