import React from 'react'
import { useQueryState } from 'next-usequerystate'

import Layout from '../../components/Layout/Layout'
import About from '../../components/About/About'
import SearchPerson from '../../components/SearchPerson/SearchPerson'

const IndexPersonPage = () => {
  const [searchQuery] = useQueryState<string>('query')
  
  return (
    <Layout title={process.env.NEXT_PUBLIC_TITLE}>
      <React.Fragment>
        {!searchQuery || searchQuery === '' ? (
          <About title={'Introduction'} />
        ) : (
          <SearchPerson searchQuery={searchQuery} />
        )}
      </React.Fragment>
    </Layout>
  )
}

export default IndexPersonPage
