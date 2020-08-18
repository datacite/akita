import React from 'react'
import { useQueryState } from 'next-usequerystate'

import Layout from '../components/Layout/Layout'
import Teaser from '../components/Teaser/Teaser'
import SearchContent from '../components/SearchContent/SearchContent'

const IndexPage = () => {
  const [searchQuery] = useQueryState<string>('query')

  return (
    <Layout title={process.env.NEXT_PUBLIC_TITLE}>
      <React.Fragment>
        {!searchQuery || searchQuery === '' ? (
          <Teaser title={'works'} />
        ) : (
          <SearchContent searchQuery={searchQuery} />
        )}
      </React.Fragment>
    </Layout>
  )
}

export default IndexPage
