import React from 'react'
import { useQueryState } from 'next-usequerystate'

import Layout from '../components/Layout/Layout'
import Teaser from '../components/Teaser/Teaser'
import SearchWork from '../components/SearchWork/SearchWork'

const IndexPage = () => {
  const [searchQuery] = useQueryState<string>('query')

  return (
    <Layout title={process.env.NEXT_PUBLIC_TITLE} path={'/doi.org'} >
      <React.Fragment>
        {!searchQuery || searchQuery === '' ? (
          <Teaser title={'works'} />
        ) : (
          <SearchWork searchQuery={searchQuery} />
        )}
      </React.Fragment>
    </Layout>
  )
}

export default IndexPage
