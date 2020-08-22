import React from 'react'
import { useQueryState } from 'next-usequerystate'

import Teaser from '../../components/Teaser/Teaser'
import Layout from '../../components/Layout/Layout'
import SearchOrganization from '../../components/SearchOrganization/SearchOrganization'

const OrganizationIndexPage = () => {
  const [searchQuery] = useQueryState<string>('query')

  return (
    <Layout title={process.env.NEXT_PUBLIC_TITLE} path={'/ror.org'} >
      <React.Fragment>
        {!searchQuery || searchQuery === '' ? (
          <Teaser title={'organizations'} />
        ) : (
          <SearchOrganization searchQuery={searchQuery} />
        )}
      </React.Fragment>
    </Layout>
  )
}

export default OrganizationIndexPage
