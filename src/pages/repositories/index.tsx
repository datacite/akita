import React from 'react'
import { useQueryState } from 'next-usequerystate'

import Teaser from '../../components/Teaser/Teaser'
import Layout from '../../components/Layout/Layout'
import SearchRepository from '../../components/SearchRepository/SearchRepository'

const RepositoryIndexPage = () => {
  const [searchQuery] = useQueryState('query')

  return (
    <Layout path={'/repositories'}>
        {!searchQuery || searchQuery === '' ? (
          <Teaser title={'repositories'} />
        ) : (
          <SearchRepository searchQuery={searchQuery} />
        )}
    </Layout>
  )
}

export default RepositoryIndexPage
