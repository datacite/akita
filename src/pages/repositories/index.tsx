import React from 'react'
import { useQueryState } from 'next-usequerystate'
import { Feature } from 'flagged'

import Teaser from '../../components/Teaser/Teaser'
import Layout from '../../components/Layout/Layout'
import SearchRepository from '../../components/SearchRepository/SearchRepository'

const RepositoryIndexPage = () => {
  const [searchQuery] = useQueryState<string>('query')

  return (
    <Layout path={'/repositories'}>
      <Feature name="repository-search-commons">
        {!searchQuery || searchQuery === '' ? (
          <Teaser title={'repositories'} />
        ) : (
          <SearchRepository searchQuery={searchQuery} />
        )}
      </Feature>
    </Layout>
  )
}

export default RepositoryIndexPage
