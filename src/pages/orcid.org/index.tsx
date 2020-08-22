import React from 'react'
import { useQueryState } from 'next-usequerystate'

import Layout from '../../components/Layout/Layout'
import Teaser from '../../components/Teaser/Teaser'
import SearchPerson from '../../components/SearchPerson/SearchPerson'

const IndexPersonPage = () => {
  const [searchQuery] = useQueryState<string>('query')
  
  return (
    <Layout path={'/orcid.org'} >
      {(!searchQuery || searchQuery === '') ? (
        <Teaser title={'people'} />
      ) : (
        <SearchPerson searchQuery={searchQuery} />
      )}
    </Layout>
  )
}

export default IndexPersonPage
