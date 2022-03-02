import React from 'react'
import { useQueryState } from 'next-usequerystate'

import Layout from '../../components/Layout/Layout'
import Teaser from '../../components/Teaser/Teaser'
import SearchWork from '../../components/SearchWork/SearchWork'

const IndexPage = () => {
  const [searchQuery] = useQueryState('query')

  return (
    <Layout path={'/doi.org'} >
      {!searchQuery || searchQuery === '' ? (
        <Teaser title={'works'} />
      ) : (
        <SearchWork searchQuery={searchQuery} />
      )}
    </Layout>
  )
}

export default IndexPage
